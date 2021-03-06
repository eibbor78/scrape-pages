import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import * as path from 'path'
import { createWriteStream } from 'fs'
import * as errors from '@scrape-pages/util/error'
import * as fs from '@scrape-pages/util/fs'
import { BaseCommand } from './base-command'
import { ResponseError } from '@scrape-pages/util/error'
import * as templates from '@scrape-pages/util/handlebars'
import { FMap } from '@scrape-pages/util/map'
// type imports
import * as Fetch from 'node-fetch'
import { RuntimeState, Settings, Tools, Stream } from '@scrape-pages/types/internal'
import * as I from '@scrape-pages/types/instructions'

type RequestParams = {
  url: string
  headers: { [headerName: string]: string }
  method: string
  body: any
}
type ReadInfo = { bytes: number; value: string; filename: null }
type WriteInfo = { bytes: number; value: null; filename: string }
type DownloadInfoWithValue = Stream.DownloadInfo & { value: string }

class FetchCommand extends BaseCommand<I.FetchCommand, typeof FetchCommand.DEFAULT_PARAMS> {
  protected commandName: 'FETCH'

  public static DEFAULT_PARAMS = {
    METHOD: 'GET' as NonNullable<I.FetchCommand['params']['METHOD']>,
    HEADERS: {},
    BODY: undefined,
    READ: true,
    WRITE: false,
    CACHE: false,
    PRIORITY: -1,
  }
  private writeFolder: string
  private urlTemplate: templates.Template
  private headerTemplates: FMap<string, templates.Template>

  private inFlightFetches: {
    [serializedRequestParams: string]: {
      requestId: number
      request: Promise<DownloadInfoWithValue>
    }
  }
  private abortController: AbortController

  public constructor(settings: Settings, tools: Tools, command: I.FetchCommand) {
    super(settings, tools, command, FetchCommand.DEFAULT_PARAMS, 'FETCH')
    const { URL, HEADERS = {} } = command.params
    this.urlTemplate = templates.compileTemplate(URL)
    this.headerTemplates = FMap.fromObject(HEADERS).map(templates.compileTemplate)
    this.inFlightFetches = {}
  }

  public async stream(payload: Stream.Payload) {
    const { METHOD, CACHE, BODY } = this.params
    const url = this.urlTemplate(payload)
    const headers = this.headerTemplates.map((template) => template(payload)).toObject()
    const requestParams: RequestParams = { url, headers, method: METHOD, body: BODY }

    const { requestId, value } = await (CACHE
      ? this.fetchCached(requestParams)
      : this.fetchUnCached(requestParams))

    const newPayload = this.saveValue(payload, 0, value, requestId)
    return [newPayload]
  }

  private async fetchCached(requestParams: RequestParams) {
    const serializedRequestParams = JSON.stringify(requestParams)
    const inFlightFetch = this.inFlightFetches[serializedRequestParams]
    if (inFlightFetch) {
      const { requestId, request } = inFlightFetch
      const { value } = await request
      return { requestId, value }
    }

    const cachedRequest = this.tools.store.qs.selectNetworkRequestValue(serializedRequestParams)
    if (cachedRequest) {
      if (cachedRequest.status === 'QUEUED') {
        throw new Error(`'QUEUED' network requests should be found under in flight requests.`)
      }
      return { requestId: cachedRequest.id, value: cachedRequest.responseValue }
    } else {
      return await this.fetchUnCached(requestParams)
    }
  }
  private async fetchUnCached(requestParams: RequestParams) {
    const serializedRequestParams = JSON.stringify(requestParams)
    const requestId = this.tools.store.qs.insertQueuedNetworkRequest(
      this.commandId,
      serializedRequestParams
    )
    const { LABEL } = this.command.params
    this.tools.notify.asyncCommandQueued('FETCH', { id: this.commandId, LABEL })
    const { PRIORITY } = this.params
    const task = () => this.cancellableFetch(requestParams, requestId)
    const request = this.tools.queue.push(task, PRIORITY)
    this.inFlightFetches[serializedRequestParams] = { requestId, request }
    const { bytes, filename, value } = await request

    this.tools.store.qs.updateNetworkRequestStatus(requestId, value, filename, bytes, 'COMPLETE')
    return { requestId, value }
  }

  private async cancellableFetch(requestParams: RequestParams, requestId: number) {
    try {
      return await this.fetch(requestParams, requestId)
    } catch (e) {
      if (e.name === 'AbortError' && this.state === RuntimeState.STOPPING) {
        throw new errors.ExpectedException(e, this.commandId)
      }
      throw e
    }
  }
  private async fetch(params: RequestParams, id: number): Promise<DownloadInfoWithValue> {
    const { READ, WRITE } = this.params
    const headers = { 'content-type': 'application/json', ...params.headers }
    const body = JSON.stringify(params.body)
    const { url, method } = params
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal: this.abortController.signal,
    })
    if (!response.ok) throw new ResponseError(response, url)

    this.notifyProgress(response, id)

    if (READ && WRITE) {
      const results = await Promise.all([
        this.read(response, url, id),
        this.write(response, url, id),
      ])
      const [{ value }, { filename, bytes }] = results
      return { value, bytes, filename }
    } else if (READ) {
      const { value, bytes } = await this.read(response, url, id)
      return { value, bytes, filename: null }
    } else if (WRITE) {
      const { filename, bytes } = await this.write(response, url, id)
      return { value: '', bytes, filename }
    } else {
      return { value: '', bytes: 0, filename: null }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async read(response: Fetch.Response, url: string, id: number): Promise<ReadInfo> {
    const buffers: Buffer[] = []

    const buffer: Buffer = await new Promise((resolve, reject) => {
      response.body.on('error', (error) => reject(error))
      response.body.on('data', (chunk) => buffers.push(chunk))
      response.body.on('end', () => resolve(Buffer.concat(buffers)))
    })
    const value = buffer.toString()
    const bytes = Buffer.byteLength(value)
    return { bytes, value, filename: null }
  }

  private async write(response: Fetch.Response, url: string, id: number): Promise<WriteInfo> {
    const filename = path.resolve(this.writeFolder, id.toString() + path.extname(url))
    const dest = createWriteStream(filename)

    await new Promise((resolve, reject) => {
      response.body.pipe(dest)
      dest.on('error', reject)
      dest.on('close', () => resolve())
    })

    return { filename, bytes: dest.bytesWritten, value: null }
  }

  private notifyProgress(response: Fetch.Response, id: Stream.Id) {
    const { command } = this.command
    const { LABEL } = this.command.params
    const metadata = { url: response.url }
    if (this.tools.notify.hasProgressListeners(command)) {
      try {
        const contentLength = parseInt(response.headers.get('content-length') || '0')
        if (contentLength === 0) {
          this.tools.notify.asyncCommandProgress(command, { id, LABEL, progress: NaN, metadata })
        } else {
          let bytes = 0
          response.body.on('data', (chunk) => {
            bytes += chunk.length
            const progress = bytes / contentLength
            this.tools.notify.asyncCommandProgress(this.command.command, {
              id,
              LABEL,
              progress,
              metadata,
            })
          })
        }
      } catch (e) {}
    }
  }

  // runtime-base overrides
  public async onStart() {
    await super.onStart()
    this.writeFolder = path.resolve(this.settings.folder, this.commandId.toString())
    if (this.command.params.WRITE) {
      await fs.mkdirp(this.writeFolder)
    }
    this.abortController = new AbortController()
  }
  public async onStop(prevState: RuntimeState) {
    // console.log('aborting!')
    if (prevState === RuntimeState.ACTIVE) this.abortController.abort()
  }
}

export { FetchCommand }

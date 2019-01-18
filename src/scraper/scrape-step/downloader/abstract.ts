import { ScrapeConfig } from '../../../settings/config/types'
import { Options } from '../../../settings/options/types'
import { Tools } from '../../../tools'

export type DownloadParams = {
  parentId?: number
  incrementIndex: number
  value?: string
}
type RetrieveValue = { downloadValue?: string; filename?: string }
/**
 * base abstract class which other downloaders derive from
 */
export abstract class AbstractDownloader<DownloadData> {
  protected config: ScrapeConfig
  protected options: Options
  protected tools: Tools

  public constructor(config: ScrapeConfig, options: Options, tools: Tools) {
    Object.assign(this, { config, options, tools })
  }
  public run = async (downloadParams: DownloadParams) => {
    const downloadData = this.constructDownload(downloadParams)
    const downloadId = this.tools.store.qs.insertQueuedDownload(
      this.config.name,
      downloadParams,
      downloadData
    )
    this.tools.emitter.scraper(this.config.name).emit.queued(downloadId)
    const { downloadValue, filename } = await this.retrieve(
      downloadId,
      downloadData
    )

    return {
      downloadId,
      // downloadValue conditional is for identity parser,
      // essentially, if there was no data that went into a download, then nothing important was recieved
      downloadValue: downloadData ? downloadValue : downloadParams.value,
      filename
    }
  }
  // implement these methods
  protected abstract constructDownload(
    downloadParams: DownloadParams
  ): DownloadData
  protected abstract retrieve(
    downloadId: number,
    downloadParams: DownloadData
  ): RetrieveValue | Promise<RetrieveValue>
}

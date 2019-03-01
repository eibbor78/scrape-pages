// type imports
import { ScrapeSettings } from '../../../settings'
import { ScraperName, DownloadConfig } from '../../../settings/config/types'
import { Tools } from '../../../tools'
import { Downloader as IdentityDownloader } from './implementations/identity'

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
  protected scraperName: ScraperName
  protected downloadConfig: DownloadConfig | undefined
  protected config: ScrapeSettings['config']
  protected options: ScrapeSettings['options']
  protected params: ScrapeSettings['params']
  protected tools: Tools

  public constructor(
    scraperName: ScraperName,
    downloadConfig: DownloadConfig | undefined,
    settings: ScrapeSettings,
    tools: Tools
  ) {
    Object.assign(this, { scraperName, downloadConfig, ...settings, tools })
  }
  public run = async (downloadParams: DownloadParams) => {
    const downloadData = this.constructDownload(downloadParams)
    const downloadId = this.tools.store.qs.insertQueuedDownload(
      this.scraperName,
      downloadParams,
      // identity downloader is a special case. It does nothing, and the value being passed through is already stored somewhere else.
      this instanceof IdentityDownloader ? undefined : downloadData
    )
    this.tools.emitter.scraper(this.scraperName).emit.queued(downloadId)
    const { downloadValue, filename } = await this.retrieve(downloadId, downloadData)

    return {
      downloadId,
      downloadValue,
      filename
    }
  }
  // implement these methods
  protected abstract constructDownload(downloadParams: DownloadParams): DownloadData
  protected abstract retrieve(
    downloadId: number,
    downloadParams: DownloadData
  ): RetrieveValue | Promise<RetrieveValue>
}
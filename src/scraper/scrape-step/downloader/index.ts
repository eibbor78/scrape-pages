import { Downloader as IdentityDownloader } from './implementations/identity'
import { Downloader as HttpDownloader } from './implementations/http'
// type imports
import { ScrapeConfig } from '../../../settings/config/types'
import { Options } from '../../../settings/options/types'
import { Tools } from '../../../tools'

export const downloaderClassFactory = (
  config: ScrapeConfig,
  options: Options,
  tools: Tools
) => {
  // TODO use type guards
  if (config.download) return new HttpDownloader(config, options, tools)
  else return new IdentityDownloader(config, options, tools)
}

export type DownloaderClass = IdentityDownloader | HttpDownloader

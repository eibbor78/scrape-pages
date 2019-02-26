import * as ops from 'rxjs/operators'
import { Emitter } from './emitter'
import { Store } from './store'
import { Logger } from './logger'
import { Queue } from './queue'

// type imports
import { Settings } from '../settings'
import { Config } from '../settings/config/types'
import { OptionsInit, FlatOptions } from '../settings/options/types'
import { ParamsInit } from '../settings/params/types'

export type Tools = {
  store: Store
  emitter: Emitter
  logger: Logger
  queue: Queue
}
export const initTools = (settings: Settings): Tools => {
  const store = new Store(settings)
  const emitter = new Emitter(settings)
  const logger = new Logger(settings)
  const rateLimiterEventStream = emitter
    .getRxEventStream('useRateLimiter')
    .pipe(ops.map(toggle => !!toggle))
  const queue = new Queue(settings, rateLimiterEventStream)

  return {
    store,
    emitter,
    logger,
    queue
  }
}

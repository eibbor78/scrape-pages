import Store from '../store'
import Emitter from '../emitter'
import Queue from '../queue-observable'
import Logger from '../logger'

export type Dependencies = {
  store: Store
  emitter: Emitter
  queue: Queue
  logger: Logger
}
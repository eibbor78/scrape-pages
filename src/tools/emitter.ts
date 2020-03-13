import { EventEmitter } from 'events'
import * as Rx from 'rxjs'
import * as ops from 'rxjs/operators'
import { ToolBase } from './abstract'
// type imports
import { FMap } from '../util/map'
import { Settings } from '../settings'
import { ScraperName } from '../settings/config/types'

type DownloadInfo = { id: number; filename?: string; mimeType?: string; byteLength?: number }

type OnAnyListener = (event: string, ...args: any[]) => void
class EventEmitterOnAny extends EventEmitter {
  private onAnyListeners: OnAnyListener[] = []

  public emit(event: string, ...args: any[]) {
    for (const listener of this.onAnyListeners) {
      listener(event, ...args)
    }
    return super.emit(event, ...args)
  }
  public onAny(listener: OnAnyListener) {
    this.onAnyListeners.push(listener)
  }
  public removeAllOnAnyListeners() {
    this.onAnyListeners = []
  }
}

class ScraperEmitter {
  public stopRequested: boolean = false
  public constructor(private scraperName: ScraperName, private emitter: EventEmitter) {
    this.on('stop', () => (this.stopRequested = true))
  }

  public listenerCount(event: 'queued' | 'progress' | 'complete') {
    return this.emitter.listenerCount(event)
  }

  public emit(event: 'queued', downloadId: number): boolean
  public emit(event: 'progress', downloadId: number, progress: number): boolean
  public emit(event: 'complete', downloadInfo: DownloadInfo): boolean
  public emit(event: string, ...args: any[]): boolean {
    try {
      return this.emitter.emit(`${this.scraperName}:${event}`, ...args)
    } catch (e) {
      // In this case we really do have an unhandled promise rejection
      // Im not handling an external error. It shouldnt end up here
      Promise.reject(e)
      return false
    }
  }

  public on(event: 'stop', listener: () => void): this
  public on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(`${event}:${this.scraperName}`, listener)
    return this
  }
}

class Emitter extends ToolBase {
  public stopRequested: boolean = false
  public emitter: EventEmitterOnAny
  private scrapers: FMap<string, ScraperEmitter>

  public constructor(settings: Settings) {
    super(settings)

    this.emitter = new EventEmitterOnAny()
    this.emitter.on = this.emitter.on.bind(this.emitter)
    this.emitter.emit = this.emitter.emit.bind(this.emitter)
    this.scrapers = settings.flatConfig.map((_, name) => new ScraperEmitter(name, this.emitter))

    this.on('stop', () => (this.stopRequested = true))
  }

  // get different emitters
  public scraper = (scraper: string) => this.scrapers.getOrThrow(scraper)
  public getBaseEmitter = () => this.emitter
  public getRxEventStream(eventName: 'stop' | 'useRateLimiter') {
    return Rx.fromEvent(this.emitter, eventName).pipe(ops.map(Boolean))
  }

  public emit(event: 'initialized'): boolean
  public emit(event: 'done'): boolean
  public emit(event: 'error', error: Error): boolean
  public emit(event: string, ...args: any[]): boolean {
    try {
      return this.emitter.emit(event, ...args)
    } catch (e) {
      // In this case we really do have an unhandled promise rejection
      // Im not handling an external error. It shouldnt end up here
      Promise.reject(e)
      return false
    }
  }

  public on(event: 'stop', listener: () => void): this
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener)
    return this
  }

  public cleanup() {
    this.emitter.removeAllListeners()
  }
}

export { Emitter }
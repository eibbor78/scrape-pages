import { EventEmitter } from 'events'
import * as Rx from 'rxjs'
import * as ops from 'rxjs/operators'
import * as errors from '@scrape-pages/util/error'
import { RuntimeBase } from '@scrape-pages/runtime/runtime-base'
// type imports
import { RuntimeState, TypeUtils, Settings, Tools, Stream } from '@scrape-pages/types/internal'
import * as I from '@scrape-pages/types/instructions'

type OrUndefined<T> = { [K in keyof T]: T[K] | undefined }
type RequiredField<T> = OrUndefined<Required<T>>
type ParamDefaultsGeneric<T> = Omit<RequiredField<Pick<T, TypeUtils.OptionalKeys<T>>>, 'LABEL'>

type Merge<A extends object, B extends object> = { [K in keyof A & keyof B]: A[K] | B[K] }

// let commandIdCounter = 1

abstract class BaseCommand<
  Command extends I.Command,
  ParamDefaults extends ParamDefaultsGeneric<I.Command['params']>
> extends RuntimeBase {
  protected commandId: Stream.Id
  protected params: Merge<Required<Command['params']>, ParamDefaults & { LABEL: undefined }>

  constructor(
    protected settings: Settings,
    protected tools: Tools,
    protected command: Command,
    // defaultParams is a wider type than ParamDefaults because we cannot trust ParamDefaults to enforce the proper types
    protected defaultParams: ParamDefaultsGeneric<Command['params']>,
    protected commandName: I.Command['command']
  ) {
    super('Command')
    super.name = this.constructor.name
    const optionsDefaults =
      this.settings.options[this.commandName] && this.settings.options[this.commandName]!.defaults
    this.params = {
      LABEL: undefined,
      ...defaultParams,
      ...optionsDefaults,
      ...(this.command.params as any)
    }
    this.commandId = this.command.databaseId!
  }

  abstract async stream(payload: Stream.Payload): Promise<Stream.Payload[]>

  callStream = (payload: Stream.Payload): Stream.Observable => {
    if (this.state == RuntimeState.STOPPING) {
      const e = new Error('Received value while stopping')
      throw new errors.ExpectedException(e, this.commandId)
    }
    // console.log('received value', this.state)
    const values = this.stream(payload)

    return Rx.from(values).pipe(ops.flatMap(promise => promise))
  }

  protected saveValue(
    parentPayload: Stream.Payload,
    valueIndex: number,
    value: string,
    requestId?: number
  ) {
    const { LABEL } = this.command.params
    const id = this.tools.store.qs.insertValue(
      this.commandId,
      parentPayload,
      valueIndex,
      value,
      requestId
    )
    this.tools.notify.commandSucceeded(this.command.command, { id, LABEL })
    return parentPayload.merge({ value, id, valueIndex })
    // return parentPayload.merge({ value, id, valueIndex, operatorIndex: 0 })
  }

  async onStart() {
    const commandId = this.tools.store.qs.insertCommand(this.command.params.LABEL)
    if (commandId !== this.commandId) {
      throw new errors.InternalError(
        `inserted ${commandId} does not match expected command id ${this.commandId}. ${this.params}`
      )
    }
  }
  // async initialize() {
  //   const commandId = this.tools.store.qs.insertCommand(this.command.params.LABEL)
  //   if (commandId !== this.commandId) {
  //     throw new errors.InternalError(
  //       `inserted ${commandId} does not match expected command id ${this.commandId}. ${this.params}`
  //     )
  //   }
  //   await super.initialize()
  // }
}

type AnyCommand = BaseCommand<I.Command, I.Command['params']>

export {
  BaseCommand,
  // type exports
  AnyCommand
}

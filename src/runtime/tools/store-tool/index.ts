import * as path from 'path'
import Sqlite3 from 'better-sqlite3'
import * as fs from '@scrape-pages/util/fs'
import { RuntimeBase } from '@scrape-pages/runtime/runtime-base'
import * as queries from './queries'
import { QuerierApi } from './query-api'
// type imports
import { RuntimeState, Settings, Querier } from '@scrape-pages/types/internal'

class Store extends RuntimeBase {
  private database: Sqlite3.Database
  private _qs: queries.Queries
  public _transaction: Sqlite3.Transaction

  public query: Querier.Interface

  public constructor(private settings: Settings) {
    super('Store')
    const queryApi = new QuerierApi(this, this.settings)
    const query: Querier.Interface = (labels, options) => queryApi.prepare(labels, options)()
    query.prepare = queryApi.prepare
    this.query = query
  }

  public get qs() {
    this.requireState([RuntimeState.ACTIVE, RuntimeState.COMPLETED, RuntimeState.ERRORED])
    return this._qs
  }
  public get transaction() {
    this.requireState([RuntimeState.ACTIVE, RuntimeState.COMPLETED, RuntimeState.ERRORED])
    return this._transaction
  }

  public onStart(prevState: RuntimeState, initializeTables = true) {
    this.database = new Sqlite3(Store.getSqliteFile(this.settings.folder))
    this.database.pragma('journal_mode = WAL')

    if (initializeTables) {
      queries.initializeTables(this.database)
    }
    this._qs = queries.createStatements(this.database)
    this._transaction = this.database.transaction.bind(this.database)
    if (initializeTables) {
      this._qs.checkProgramVersion()
      this._qs.updateProgramState(RuntimeState.ACTIVE)
      this._qs.truncateTables()
    }
    // return Promise.resolve()
  }
  public async onComplete() {
    this.qs.updateProgramState(RuntimeState.COMPLETED)
  }
  private static getSqliteFile(folder: string) {
    return path.resolve(folder, 'store.sqlite')
  }
  public static databaseIsInitialized(folder: string) {
    return fs.existsSync(Store.getSqliteFile(folder))
  }
}

export { Store }

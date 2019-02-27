import { Database } from './database'
import { flattenConfig } from '../../settings/config'
import { groupUntilSeparator } from '../../util/array'
import { Config, FlatConfig } from '../../settings/config/types'
import { createTables, createStatements } from './queries'
// type imports
import { Transaction } from 'better-sqlite3'
import { Settings } from '../../settings'
import { ScraperName } from '../../settings/config/types'
import { SelectedRow as OrderedScrapersRow } from './queries/select-ordered-scrapers'

class Store {
  public qs: ReturnType<typeof createStatements>
  public transaction: Transaction
  public query: Query
  private config: Config
  private flatConfig: FlatConfig
  private database: Database

  public constructor({ config, flatConfig, paramsInit: { folder } }: Settings) {
    this.config = config
    this.flatConfig = flatConfig
    // initialize sqlite3 database
    this.database = new Database(folder)
    this.database.pragma('journal_mode = WAL')
    this.transaction = this.database.transaction.bind(this.database)
    // initialize tables (if they do not exist already)
    createTables(this.flatConfig, this.database)()
    // prepare statements
    this.qs = createStatements(this.flatConfig, this.database)

    // create external query function
    const query: Query = params => this.prepareQuery(params)()
    // optionally call the `prepare` function first to get a prepared sqlite statement
    query.prepare = this.prepareQuery
    this.query = query
  }

  private prepareQuery: Query['prepare'] = ({ scrapers, groupBy }) => {
    const hasScrapeConfig = this.flatConfig.has.bind(this.flatConfig)
    if (!scrapers.some(hasScrapeConfig)) return () => []

    const scrapersInConfig = scrapers.concat(groupBy || []).filter(hasScrapeConfig)

    const preparedStatment = this.qs.selectOrderedScrapers([...new Set(scrapersInConfig)])
    return () => {
      const result = preparedStatment()
      return groupUntilSeparator(
        result,
        ({ scraper }) => scraper === groupBy,
        groupBy !== undefined && scrapers.includes(groupBy)
      )
    }
  }
}

interface Query {
  (...args: ArgumentTypes<Query['prepare']>): OrderedScrapersRow[][]
  prepare: (
    params: { scrapers: ScraperName[]; groupBy?: ScraperName }
  ) => () => OrderedScrapersRow[][]
}

export { Store }

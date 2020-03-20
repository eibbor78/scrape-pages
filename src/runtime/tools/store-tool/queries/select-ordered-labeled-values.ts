import { Instructions } from '@scrape-pages/types/instructions'
import { sql, Query } from './query-base'

function getSelectedLabelsSql(labels: string[]) {
  return labels.map(s => `'${s}'`).join(',')
}
function getWaitingJoinsSql(instructions: Instructions, labels: string[]) {
  return `cte.parentTreeId`
}
function findLowestDepth(instructions: Instructions, labels: string[]) {
  return -1
}

const template = (labels: string[], instructions: Instructions) => sql`
WITH cte as (
  SELECT
    crawlerTree.value,
    crawlerTree.parentTreeId,
    crawlerTree.operatorIndex,
    crawlerTree.valueIndex,
    0 as recurseDepth,
    crawlerTree.networkRequestId,
    commands.id as commandId,
    commands.label
  FROM commands
  INNER JOIN crawlerTree ON crawlerTree.commandId = commands.id
  WHERE commands.label in (${getSelectedLabelsSql(labels)}) -- TODO can I swap the order here?
  UNION ALL
  SELECT
    cte.value,
    parentEntries.parentTreeId,
    parentEntries.operatorIndex,
    parentEntries.valueIndex,
    cte.recurseDepth + 1,
    cte.networkRequestId,
    cte.commandId,
    cte.label
  FROM cte
  INNER JOIN crawlerTree as parentEntries
  ON ${getWaitingJoinsSql(instructions, labels)} = parentEntries.id
  WHERE recurseDepth < ${findLowestDepth(instructions, labels).toString()}
  ORDER BY
    recurseDepth,
    valueIndex,
    operatorIndex
)
SELECT
  cte.label, -- TODO this should probably be a INNER JOIN instead of something we carry down
  cte.label,
  cte.value,
  networkRequests.filename,
  networkRequests.byteLength,
  networkRequests.status
FROM cte
LEFT JOIN networkRequests ON cte.networkRequestId = networkRequests.id
-- WHERE recurseDepth = ${findLowestDepth(instructions, labels).toString()}
ORDER BY
  recurseDepth,
  operatorIndex,
  valueIndex
`

type SelectedRow = {
  label: string
  id: number
  value?: string
  // downloadData: string | null
  // filename: string | null
  // byteLength: string | null
  // status: string
}

class SelectOrderedLabeledValues extends Query {
  // TODO maybe we accept commandIds instead of labels?
  // TODO we want to pass in some sort of flattened structure that describes the commands
  public call = (instructions: Instructions, labels: string[]) => {
    const templateStr = template(labels, instructions)
    const statement = this.database.prepare(template(labels, instructions))
    return (): SelectedRow[] => statement.all()
  }
}

export {
  SelectOrderedLabeledValues,
  // type exports
  SelectedRow
}

sql`
WITH cte AS (
  SELECT
    parsedTree.id,
    downloads.id as downloadId,
    downloads.cacheId,
    downloads.complete,
    parsedValue,
    parentId,
    parseIndex,
    incrementIndex,
    0 as recurseDepth,
    downloads.scraper,
    parsedTree.scraper AS currentScraper
  FROM downloads
  LEFT JOIN parsedTree ON parsedTree.downloadId = downloads.id
  WHERE downloads.scraper in ({{{ selectedScrapers }}})
  UNION ALL
  SELECT
    pTree.id,
    cte.downloadId,
    cte.cacheId,
    cte.complete,
    cte.parsedValue,
    pTree.parentId,
    pTree.parseIndex,
    pDownloads.incrementIndex,
    cte.recurseDepth + 1,
    cte.scraper,
    pTree.scraper AS currentScraper
  FROM cte
  INNER JOIN parsedTree as pTree
  ON {{{ waitingJoinsSql }}} = pTree.id
  INNER JOIN downloads as pDownloads
  ON pTree.downloadId = pDownloads.id
  WHERE recurseDepth < {{lowestDepth}} -- this may be a problem, or it may be fine. This prevents extra work past what we calculate the maximum amount of work is
  ORDER BY
  recurseDepth, -- recurseDepth ensures that we move from the bottom of the tree to the top
  parseIndex, -- parseIndex orders by appearance on html/json
  incrementIndex, -- incrementIndex handles 'incrementUntil'
  parentId -- parentId handles 'scrapeNext'
)
SELECT
  cte.id,
  cte.scraper,
  parsedValue,
  downloadData, filename, byteLength, complete
{{#if debugMode}}
  , downloadId, recurseDepth, incrementIndex, parseIndex, currentScraper
{{/if}}
FROM cte
LEFT JOIN downloadCache ON downloadCache.id = cte.cacheId -- grab additional download information outside of ordering
{{#unless debugMode}}
  WHERE recurseDepth = {{lowestDepth}}
{{/unless}}
ORDER BY
  recurseDepth,
  incrementIndex,
  parseIndex
`

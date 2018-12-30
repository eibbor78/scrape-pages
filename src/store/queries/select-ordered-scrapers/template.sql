WITH cte AS (
  SELECT
    parsedTree.id,
    downloads.id as downloadId,
    url,
    filename,
    parsedValue,
    parentId,
    parseIndex,
    incrementIndex,
    0 as recurseDepth,
    parsedTree.scraper,
    parsedTree.scraper AS currentScraper,
    0 as levelOrder
  FROM parsedTree INNER JOIN downloads ON parsedTree.downloadId = downloads.id
  WHERE parsedTree.scraper in ({{{ selectedScrapers }}})
  UNION ALL
  SELECT
    pTree.id,
    cte.downloadId,
    cte.url,
    cte.filename,
    cte.parsedValue,
    pTree.parentId,
    pTree.parseIndex,
    pDownloads.incrementIndex,
    cte.recurseDepth + 1,
    cte.scraper,
    pTree.scraper AS currentScraper,
    {{{orderLevelColumnSql}}} as levelOrder
  FROM cte
  INNER JOIN parsedTree as pTree
  ON {{{ waitingJoinsSql }}} = pTree.id
  INNER JOIN downloads as pDownloads
  ON pTree.downloadId = pDownloads.id
  ORDER BY
  recurseDepth, -- recurseDepth ensures that we move from the bottom of the tree to the top
  parseIndex, -- parseIndex orders by appearance on html/json
  incrementIndex, -- incrementIndex handles `incrementUntil`
  levelOrder, -- see make-dynamic-order-level-column.ts
  parentId -- parentId handles `scrapeNext`
)
SELECT
--  *
  scraper,
  --  id,
  parsedValue,
  --  downloadId,
  url, filename
FROM cte
WHERE recurseDepth = {{lowestDepth}}
ORDER BY
  recurseDepth,
  incrementIndex,
  parseIndex,
  levelOrder

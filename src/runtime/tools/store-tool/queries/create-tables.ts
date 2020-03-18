import { sql, Query } from './query-base'

const template = sql`
BEGIN TRANSACTION;

-- We delete the tree each time. Because adding more cache logic is a pain and rewalking the tree is cheap.
-- downloadCache remains 'cached' though, so we do not reuse bandwidth unnecessarily
DROP TABLE IF EXISTS crawlerTree;

CREATE TABLE commands (
  id INTEGER PRIMARY KEY NOT NULL,
  label TEXT
);

CREATE TABLE crawlerTree (
  id INTEGER PRIMARY KEY NOT NULL,
  -- TODO normalize this field into a 'command' table. label is still possibly undefined, but we always have an id, and commands get it when they initialize
  commandId INT NOT NULL,
  parentTreeId INT,
  operatorIndex INT NOT NULL, -- index that represents either a .reduce() or .loop() index
  valueIndex INT NOT NULL, -- index that represents the index of a value in a command output
  value TEXT, -- it is only empty while an incomplete command is in progress
  cacheId INT,
  complete BIT DEFAULT (0) NOT NULL,
  FOREIGN KEY (parentTreeId) REFERENCES crawlerTree(id),
  FOREIGN KEY (cacheId) REFERENCES networkCache(id),
  FOREIGN KEY (commandId) REFERENCES commands(id)
);

-- this table is only written to when cache:true
CREATE TABLE networkCache (
  id INTEGER PRIMARY KEY NOT NULL,
  commandId INT NOT NULL,
  protocol TEXT NOT NULL,
  downloadData TEXT NOT NULL,
  downloadValue TEXT NOT NULL,
  mimeType TEXT,
  filename TEXT,
  byteLength TEXT,
  failed BIT DEFAULT (0) NOT NULL
);

-- TODO use these indexes?
CREATE UNIQUE INDEX IF NOT EXISTS crawlerValueId ON crawlerTree(id);
CREATE        INDEX IF NOT EXISTS indexes ON crawlerTree(commandId);
CREATE UNIQUE INDEX IF NOT EXISTS indexes ON networkCache(downloadData);

COMMIT;
`

class CreateTables extends Query {
  call = () => {
    this.database.pragma('foreign_keys = OFF')
    this.database.exec(template)
    this.database.pragma('foreign_keys = ON')
  }
}

export { CreateTables }

// this is the old ass bitch
sql`
BEGIN TRANSACTION;

-- creating the tree and parsing is always re-done on a second pass.
-- The reason for this is because we cannot assume the config is the same on a second run
-- downloadCache remains 'cached' though, so we do not reuse bandwidth unnecessarily
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS parsedTree;

CREATE TABLE downloads (
  id INTEGER PRIMARY KEY NOT NULL,
  scraper TEXT NOT NULL,
  incrementIndex INT NOT NULL, -- scrape config increment number
  parseParentId INT, -- necessary to distinguish identity steps
  cacheId INT, -- cacheId will be NULL when complete = 1 if and only if scraper is identity scraper
  complete BIT DEFAULT (0) NOT NULL,
  FOREIGN KEY (parseParentId) REFERENCES parsedTree(id),
  FOREIGN KEY (cacheId) REFERENCES downloadCache(id)
);

CREATE TABLE parsedTree (
  id INTEGER PRIMARY KEY NOT NULL,
  scraper TEXT NOT NULL,
  downloadId INT NOT NULL,
  parentId INT,
  parseIndex INT NOT NULL, -- index the item appeared on the page
  parsedValue TEXT NOT NULL,
  format TEXT NOT NULL, -- html, json, identity

  FOREIGN KEY (parentId) REFERENCES parsedTree(id),
  FOREIGN KEY(downloadId) REFERENCES downloads(id)
);

-- this table is only written to when cache:true
CREATE TABLE IF NOT EXISTS downloadCache (
  id INTEGER PRIMARY KEY NOT NULL,
  scraper TEXT NOT NULL,
  protocol TEXT NOT NULL,
  downloadData TEXT NOT NULL,
  downloadValue TEXT NOT NULL,
  mimeType TEXT,
  filename TEXT,
  byteLength TEXT,
  failed BIT DEFAULT (0) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS downloadId ON downloads(id);
CREATE UNIQUE INDEX IF NOT EXISTS indexes ON downloads(scraper, incrementIndex, parseParentId);
CREATE UNIQUE INDEX IF NOT EXISTS indexes ON downloadCache(downloadData);

COMMIT;
`


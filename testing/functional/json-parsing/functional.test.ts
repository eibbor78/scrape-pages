import * as path from 'path'
import { expect } from 'chai'

import { RUN_OUTPUT_FOLDER, NockFolderMock } from '../../setup'
import { config, configParseJsonTwice, configParseJsonInsideScript } from './config'
import { ScraperProgram } from '../../../src'

const resourceFolder = `${__dirname}/fixtures`
const resourceUrl = `http://${path.basename(__dirname)}.com`

const options = {}
const params = {
  folder: path.resolve(RUN_OUTPUT_FOLDER, `${path.basename(__dirname)}`),
  cleanFolder: true
}

describe(__filename, () => {
  const siteMock = new NockFolderMock(resourceFolder, resourceUrl)

  beforeEach(siteMock.init)
  afterEach(siteMock.done)

  describe('with simple json response', () => {
    it('should get em', async () => {
      const scraper = new ScraperProgram(config, options, params)
      await new Promise(resolve => scraper.on('done', resolve).start())

      const result = scraper.query(['apiResponse'])
      expect(result.map(r => r['apiResponse'].map(c => c.parsedValue))).to.be.deep.equal([
        ['the', 'quick', 'brown', 'fox']
      ])
    })
  })

  describe('with json blob parsed nested', () => {
    it('should stringify, then parse, then stringify', async () => {
      const scraper = new ScraperProgram(configParseJsonTwice, options, params)
      await new Promise(resolve => scraper.on('done', resolve).start())

      const result = scraper.query(['parseContentFromPost'], { groupBy: 'parseContentFromPost' })
      expect(result).to.have.length(4)
      expect(result.map(r => r['parseContentFromPost'].map(c => c.parsedValue))).to.be.deep.equal([
        ['the'],
        ['quick'],
        ['brown'],
        ['fox']
      ])
    })
  })

  describe('with json that needs to be parsed out of a file', () => {
    it('should stringify, then parse, then stringify', async () => {
      const scraper = new ScraperProgram(configParseJsonInsideScript, options, params)
      await new Promise(resolve => scraper.on('done', resolve).start())

      const result = scraper.query(['jsonInJs'])
      expect(result[0]['jsonInJs']).to.have.length(9)
      expect(result.map(r => r['jsonInJs'].map(c => c.parsedValue))).to.be.deep.equal([
        ['the', 'quick', 'brown', 'fox', 'jumped', 'over', 'the', 'lazy', 'dog']
      ])
    })
  })
})
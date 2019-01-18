import os from 'os'
import path from 'path'

import { expect, use } from 'chai'
import _ from 'lodash/fp'

import '../../use-chai-plugins'
import { NockFolderMock } from '../../nock-folder-mock'
import { config } from './config'
import expectedQueryResult from './resources/expected-query-result.json'
import { scrape } from '../../../src'

describe('increment gallery site', () => {
  describe('with instant scraper', function() {
    let scraperQueryForFunction: any
    before(done => {
      ;(async () => {
        const endpointMock = new NockFolderMock(
          `${__dirname}/resources/mock-endpoints`,
          'http://increment-gallery-site.com'
        )
        await endpointMock.init()

        const options = {
          folder: path.resolve(os.tmpdir(), this.fullTitle()),
          cleanFolder: true
        }
        const { on, emit, query } = await scrape(config, options)
        on('done', () => {
          scraperQueryForFunction = query
          done()
        })
      })()
    })

    it('should group each image into a separate slot, in order', () => {
      const result = scraperQueryForFunction({
        scrapers: ['image'],
        groupBy: 'image'
      })
      expect(result)
        .excludingEvery('filename')
        .to.be.deep.equal(expectedQueryResult.map(_.omit('tag')))
    })
    it('should group tags and images together that were found on the same page', () => {
      const result = scraperQueryForFunction({
        scrapers: ['image', 'tag'],
        groupBy: 'image-page'
      })
      expect(result)
        .excludingEvery('filename')
        .to.be.deep.equal(expectedQueryResult)
    })
  })

  describe('with psuedo-random delayed scraper', function() {
    let scraperQueryForFunction: any
    before(done => {
      ;(async () => {
        const endpointMock = new NockFolderMock(
          `${__dirname}/resources/mock-endpoints`,
          'http://increment-gallery-site.com',
          { randomSeed: 1 }
        )
        await endpointMock.init()

        const options = {
          folder: path.resolve(os.tmpdir(), this.fullTitle()),
          cleanFolder: true
        }
        const { on, emit, query } = await scrape(config, options)
        on('done', () => {
          scraperQueryForFunction = query
          done()
        })
      })()
    })

    it('should keep images and tags together, in order', () => {
      const result = scraperQueryForFunction({
        scrapers: ['image', 'tag'],
        groupBy: 'image-page'
      })
      expect(result)
        .excludingEvery('filename')
        .to.be.deep.equal(expectedQueryResult)
    })
  })
})

/**
 * I need a way to say, use the cached response from certain scrapers if hit, and always download again for
 * others
 * - useCachedResponse? default to true?
 *
 * I need a way to say reuse existing store if found, if not, remove the files
 * - cleanFolder
 */

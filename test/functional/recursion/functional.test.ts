import { expect } from 'chai'
import { FunctionalTestSetup, assertQueryResultPartial } from '@test/functional/setup'
import { ScraperProgram } from '@scrape-pages'
import * as instructions from './instructions'

const testEnv = new FunctionalTestSetup(__dirname)

describe(__filename, () => {
  beforeEach(testEnv.beforeEach)
  afterEach(testEnv.afterEach)

  describe('query ordering', () => {
    describe('with simple instructions', () => {
      it(`query(['image', 'title'], {groupBy: 'post'})`, async () => {
        const scraper = new ScraperProgram(instructions.simple, testEnv.outputFolder)
        await scraper.start()
        await scraper.toPromise()
        const result = scraper.query(['image', 'title'], { groupBy: 'post' })
        // prettier-ignore
        assertQueryResultPartial(result, [
          {
            image: [
              { requestParams: '{"url":"http://recursion/image/brown.jpg","headers":{},"method":"GET"}' },
            ],
            title: [{ value: 'Brown' }],
          },
          {
            image: [{
              requestParams: '{"url":"http://recursion/image/fox.jpg","headers":{},"method":"GET"}',
            }],
            title: [{ value: 'Fox' }]
          },
          {
            image: [{
              requestParams: '{"url":"http://recursion/image/jumped.jpg","headers":{},"method":"GET"}',
            }],
            title: [{ value: 'Jumped' }]
          },
          {
            image: [{
              requestParams: '{"url":"http://recursion/image/over.jpg","headers":{},"method":"GET"}',
            }],
            title: [{ value: 'Over' }]
          }
        ])
      })
    })
    describe.only('with merging instructions', () => {
      const scraper = new ScraperProgram(instructions.merging, testEnv.outputFolder)

      beforeEach(async () => {
        await scraper.start()
        await scraper.toPromise()
      })

      it(`query(['image', 'title'], {groupBy: 'post'})`, async () => {
        const result = scraper.query(['image', 'title'], { groupBy: 'post' })
        // prettier-ignore
        assertQueryResultPartial(result, [
          {
            image: [
              { requestParams: '{"url":"http://recursion/image/the.jpg","headers":{},"method":"GET"}' },
            ],
            title: [{ value: 'The' }],
          },
          {
            image: [
              { requestParams: '{"url":"http://recursion/image/quick.jpg","headers":{},"method":"GET"}' },
            ],
            title: [{ value: 'Quick' }],
          },
          {
            image: [
              { requestParams: '{"url":"http://recursion/image/brown.jpg","headers":{},"method":"GET"}' },
            ],
            title: [{ value: 'Brown' }],
          },
          {
            image: [{
              requestParams: '{"url":"http://recursion/image/fox.jpg","headers":{},"method":"GET"}',
            }],
            title: [{ value: 'Fox' }]
          },
          {
            image: [{
              requestParams: '{"url":"http://recursion/image/jumped.jpg","headers":{},"method":"GET"}',
            }],
            title: [{ value: 'Jumped' }]
          },
          {
            image: [{
              requestParams: '{"url":"http://recursion/image/over.jpg","headers":{},"method":"GET"}',
            }],
            title: [{ value: 'Over' }]
          }
        ])
      })

      it(`query(['image'])`, async () => {
        const result = scraper.query(['image'])
        // console.log(result[0])

        // prettier-ignore
        assertQueryResultPartial(result, [
          {
            image: [
              { requestParams: '{"url":"http://recursion/image/the.jpg","headers":{},"method":"GET"}' },
              { requestParams: '{"url":"http://recursion/image/quick.jpg","headers":{},"method":"GET"}' },
              { requestParams: '{"url":"http://recursion/image/brown.jpg","headers":{},"method":"GET"}' },
              { requestParams: '{"url":"http://recursion/image/fox.jpg","headers":{},"method":"GET"}' },
              { requestParams: '{"url":"http://recursion/image/jumped.jpg","headers":{},"method":"GET"}' },
              { requestParams: '{"url":"http://recursion/image/over.jpg","headers":{},"method":"GET"}' }
            ]
          }
        ])
      })
    })
  })

  it('should handle simple instruction', async () => {
    const scraper = new ScraperProgram(instructions.simple, testEnv.outputFolder)
    await scraper.start()
    await scraper.toPromise()

    const result = scraper.query(['image'])
    // prettier-ignore
    assertQueryResultPartial(result, [
      {
        image: [
          { requestParams: '{"url":"http://recursion/image/brown.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/fox.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/jumped.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/over.jpg","headers":{},"method":"GET"}' }
        ]
      }
    ])
  })
  it('should handle merging instruction', async () => {
    const scraper = new ScraperProgram(instructions.merging, testEnv.outputFolder)
    await scraper.start()
    await scraper.toPromise()

    const result = scraper.query(['image'])

    // prettier-ignore
    assertQueryResultPartial(result, [
      {
        image: [
          { requestParams: '{"url":"http://recursion/image/the.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/quick.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/brown.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/fox.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/jumped.jpg","headers":{},"method":"GET"}' },
          { requestParams: '{"url":"http://recursion/image/over.jpg","headers":{},"method":"GET"}' }
        ]
      }
    ])
  })
})

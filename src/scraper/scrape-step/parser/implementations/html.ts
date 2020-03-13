import * as cheerio from 'cheerio'
import { AbstractParser } from '../abstract'
// type imports
import { ScrapeSettings } from '../../../../settings'
import {
  ParseConfigInterface,
  ParseConfigHtml,
  ParseConfigXml
} from '../../../../settings/config/types'
import { Tools } from '../../../../tools'

export class Parser extends AbstractParser {
  public type: 'html' | 'xml' = 'html'

  protected parseConfig: ParseConfigHtml | ParseConfigXml
  protected cheerioFlags: {}
  private parser: (value: string) => string[]

  public constructor(
    parseConfig: ParseConfigHtml | ParseConfigXml,
    settings: ScrapeSettings,
    tools: Tools,
    cheerioFlags: {} = {}
  ) {
    super(parseConfig, settings, tools)
    this.parseConfig = parseConfig // must be set on again on child classes https://github.com/babel/babel/issues/9439
    this.parser = this.parseConfig.attribute
      ? this.selectAttrVals(this.parseConfig.attribute)
      : this.selectTextVals
    this.cheerioFlags = cheerioFlags
  }

  public static isHtmlParseConfig = (
    parseConfig: ParseConfigInterface
  ): parseConfig is ParseConfigHtml => (parseConfig as ParseConfigHtml).format === 'html'

  protected parse = (value: string) => this.parser(value)

  private selectTextVals = (value: string) => {
    const $ = cheerio.load(value, this.cheerioFlags)
    const values: string[] = []
    const selection = $(this.parseConfig.selector)
    selection.each(function() {
      values.push($(this).text())
    })
    return values
  }
  private selectAttrVals = (attribute: string) => (value: string) => {
    const $ = cheerio.load(value, this.cheerioFlags)
    const values: string[] = []
    const selection = $(this.parseConfig.selector)
    // this type definition is wrong because we are using the RC version of cheerio
    // AttrFunction in @types/cheerio does not match the actual method
    // type AttrFunction = (index: number, attributeVal: string) => void
    selection.attr(attribute, (i: any, attributeVal: any) => {
      if (attributeVal) values.push(attributeVal)
    })
    return values
  }
}
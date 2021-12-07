import * as retext from "./utils/retext.js"
import { mapValues, groupBy, uniq, keyBy } from "lodash-es"

const privates = new WeakMap()

export default class LanguageAnalyzer {
  constructor(document, options = {}) {
    privates.set(this, {
      document,
      options,
      data: {},
      keywords: {},
      keyphrases: {}
    })
  }

  get documentText() {
    return this.document.toText(this.options.filter)
  }

  get document() {
    return privates.get(this).document
  }

  get options() {
    return privates.get(this).options
  }

  get data() {
    return privates.get(this).data
  }

  get keywordsFrequency() {
    const grouped = groupBy(
      this.keywordResults.flatMap((i) => i.matches || []),
      (match) => this.document.utils.toString(match.node)
    )

    return mapValues(grouped, (v) => v.length)
  }

  get uniqueKeywords() {
    return uniq(
      this.keywordResults
        .flatMap((i) => i.matches || [])
        .map((i) => this.document.utils.toString(i.node))
    ).sort()
  }

  get keywordResults() {
    return Object.values(this.keywordsIndex).flatMap((v) => v)
  }

  get keyphraseResults() {
    return Object.values(this.keyphrasesIndex).flatMap((v) => v)
  }

  get keywordsIndex() {
    return privates.get(this).keywords
  }

  get keyphrasesIndex() {
    return privates.get(this).keywords
  }

  async run() {
    await this.extractKeywords()
    return this
  }

  /**
   * This will use the retext processor to go through each node of the document and extract keywords and keyphrases
   * @private
   */
  async extractKeywords(options = {}) {
    const { children } = this.document.ast
    const { filter = () => true } = options

    await Promise.all(
      children.filter(filter).map((node) =>
        retext.process(this.document.utils.toString(node)).then((result) => {
          node.keywords = result.data.keywords
          node.keyphrases = result.data.keyphrases
        })
      )
    )

    const results = keyBy(
      children.flatMap((node, index) => ({
        keyphrases: node.keyphrases,
        keywords: node.keywords,
        text: this.document.utils.toString(node),
        index: index
      })),
      "text"
    )

    Object.values(results).forEach(({ keyphrases, keywords, text }) => {
      this.keyphrasesIndex[text] = keyphrases.map((result) => {
        result.matches.forEach((i) => {
          i.text = this.document.utils.toString(i.node)
          i.parentText = this.document.utils.toString(i.parent)
        })

        return result
      })

      this.keywordsIndex[text] = keywords.map((result) => {
        result.matches.forEach((i) => {
          i.text = this.document.utils.toString(i.node)
          i.parentText = this.document.utils.toString(i.parent)
        })

        return result
      })
    })

    privates.get(this).data = results

    return results
  }
}

import * as retext from "./utils/retext.js"
import { keyBy } from "lodash-es"

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

  get document() {
    return privates.get(this).document
  }

  get options() {
    return privates.get(this).options
  }

  get data() {
    return privates.get(this).data
  }

  get keywords() {
    return Object.values(this.keywordsIndex).flatMap((v) => v)
  }

  get keyphrases() {
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
      this.keyphrasesIndex[text] = keyphrases
      this.keywordsIndex[text] = keywords
    })

    privates.get(this).data = results

    return results
  }
}

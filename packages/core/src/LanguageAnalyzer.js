import * as retext from "./utils/retext.js"
import { mapValues, groupBy, uniq, keyBy } from "lodash-es"
import AstQuery from "./AstQuery.js"

const privates = new WeakMap()

export default class LanguageAnalyzer {
  constructor(document, options = {}) {
    privates.set(this, {
      document,
      options,
      nodesIndex: new Map(),
      nodeTypeIndex: new Map()
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

  get nodesIndex() {
    return privates.get(this).nodesIndex
  }

  get nodeTypeIndex() {
    return privates.get(this).nodeTypeIndex
  }

  async run() {
    await Promise.all([
      this.analyzeNodesByType("heading"),
      this.analyzeNodesByType("paragraph")
    ])

    return this
  }

  query(textOrNode = this.documentText) {
    const ast = this.parse(textOrNode)
    return new AstQuery(ast)
  }

  parse(textOrNode = this.documentText) {
    let text = textOrNode

    if (typeof textOrNode === "object") {
      text = this.document.utils.toString(textOrNode)
    }

    return retext.parse(text)
  }

  async analyze(textOrNode = this.documentText) {
    let text = textOrNode

    if (typeof textOrNode === "object") {
      text = this.document.utils.toString(textOrNode)
    }

    const results = await retext.process(text).then(({ data }) => data)

    return results
  }

  /**
   * @private
   */
  async analyzeNodesByType(nodeType) {
    const { toString } = this.document.utils
    const nodesOfType = this.document.astQuery.selectAll(nodeType)

    await Promise.all(
      nodesOfType.map((node) =>
        this.analyze(node).then(({ keywords, keyphrases }) => {
          const entry = {
            keywords: keywords.map((i) => ({
              word: uniq(i.matches.map((i) => toString(i.node)))[0],
              ...i
            })),
            keyphrases: keyphrases.map((i) => ({
              ...i,
              phrases: uniq(
                i.matches.map((i) => i.nodes.map(toString).join(""))
              )
            })),
            type: nodeType,
            node
          }

          this.nodesIndex.set(node, entry)

          if (!this.nodeTypeIndex.has(nodeType)) {
            this.nodeTypeIndex.set(nodeType, [])
          }

          this.nodeTypeIndex.get(nodeType).push(entry)
        })
      )
    )
  }
}

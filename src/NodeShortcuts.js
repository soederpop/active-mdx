import { parseTable } from "./Document.js"
/**
 * The NodeShortcuts class is a helper class for the Document class,
 * it will take the AST of a given document and provide getters for common queries for nodes.
 *
 * For example, the first or last node, all ehadings, the first heading, second heading, code blocks, links, etc.
 */
export default class NodeShortcuts {
  constructor(astQuery) {
    this.ast = astQuery.ast
    this.astQuery = astQuery
  }

  get first() {
    return this.ast.children[0]
  }

  get last() {
    return this.ast.children[this.ast.children.length - 1]
  }

  get headings() {
    return this.astQuery.selectAll("heading")
  }

  get firstHeading() {
    return this.headings[0]
  }

  get secondHeading() {
    return this.headings[1]
  }

  get lastHeading() {
    return this.headings[this.headings.length - 1]
  }

  get leadingElementsAfterTitle() {
    const { firstHeading, secondHeading } = this

    if (secondHeading) {
      return this.astQuery.findBetween(firstHeading, secondHeading)
    } else {
      return this.astQuery.findAllAfter(firstHeading)
    }
  }

  get imports() {
    return this.astQuery.selectAll("import")
  }

  get headingsByDepth() {
    return this.headings.reduce((memo, heading) => {
      memo[heading.depth] = memo[heading.depth] || []
      memo[heading.depth].push(heading)
      return memo
    }, {})
  }

  get links() {
    return this.astQuery.selectAll("link")
  }

  get tables() {
    return this.astQuery.selectAll("table")
  }

  get tablesAsData() {
    return this.tables.map(parseTable)
  }
}

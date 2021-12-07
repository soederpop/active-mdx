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

  /**
   * Returns the first node in the document's ast
   *
   * @type {AstNode}
   */
  get first() {
    return this.ast.children[0]
  }

  /**
   * Returns the last node in the document's ast
   *
   * @type {AstNode}
   */
  get last() {
    return this.ast.children[this.ast.children.length - 1]
  }

  /**
   * Returns all the heading nodes in the document's ast
   *
   * @type {Array[AstNode]}
   */
  get headings() {
    return this.astQuery.selectAll("heading")
  }

  /**
   * Returns the first heading node in the document's ast
   *
   * @type {AstNode}
   */
  get firstHeading() {
    return this.headings[0]
  }

  /**
   * Returns the second heading node in the document's ast
   *
   * @type {AstNode}
   */
  get secondHeading() {
    return this.headings[1]
  }

  /**
   * Returns the last heading node in the document's ast
   *
   * @type {AstNode}
   */
  get lastHeading() {
    return this.headings[this.headings.length - 1]
  }

  /**
   * Returns the nodes that come after the document title and before the first subheading.
   *
   * @type {Array[AstNode]}
   */
  get leadingElementsAfterTitle() {
    const { firstHeading, secondHeading } = this

    if (secondHeading) {
      return this.astQuery.findBetween(firstHeading, secondHeading)
    } else {
      return this.astQuery.findAllAfter(firstHeading)
    }
  }

  /**
   * Returns the import statement nodes from the document's ast, if any used by MDX.
   *
   * @type {Array[AstNode]}
   */
  get imports() {
    return this.astQuery.selectAll("import")
  }

  /**
   * Returns an object with the various depths 1-6 and an array of heading nodes at that depth.
   *
   * @type {Object{Number: Array[AstNode]}}
   */
  get headingsByDepth() {
    return this.headings.reduce((memo, heading) => {
      memo[heading.depth] = memo[heading.depth] || []
      memo[heading.depth].push(heading)
      return memo
    }, {})
  }

  /**
   * Returns all of the link nodes from the document's ast.
   *
   * @type {Array[AstNode]}
   */
  get links() {
    return this.astQuery.selectAll("link")
  }

  /**
   * Returns all of the table nodes from the document's ast.
   *
   * @type {Array[AstNode]}
   */
  get tables() {
    return this.astQuery.selectAll("table")
  }

  /**
   * Returns each table parsed as data.  Each table is an array of objects, each object is a row, whose keys are the headings of the table.
   */
  get tablesAsData() {
    return this.tables.map(parseTable)
  }

  /**
   * Returns the paragraph nodes
   */
  get paragraphs() {
    return this.astQuery.selectAll("paragraph")
  }

  /**
   * Returns the list nodes
   */
  get lists() {
    return this.astQuery.selectAll("list")
  }
}

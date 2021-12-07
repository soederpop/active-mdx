import { findBefore } from "unist-util-find-before"
import { findAfter } from "unist-util-find-after"
import { findAllBefore } from "unist-util-find-all-before"
import { findAllAfter } from "unist-util-find-all-after"
import { visit } from "unist-util-visit"
import { selectAll, select } from "unist-util-select"
import { toString } from "mdast-util-to-string"

/**
 * The AstQuery takes a MDAST tree and provides methods for querying that tree to find specific nodes.
 *
 * You should never need to create this class yourself, an instance of this class is available on every Document
 * by using doc.astQuery.
 *
 * @private
 *
 */
export default class AstQuery {
  constructor(ast) {
    this.ast = ast
  }

  /**
   * Find all nodes in the document that come before the given node.  Passing an optional
   * selector will filter the results.
   */
  findAllBefore(node, selector) {
    return findAllBefore(this.ast, node, selector)
  }

  /**
   * Find all nodes in the document that come after the given node. Passing an optional
   * selector will filter the results.
   */
  findAllAfter(node, selector) {
    return findAllAfter(this.ast, node, selector)
  }

  /**
   * Find the first node before the given node which matches the selector
   *
   * @param {AstNode} node a node in the AST to start searching from
   * @param {String|Function} selector a selector string from unist-util-select, or a function which will be passed the node and return true if it matches
   */
  findBefore(node, selector) {
    return findBefore(this.ast, node, selector)
  }

  /**
   * Find the next node after the given node which matches the given elector
   *
   * @param {AstNode} node a node in the AST to start searching from
   * @param {Function} selector a function which returns true if the node matches
   * @returns {AstNode} the first node to match the selector
   */
  findAfter(node, selector) {
    return findAfter(this.ast, node, selector)
  }

  /**
   * Find all the nodes between the given nodes
   *
   * @param {AstNode} nodeOne a node in the AST to start searching from
   * @param {AstNode} nodeTwo a node in the AST to stop searching at
   */
  findBetween(nodeOne, nodeTwo) {
    const startLine = nodeOne.position.end.line
    const endLine = nodeTwo.position.start.line

    return this.ast.children.filter(
      ({ position }) =>
        position.start.line > startLine && position.end.line < endLine
    )
  }

  /**
   * Find the first node which matches the selector.  See unist-util-select
   *
   * @param {String|Function} selector a string from unist-util-select or a function which should return true if the node matches
   * @returns {AstNode} the first node to match the selector
   */
  select(selector) {
    return select(selector, this.ast)
  }

  /**
   * Find all nodes which match the selector.  See unist-util-select
   * @param {String|Function} selector a string from unist-util-select or a function which should return true if the node matches
   * @returns {Array[AstNode]} all nodes to match the selector
   */
  selectAll(selector) {
    return selectAll(selector, this.ast)
  }

  /**
   * Run the given visitor function for each node in the document.
   *
   * @param {Function} visitor a function which will be passed a node from the tree.
   */
  visit(visitor) {
    return visit(this.ast, visitor)
  }

  /**
   * Get the node at a given line number.
   *
   * @param {Number} lineNumber the line number to find
   * @returns {AstNode} the node at the given line number
   */
  atLine(lineNumber) {
    return this.ast.children.find(
      ({ position = {} }) => position.start.line === lineNumber
    )
  }

  /**
   * Find the next heading node with the same depth as the given node.
   *
   * @param {AstNode} headingNode a heading node to start searching from
   * @returns {AstNode} the next heading node with the same depth as the given node
   */
  findNextSiblingHeadingTo(headingNode) {
    const startLine = headingNode.position.end.line
    return this.selectAll("heading").find(
      (heading) =>
        heading.depth === headingNode.depth &&
        heading.position.start.line > startLine
    )
  }

  /**
   * Get all headings at a given depth.
   *
   * @param {Number} depth the heading depth to find (1-6)
   * @returns {Array[AstNode]} all headings at the given depth
   */
  headingsAtDepth(depth) {
    return this.astQuery.selectAll(`heading[depth=${depth}]`)
  }

  /**
   * Find a heading where the content matches the given string.  Not case sensitive.
   * Passing false as a second argument will use a substring match.
   *
   * @param {String} text the text of the heading to match
   * @param {Boolean} exact whether to use an exact match or a substring match
   */
  findHeadingByText(text = "", exact = true) {
    return this.selectAll("heading").find((heading) => {
      const headingText = toString(heading).toLowerCase()

      if (exact) {
        return headingText.trim() === text.toLowerCase()
      }

      return headingText.includes(text.toLowerCase())
    })
  }
}

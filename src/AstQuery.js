import { findBefore } from "unist-util-find-before"
import { findAfter } from "unist-util-find-after"
import { findAllBefore } from "unist-util-find-all-before"
import { visit } from "unist-util-visit"
import { selectAll, select } from "unist-util-select"
import { toString } from "mdast-util-to-string"

export default class AstQuery {
  constructor(ast) {
    this.ast = ast
  }

  findAllBefore(node, selector) {
    return findAllBefore(this.ast, node, selector)
  }

  findBefore(node, selector) {
    return findBefore(this.ast, node, selector)
  }

  findAfter(node, selector) {
    return findAfter(this.ast, node, selector)
  }

  findBetween(headingOne, headingTwo) {
    const startLine = headingOne.position.end.line
    const endLine = headingTwo.position.start.line

    return this.ast.children.filter(
      ({ position }) =>
        position.start.line > startLine && position.end.line < endLine
    )
  }

  select(selector) {
    return select(selector, this.ast)
  }

  selectAll(selector) {
    return selectAll(selector, this.ast)
  }

  visit(visitor) {
    return visit(this.ast, visitor)
  }

  atLine(lineNumber) {
    return this.ast.children.find(
      ({ position = {} }) => position.start.line === lineNumber
    )
  }

  findHeadingByText(text = "", exact = true) {
    return this.selectAll("heading").find((heading) => {
      const headingText = toString(heading).toLowerCase()

      if (exact) {
        return headingText === text.toLowerCase()
      }

      return headingText.includes(text.toLowerCase())
    })
  }
}

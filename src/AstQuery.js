import { findBefore } from "unist-util-find-before"
import { findAfter } from "unist-util-find-after"
import { findAllBefore } from "unist-util-find-all-before"
import { visit } from "unist-util-visit"
import { selectAll, select } from "unist-util-select"

export default class AstQuery {
  constructor(ast) {
    this.ast = ast
  }

  findAllBefore(node, selector) {
    findAllBefore(this.ast, node, selector)
  }

  findBefore(node, selector) {
    findBefore(this.ast, node, selector)
  }

  findAfter(node, selector) {
    findAfter(this.ast, node, selector)
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
    select(selector, this.ast)
  }

  selectAll(selector) {
    selectAll(selector, this.ast)
  }

  visit(visitor) {
    visit(this.ast, visitor)
  }
}

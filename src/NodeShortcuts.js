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

  get links() {
    return this.astQuery.selectAll("link")
  }

  nextSiblingHeadingOf(headingNode) {
    const startLine = headingNode.position.end.line
    return this.headings.find(
      (heading) =>
        heading.depth === headingNode.depth &&
        heading.position.start.line > startLine
    )
  }

  headingsAtDepth(depth) {
    return this.astQuery.selectAll(`heading[depth=${depth}]`)
  }
}

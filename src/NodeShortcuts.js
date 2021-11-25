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
}

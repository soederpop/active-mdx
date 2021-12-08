import Relationship from "./Relationship.js"

export default class HasManyRelationship extends Relationship {
  get type() {
    return "hasMany"
  }

  id(childTitle = "") {
    if (typeof this.options.id === "function") {
      return this.options.id(this.parent)
    }

    return [
      this.TargetModelClass.prefix,
      this.parent.title.toLowerCase(),
      childTitle.toLowerCase().replace(/\s\s/, " ").replace(/\s/g, "-")
    ].join("/")
  }

  nodes() {
    const { options } = this
    const { childType = "heading", heading } = options
    const { astQuery, utils } = this.document

    if (childType === "heading") {
      const parentHeading = astQuery.findHeadingByText(heading)
      const nodes = this.document.extractSection(parentHeading).slice(1)

      return nodes
        .filter(
          ({ type, depth }) =>
            type === "heading" && depth == parentHeading.depth + 1
        )
        .map((heading) => {
          const section = this.document.extractSection(heading)

          return {
            title: utils.toString(heading),
            startNode: heading,
            section,
            ast: utils.normalizeHeadings(
              JSON.parse(JSON.stringify(utils.createNewAst(section)))
            ),
            id: options.id
              ? options.id(utils.toString(heading))
              : this.id(utils.toString(heading))
          }
        })
    }
  }

  fetch(options = {}) {
    return this.fetchAll(options)
  }

  fetchAll(options = {}) {
    const { TargetModelClass } = this
    const { collection } = this.parent.document

    const nodes = this.nodes()

    return nodes.map(({ id, ast }) => {
      if (collection.items.has(id)) {
        const instance = TargetModelClass.from(collection.document(id))

        return instance
      } else {
        return TargetModelClass.from(
          collection.createDocument({
            collection,
            id,
            ast,
            meta: {
              ...(this.options.meta ? this.options.meta() : {}),
              ...(options.meta || {})
            }
          })
        )
      }
    })
  }
}

import Relationship from "./Relationship.js"
import { kebabCase } from "lodash-es"

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
      kebabCase(childTitle.toLowerCase().replace(/\s\s/, " "))
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
            ast: utils.normalizeHeadings(utils.createNewAst(section)),
            id: formatId(
              options.id
                ? options.id(kebabCase(utils.toString(heading).toLowerCase()))
                : this.id(kebabCase(utils.toString(heading).toLowerCase()))
            )
          }
        })
    }
  }

  fetch(options = {}) {
    return this.fetchAll(options)
  }

  async create(options = {}) {
    const models = this.fetchAll(options)

    await Promise.all(models.map((model) => model.save()))

    return models
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

function formatId(id) {
  return id
    .split("/")
    .map((i) => kebabCase(i))
    .join("/")
}

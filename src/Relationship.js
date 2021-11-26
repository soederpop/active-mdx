import inflect from "inflect"
import lodash from "lodash"

export default class Relationship {
  constructor(parent, TargetModelClass, options = {}) {
    this.parent = parent
    this.TargetModelClass = TargetModelClass
    this.options = options
  }

  get document() {
    return this.parent.document
  }

  get utils() {
    return {
      inflect
    }
  }
}

export class BelongsToRelationship extends Relationship {
  get type() {
    return "belongsTo"
  }

  fetchAll(options = {}) {
    return this.fetch(options)
  }

  fetch(options = {}) {
    const relatedId = [
      this.TargetModelClass.prefix,
      this.options.id(this.parent)
    ].join("/")

    if (!this.parent.collection.items.has(relatedId)) {
      throw new Error(
        `Could not find ${this.TargetModelClass.name} with id ${relatedId}`
      )
    }

    return this.TargetModelClass.from(
      this.parent.collection.document(relatedId)
    )
  }
}

export class HasManyRelationship extends Relationship {
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
      const nodes = utils.extractSection(parentHeading).slice(1)

      return nodes
        .filter(({ type }) => type === "heading")
        .map((heading) => {
          const section = utils.extractSection(heading)

          return {
            title: utils.toString(heading),
            startNode: heading,
            section,
            ast: utils.normalizeHeadings(utils.createNewAst(section)),
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

export class HasOneRelationship extends Relationship {
  get type() {
    return "hasOne"
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
}

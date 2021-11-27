import * as inflections from "inflect"
import lodash from "lodash"
import {
  HasManyRelationship,
  BelongsToRelationship,
  HasOneRelationship
} from "./Relationship.js"

const { castArray, kebabCase, camelCase, upperFirst } = lodash

const privates = new WeakMap()

/**
 * The Model class is intended to be subclassed, and is intended to represent
 * any type of Document which follows a specific structure.  The role of the Model class
 * is to turn a given document into an object whose attributes are derived from the content
 * of the document.
 */
export default class Model {
  constructor(document, options = {}) {
    privates.set(this, { document, relationships: new Map() })
  }

  /**
   * Returns true if the document can be used by this model
   */
  static is(document) {
    return !!document.ast?.children
  }

  static from(document, options = {}) {
    if (!this.is(document)) {
      throw new Error(`The document is not valid for this model.`)
    }

    return new this(document, options)
  }

  static get prefix() {
    return this.inflections.plural.toLowerCase()
  }

  static get inflections() {
    const name = this.name.toLowerCase()

    return {
      modelName: name,
      singular: inflections.singularize(name),
      plural: inflections.pluralize(name),
      className: upperFirst(camelCase(kebabCase(name)))
    }
  }

  get id() {
    return this.document.id
  }

  get modelName() {
    return this.constructor.name
  }

  get meta() {
    return this.document.meta
  }

  toJSON(options = {}) {
    const json = {
      id: this.id,
      meta: this.meta,
      title: this.title
    }

    const related = castArray(options.related).filter(Boolean)

    for (const rel of related) {
      // TODO: Support nested relationships stories.components should pass related: ["components"] when serializing stories.
      const [baseRel, ...childRelations] = rel.split(".")

      if (typeof this[baseRel] !== "function") {
        throw new Error(
          `The relationship ${baseRel} is not defined on the ${this.modelName} model.`
        )
      }

      const relationship = this[rel]()
      const items = relationship.fetchAll()

      json[rel] = items.map((item) => item.toJSON())
    }

    return json
  }

  get collection() {
    return this.document.collection
  }

  get inflections() {
    return this.constructor.inflections
  }

  get prefix() {
    return this.constructor.prefix
  }

  async save(options = {}) {
    return this.document.save(options)
  }

  get document() {
    return privates.get(this).document
  }

  get title() {
    return this.document.title
  }

  get relationships() {
    return privates.get(this).relationships
  }

  hasMany(modelNameOrModelClass, options = {}) {
    return new HasManyRelationship(this, modelNameOrModelClass, options)
  }

  hasOne(modelNameOrModelClass, options = {}) {
    return new HasOneRelationship(this, modelNameOrModelClass, options)
  }

  belongsTo(modelNameOrModelClass, options = {}) {
    return new BelongsToRelationship(this, modelNameOrModelClass, options)
  }
}

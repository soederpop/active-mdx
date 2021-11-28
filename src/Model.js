import { mixedTypeAnnotation } from "@babel/types"
import * as inflections from "inflect"
import lodash from "lodash"
import {
  HasManyRelationship,
  BelongsToRelationship,
  HasOneRelationship
} from "./Relationship.js"

const { result, castArray, kebabCase, camelCase, upperFirst } = lodash

const privates = new WeakMap()
const classPrivates = new WeakMap()

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

  static get actions() {
    let mine = classPrivates.get(this)

    if (!mine) {
      classPrivates.set(this, {})
      mine = classPrivates.get(this)
    }

    return (mine.actions = mine.actions || new Map())
  }

  /**
   * Register an action function with this model class.  An action is an asynchronous function
   * that will run, being passed the model instance as the first argument.
   */
  static action(name, fn, options = {}) {
    if (typeof fn === "undefined") {
      if (!this.actions.has(name)) {
        throw new Error(`No action by name ${name} found on this model`)
      }
      return this.actions.get(name)
    }

    this.actions.set(name, { fn, options })

    return this
  }

  static get availableActions() {
    return Array.from(this.actions.keys())
  }

  get id() {
    return this.document.id
  }

  get availableActions() {
    return this.constructor.availableActions
  }

  async runAction(actionName, options = {}) {
    if (this.availableActions.indexOf(actionName) === -1) {
      throw new Error(
        `Action ${actionName} is not available on model ${this.modelName}`
      )
    }

    const actionFn = this.constructor.actions.get(actionName).fn

    const result = await actionFn(this, options)

    return result
  }

  get modelName() {
    return this.constructor.name
  }

  get meta() {
    return this.document.meta
  }

  get availableActions() {
    return this.constructor.availableActions
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

    const attributes = castArray(options.attributes).filter(Boolean)

    for (let attr of attributes) {
      json[attr] = result(this, attr)
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

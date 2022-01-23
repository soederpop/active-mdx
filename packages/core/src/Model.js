import * as inflections from "inflect"
import CollectionQuery from "./CollectionQuery.js"
import HasManyRelationship from "./HasManyRelationship.js"
import BelongsToRelationship from "./BelongsToRelationship.js"
import Validator from "./Validator.js"
import expandAction from "./actions/expand.js"

import {
  defaultsDeep,
  result,
  castArray,
  kebabCase,
  camelCase,
  upperFirst
} from "lodash-es"

const privates = new WeakMap()

/**
 * The Model class is intended to be subclassed, and is intended to represent
 * any type of Document which follows a specific structure.  The role of the Model class
 * is to turn a given document into an object whose attributes are derived from the content
 * of the document.
 */
export default class Model {
  constructor(document, options = {}) {
    const errorTracker = new Map()

    errorTracker.toJSON = () => Object.fromEntries(errorTracker.entries())

    privates.set(this, {
      document,
      relationships: new Map(),
      errors: errorTracker
    })

    this._label = document.id
  }

  /**
   * Returns true if the document can be used by this model.
   *
   * When defining your own Model class, you should override this method with your own logic.
   */
  static is(document) {
    return !!document.ast?.children
  }

  /**
   * Creates an instance of this Model class from a given Document.
   *
   * @param {Document} document
   * @param {Object} options
   *
   */
  static from(document, options = {}) {
    if (!this.is(document)) {
      throw new Error(`The document is not valid for this model.`)
    }

    return new this(document, options)
  }

  /**
   * When defining your own Model class, you can override this method with your own prefix.  By default
   * it will use the lowercase, pluralized name of the model.  E.g. Book -> books
   */
  static get prefix() {
    return this.inflections.plural.toLowerCase()
  }

  /**
   * Provides different variations of the model name, plural, singular, class name style, as well as the actual name of the class.
   */
  static get inflections() {
    const name = this.name.toLowerCase()

    return {
      modelName: name,
      singular: inflections.singularize(name),
      plural: inflections.pluralize(name),
      className: upperFirst(camelCase(kebabCase(name)))
    }
  }

  /**
   * Provides access to any named queries that have been registered with this model.
   *
   * For example, you could have a query named "all" that would return all of the instances,
   * or a query named "published" which would return all instances which have meta.status == 'published'
   *
   * @type {Map}
   */
  static get queries() {
    let mine = classPrivates.get(this)

    if (!mine) {
      classPrivates.set(this, {})
      mine = classPrivates.get(this)
    }

    mine.queries = mine.queries || new Map()

    Array.from(Queries.entries()).forEach(([name, data]) => {
      if (mine.queries.has(name)) {
        return
      }
      mine.queries.set(name, data)
    })

    return mine.queries
  }

  /**
   * Register an query function with this model class.
   *
   * @param {String} name the name of the query
   * @param {Function} fn a function which returns models matching the query
   * @param {Object} options
   */
  static registerQuery(name, fn, options = {}) {
    if (typeof fn === "undefined") {
      if (!this.queries.has(name)) {
        throw new Error(`No action by name ${name} found on this model`)
      }
      return this.queries.get(name)
    }

    this.queries.set(name, { fn, options })

    return this
  }

  /**
   * Run a query against the model.  Can either pass the name of a query that has already been registered
   * or a function that will be used to build the query and return results.
   *
   * @returns {CollectionQuery}
   */
  static query(...args) {
    if (typeof args[0] === "string") {
      const registeredQuery = this.queries.get(args[0])
      const options = args[1] || {}
      const { collection = "default" } = options

      return new CollectionQuery({
        collection: this.collections.get(collection),
        fn: registeredQuery.fn,
        options,
        model: this
      })
    }

    if (typeof args[0] === "function") {
      const fn = args[0]
      const options = args[1] || {}
      const { collection = "default" } = options

      return new CollectionQuery({
        collection: this.collections.get(collection),
        fn,
        options,
        model: this
      })
    }

    if (typeof args[0] === "object" || args.length === 0) {
      const options = args[0] || {}
      const { collection = "default" } = options
      return new CollectionQuery({
        collection: this.collections.get(collection),
        options,
        model: this,
        fn: () => true
      })
    }
  }

  static async fetchAll(options = {}) {
    return this.query().fetchAll(options)
  }

  static async first() {
    return this.fetchAll().then((r) => r[0])
  }

  static async last() {
    return this.fetchAll().then((r) => r[r.length - 1])
  }

  /**
   * Gets a list of named queries registered with this model
   *
   * @type{Array[String]}
   */
  static get availableQueries() {
    return Array.from(this.queries.keys())
  }

  /**
   * Provides access to a registry of action functions which can be run on this model.
   * @type {Map}
   */
  static get actions() {
    let mine = classPrivates.get(this)

    if (!mine) {
      classPrivates.set(this, {})
      mine = classPrivates.get(this)
    }

    mine.actions = mine.actions || new Map([["expand", { fn: expandAction }]])

    Array.from(Actions.entries()).forEach(([name, data]) => {
      if (mine.actions.has(name)) {
        return
      }
      mine.actions.set(name, data)
    })

    return mine.actions
  }

  /**
   * Register an action function with this model class.  An action is an asynchronous function
   * that will run being passed the model instance as the first argument.
   *
   * @param {String} name
   * @param {Function} fn
   * @param {Object} options
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

  /**
   * the names of the actions that have been registered with this model.
   * @type {Array[String]}
   */
  static get availableActions() {
    return Array.from(this.actions.keys())
  }

  /**
   * Gets the default collection, which will be used for any queries.
   * @type {Collection}
   */
  static get defaultCollection() {
    return classPrivates.get(Model).collections.get("default")
  }

  /**
   * Gets any collections this Model can be associated with.
   * @type {Map}
   */
  static get collections() {
    return classPrivates.get(Model).collections
  }

  /**
   * Returns the ID of the underlying document
   * @type {String}
   */
  get id() {
    return this.document.id
  }

  /**
   * Returns an array of action names that can be run with this model.
   * @type {Array[String]}
   */
  get availableActions() {
    return this.constructor.availableActions
  }

  /**
   * Runs a registered action by its name.
   * @param {String} actionName
   * @param {Object} options options to be passed to the action function
   */
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

  /**
   * Get the name of this class
   * @type {String}
   */
  get modelName() {
    return this.constructor.name
  }

  /**
   * Returns the underlying document's meta data, pulled from the frontmatter.
   *
   * @type {Object}
   */
  get meta() {
    return defaultsDeep(this.document.meta, this.defaults?.meta || {})
  }

  /**
   * You can override this to return default data to be used when creating data for serialization purposes.
   * For example you can return { meta: { defaultValue: 1 } } to ensure all instances of this model have that
   * as their metadata.
   */
  get defaults() {
    return {}
  }

  /**
   * Represent this model as a pure JavaScript object.
   *
   * @param {Object} options
   * @param {Array[String]} options.related - include any defined relations of the mdoel.  It will return any related models and call toJSON on those as well.
   * @param {Array[String]} options.attributes - include any defined attributes of the model.
   * @returns {Object}
   */
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

  /**
   * Provide access to the underlying document's parent collection
   *
   * @type {Collection}
   */
  get collection() {
    return this.document.collection
  }

  /**
   * A shortcut to the inflections of this model name
   */
  get inflections() {
    return this.constructor.inflections
  }

  /**
   * The prefix of the model
   * @type {String}
   */
  get prefix() {
    return this.constructor.prefix
  }

  /**
   * Save the underlying document
   */
  async save(options = {}) {
    await this.document.save(options)
    return this
  }

  /**
   * The underlying document for this model.
   * @type {Document}
   */
  get document() {
    return privates.get(this).document
  }

  /**
   * The title of the underlying document
   * @type {String}
   */
  get title() {
    return this.document.title
  }

  /**
   * The title of the underlying document in a format suitable for use as an ID in a URL
   * @type {String}
   */
  get slug() {
    return this.document.slug
  }

  get relationships() {
    return privates.get(this).relationships
  }

  /**
   * Returns a HasManyRelationship instance for this model.  You can call fetchAll on this to get
   * instances of the related model.
   *
   * @param {String|Model} modelNameOrModelClass
   * @param {Object} options
   * @param {String} options.heading - the parent heading the child relations will be found under.
   *
   * @returns {HasManyRelationship}
   */
  hasMany(modelNameOrModelClass, options = {}) {
    return new HasManyRelationship(this, modelNameOrModelClass, options)
  }

  /**
   * Returns a BelongsToRelationship instance for this model.  You can call fetch on this to get the instance of the parent Model.
   *
   * @param {String|Model} modelNameOrModelClass
   * @param {Object} options
   * @param {Function} options.id a function which will be passed this models underlying document, and should return the id of the parent model this belongs to
   */
  belongsTo(modelNameOrModelClass, options = {}) {
    return new BelongsToRelationship(this, modelNameOrModelClass, options)
  }

  get errorMessages() {
    return this.errors.toJSON()
  }

  get errors() {
    return privates.get(this).errors
  }

  get hasErrors() {
    return privates.get(this).errors.size > 0
  }

  get validator() {
    return new Validator({ model: this })
  }

  async validate(options = {}) {
    return this.validator.validate(options)
  }
}

const classPrivates = new WeakMap([
  [
    Model,
    {
      actions: new Map(),
      queries: new Map(),
      collections: new Map()
    }
  ]
])

export const Actions = classPrivates.get(Model).actions
export const Queries = classPrivates.get(Model).queries

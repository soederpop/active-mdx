import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import Document from "./Document.js"
import Model from "./Model.js"
import * as inflections from "inflect"
import { isEmpty } from "lodash-es"
import { statSync } from "fs"

const privates = new WeakMap()

/**
 * A Collection is a collection of raw files, documents backed by those raw files, and models backed by the documents.
 */
export default class Collection {
  constructor(
    { rootPath = process.cwd(), extensions = ["mdx", "md"] },
    models = [],
    name = rootPath
  ) {
    if (!Model.defaultCollection) {
      Model.collections.set("default", this)
    }

    if (!Model.collections.has(name)) {
      Model.collections.set(name, this)
    }

    const p = {}

    p.extensions = extensions
    p.items = new Map()
    p.documents = new Map()
    p.actions = new Map()

    p.models = new Map([
      ["Model", { ModelClass: Model, options: { prefix: "" } }]
    ])

    privates.set(this, p)

    this.rootPath = rootPath
    this.name = name

    models.forEach((ModelClass) => {
      this.model(ModelClass.name, ModelClass)
    })
  }

  /**
   * Returns true if the collection has been loaded.
   * @type {Boolean}
   */
  get loaded() {
    return privates.get(this).loaded
  }

  /**
   * Which file extensions will this collection look for.  Defaults to ["mdx", "md"]
   * @type {Array[String]}
   */
  get extensions() {
    return privates.get(this).extensions
  }

  /**
   * Items is a map of documentIds and their raw content and meta data.
   * @type {Map}
   */
  get items() {
    return privates.get(this).items
  }

  /**
   * Documents is a map of documentIds and the Document instances that are created with the content
   * and metadata from our items map.
   * @type {Map}
   */
  get documents() {
    return privates.get(this).documents
  }

  /**
   * Models is a map of model names and their ModelClasses.
   * @type {Map}
   */
  get models() {
    return privates.get(this).models
  }

  /**
   * Resolve a path relative to process.cwd().  If you pass a file:// url from e.g. import.meta.url it will return the directory.
   */
  static resolve(...args) {
    if (String(args[0]).startsWith("file:")) {
      return path.parse(args[0]).dir.replace("file://", "")
    }

    return path.resolve(process.cwd(), ...args)
  }

  /**
   * Resolve a path relative to the root path of of this collection.
   */
  resolve(...args) {
    return this.constructor.resolve(this.rootPath, ...args)
  }

  /**
   * @param {Class} model the model to query
   * @param {...args} args the arguments to pass to the model's query method
   */
  query(model, ...args) {
    const Model = typeof model === "string" ? this.model(model) : model
    return Model.query(...args)
  }

  /**
   * Get or register a model class with the collection.
   *
   * @param {String} modelName the name of the model
   * @param {Function} ModelClass the model class. Should extend from active-mdx's Model base class
   * @param {Object} options
   * @param {Boolean} options.throwErrors pass false to not throw errors if the model is already registered
   *
   * @returns {Collection} this
   */
  model(modelName, ModelClass, options = {}) {
    if (typeof ModelClass === "undefined") {
      const actualKey = this.modelAliases[modelName]

      if (!this.models.has(actualKey)) {
        if (options.throwErrors !== false) {
          throw new Error(`Could not find a model class ${modelName}`)
        }
      }

      return this.models.get(actualKey).ModelClass
    }

    if (this.models.has(modelName)) {
      if (options.throwErrors !== false) {
        throw new Error(`Model ${modelName} already exists`)
      }
    }

    this.models.set(modelName, {
      ModelClass,
      options: {
        prefix:
          ModelClass.prefix || inflections.pluralize(modelName.toLowerCase()),
        ...options
      }
    })

    return this
  }

  /**
   * Returns an array containing all of the classes registered as models witht his collection.
   */
  get modelClasses() {
    return Array.from(this.models.values())
      .map(({ ModelClass }) => ModelClass)
      .filter((ModelClass) => ModelClass !== Model)
  }

  /**
   * Returns an object containing all possible aliases for the model names in this collection.
   * The keys are the alias, the value is the real model name.
   */
  get modelAliases() {
    return Array.from(this.models.entries()).reduce(
      (memo, [name, { ModelClass }]) => {
        if (ModelClass === Model) {
          return memo
        }

        memo[name] = name
        Object.values(ModelClass.inflections).forEach((inflection) => {
          memo[inflection] = name
        })

        return memo
      },
      {}
    )
  }

  /**
   * Returns an array of all of the ids for items in the collection.
   *
   * @type {Array[String]}
   */
  get available() {
    return Array.from(this.items.keys())
  }

  /**
   * Returns an instance of a model for a document with the given id.
   *
   * @param {String} pathId the id of the document
   * @param {Model} model the model class to represent the document.  If you don't pass it the collection will attempt to guess by the prefix, or document meta.type
   */
  getModel(pathId, model) {
    const document = this.document(pathId)

    if (typeof model === "string") {
      model = this.model(model).ModelClass
    }

    return (
      document &&
      document.toModel({
        ...(model && { model })
      })
    )
  }

  /**
   * Returns an instance of the Document class for the given pathId
   *
   * @param {String} pathId the id of the document
   *
   * @returns {Document} the document instance
   */
  document(pathId) {
    if (!this.loaded) {
      throw new Error(
        `Collection has not been loaded.  Call load() on the collection first.`
      )
    }

    let doc = this.documents.get(pathId)

    if (doc) {
      return doc
    }

    if (!this.items.has(pathId)) {
      throw new Error(`Could not find document ${pathId}`)
    }

    const data = this.items.get(pathId)

    const { content, meta } = data
    doc = this.createDocument({ id: pathId, content, meta })

    this.documents.set(pathId, doc)

    return doc
  }

  /**
   * Creates a new Document tied to this collection.
   *
   * @param {Object} attributes
   * @param {String}
   */
  createDocument(attributes = {}) {
    return new Document({ ...attributes, collection: this })
  }

  get itemsByModifiedDate() {
    return Array.from(this.items.entries())
      .sort((a, b) => {
        return a[1].updatedAt - b[1].updatedAt
      })
      .map((entry) => [
        entry[0],
        entry[1].updatedAt,
        this.getModel(entry[0]).constructor.name
      ])
  }

  /**
   * Returns a JSON object with metadata about the collection, along with optional
   * JSON representation of the items in the collection.
   *
   * @param {Object} options
   * @param {Boolean} [options.content=false] whether to include the content of the items in the collection
   */
  toJSON(options = {}) {
    const models = this.modelClasses.map((ModelClass) => {
      const inflections = ModelClass.inflections

      return {
        name: ModelClass.name,
        prefix: ModelClass.prefix,
        availableActions: ModelClass.availableActions,
        availableQueries: ModelClass.availableQueries,
        matchingPaths: this.available.filter((pathId) =>
          pathId.startsWith(ModelClass.prefix)
        ),
        inflections
      }
    })

    const optional = {}

    if (options.content) {
      optional.items = {}
      Array.from(this.items.entries()).forEach(([pathId, item]) => {
        optional.items[pathId] = item
      })
    }

    return {
      models,
      recent: this.itemsByModifiedDate
        .reverse()
        .slice(0, options.recentCount || 5),
      modelAliases: this.modelAliases,
      itemIds: Array.from(this.items.keys()),
      ...optional
    }
  }

  async export(options = {}) {
    const json = this.toJSON(options)
    const modelClasses = this.modelClasses.filter(
      (modelClass) => modelClass !== Model
    )

    const models = {}

    const failedExports = []

    await Promise.all(
      modelClasses.map((ModelClass) => {
        const query = ModelClass.query({ collection: this.name })

        console.log("Exporting Collection", this.name, query.collection.name)

        return query.fetchAll().then((results) => {
          console.log(`${ModelClass.name} has ${results.length} items`)
          models[ModelClass.name] = results
            .map((model) => {
              try {
                return model.toJSON(options[ModelClass.name] || {})
              } catch (error) {
                failedExports.push(model.id)
                console.log("Error exporting model", model.id)
                return false
              }
            })
            .filter(Boolean)
        })
      })
    )

    return {
      modelData: models,
      failedExports,
      ...json
    }
  }

  async runAction(name, ...args) {
    if (!this.actions.has(name)) {
      throw new Error(`Action ${name} does not exist on this collection.`)
    }

    const actionFn = this.actions.get(name)

    const results = await actionFn(this, ...args)

    return results
  }

  action(name, actionFn) {
    this.actions.set(name, actionFn)
    return this
  }

  get actions() {
    return privates.get(this).actions
  }

  get availableActions() {
    return Array.from(this.actions.keys())
  }

  /**
   * Saves the raw content of a member of this collection to disk.
   *
   * If the item does not exist at a pathId, it will create it.
   *
   * @param {String} pathId
   * @param {Object} options
   * @param {String} options.content
   * @param {String} [options.extension='.mdx']
   */
  async saveItem(pathId, { content: raw, extension = ".mdx" } = {}) {
    const { data, content } = matter(raw)

    if (!this.items.has(pathId)) {
      const filePath = this.resolve(`${pathId}${extension}`)
      this.updateItem(pathId, { path: filePath, raw, content, data })
    }

    if (isEmpty(content)) {
      throw new Error(
        `Cannot save an empty item to ${pathId}. You must pass some content.`
      )
    }

    const { path: filePath } = this.items.get(pathId)

    await fs.mkdir(path.parse(filePath).dir, { recursive: true })

    // we write the raw content after the matter has been extracted
    // 💡 Should I skip separating frontmatter completely?
    await fs.writeFile(filePath, raw, "utf8")

    this.updateItem(pathId, { content, data })

    return this.items.get(pathId)
  }

  async readItem(pathId) {
    const { path } = this.items.get(pathId)

    return await fs
      .readFile(path, "utf8")
      .then((buf) => String(buf))
      .then((raw) => fs.stat(path).then((stat) => ({ raw, stat })))
      .then(({ raw, stat }) => {
        const { data, content } = matter(raw)
        const payload = {
          raw,
          content,
          meta: data,
          path,
          createdAt: stat.ctime,
          updatedAt: stat.mtime
        }

        this.updateItem(pathId, payload)

        return payload
      })
  }

  pathExistsSync(pathId, { extension = "mdx" } = {}) {
    const filePath = this.resolve(`${pathId}.${extension}`)

    try {
      statSync(filePath)
      return true
    } catch (error) {
      return false
    }
  }

  async pathExists(pathId, { extension = "mdx" } = {}) {
    const filePath = this.resolve(`${pathId}.${extension}`)
    return fs
      .stat(filePath)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Loads an item into the items collection.  An item represents a file, path, content, etc
   * from disk.
   *
   * @param {String} pathId the id of the item.  Should be a relative path to the collection root, without the extension.
   * @param {Object} patch info to update the item with.
   */
  updateItem(pathId, patch = {}) {
    const item = this.items.get(pathId) || {}
    this.items.set(pathId, { ...item, ...patch })
    return this.items.get(pathId)
  }

  /**
   * Recursively searches the rootPath file tree for mdx files and loads them into the collection.
   *
   * It will parse each file, and treat YAML frontmatter and content separately.
   *
   * @param {Object} options
   * @param {Boolean} [options.models=false] whether to automatically find and require model classes from the models subfolder in the collection
   * @param {String} [options.modelsFolder="models"] which subfolder the models will live in.  Only applies if options.models is true
   * @param {Boolean} [options.refresh=false] whether to refresh the collection from disk. Call this if you want to reload / the files have changed
   * @returns {Collection} this
   */
  async load(options = {}) {
    const { refresh = process.env.NODE_ENV !== "production" } = options

    if (this.loaded && !refresh) {
      return this
    }

    const { paths = await readDirectory(this.rootPath) } = options

    await Promise.all(
      paths.map((path) => {
        const pathId = this.getPathId(path)

        return fs
          .readFile(path, "utf8")
          .then((buf) => String(buf))
          .then((raw) => fs.stat(path).then((stat) => ({ raw, stat })))
          .then(({ raw, stat }) => {
            const { data, content } = matter(raw)
            this.updateItem(pathId, {
              raw,
              content,
              meta: data,
              path,
              createdAt: stat.ctime,
              updatedAt: stat.mtime
            })
            return content
          })
      })
    )

    if (this.loaded) {
      await Promise.all(
        Array.from(this.documents.values()).map((doc) => doc.reload())
      )
    }

    if (options.models) {
      const modelsFolder = this.resolve(
        this.rootPath,
        options.modelsFolder || "models"
      )

      const modelPaths = await readDirectory(modelsFolder, /\.m?js$/, false)

      for (let modelPath of modelPaths) {
        const ModelClass = await import(modelPath).then((mod) => mod.default)
        this.model(ModelClass.name, ModelClass, { throwErrors: false })
      }
    }

    privates.get(this).loaded = true

    return this
  }

  /**
   * Returns the pathId for a given absolute path.
   *
   * @param {String} absolutePath absolute path of an mdx file
   * @returns {String} the pathId
   */
  getPathId(absolutePath) {
    const relativePath = path.relative(this.rootPath, absolutePath)

    return this.extensions.reduce((memo, ext) => {
      return memo.replace(`.${ext}`, "")
    }, relativePath)
  }

  static readDirectory = readDirectory
}

export async function readDirectory(
  dirPath,
  match = /\.mdx?$/i,
  recursive = true
) {
  var paths = []
  var files = await fs.readdir(dirPath)
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(dirPath, files[i])
    var stat = await fs.stat(filePath)
    if (stat.isDirectory() && recursive) {
      paths = paths.concat(await readDirectory(filePath, match, recursive))
    } else {
      if (match.test(filePath)) {
        paths.push(filePath)
      }
    }
  }
  return paths
}

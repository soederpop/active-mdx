import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import Document from "./Document.js"
import Model from "./Model.js"
import * as inflections from "inflect"
import lodash from "lodash"

const privates = new WeakMap()
const { isEmpty } = lodash

/**
 * A Collection is a collection of raw files, documents backed by those raw files, and models backed by the documents.
 */
export default class Collection {
  constructor(
    { rootPath = process.cwd(), extensions = ["mdx", "md"] },
    models = [],
    name = path.parse(rootPath).base
  ) {
    if (!Model.defaultCollection) {
      Model.collections.set("default", this)
    }

    if (!Model.collections.has(name)) {
      Model.collections.set(name, this)
    }

    const p = {}
    privates.set(this, p)

    p.extensions = extensions
    p.items = new Map()
    p.documents = new Map()

    p.models = new Map([
      ["Model", { ModelClass: Model, options: { prefix: "" } }]
    ])

    this.rootPath = path.resolve(this.constructor.resolve(rootPath))

    models.forEach((ModelClass) => {
      this.model(ModelClass.name, ModelClass)
    })
  }

  /**
   * Returns true if the collection has been loaded.
   */
  get loaded() {
    return privates.get(this).loaded
  }

  /**
   * @type {Array[String]}
   */
  get extensions() {
    return privates.get(this).extensions
  }

  /**
   * @type {Map}
   */
  get items() {
    return privates.get(this).items
  }

  /**
   * @type {Map}
   */
  get documents() {
    return privates.get(this).documents
  }

  /**
   * @type {Map}
   */
  get models() {
    return privates.get(this).models
  }

  /**
   * Resolve a path relative to process.cwd()
   */
  static resolve(...args) {
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
    return Array.from(this.models.values()).map(({ ModelClass }) => ModelClass)
  }

  /**
   * Returns an object containing all possible aliases for the model names in this collection.
   * The keys are the alias, the value is the real model name.
   */
  get modelAliases() {
    return Array.from(this.models.entries()).reduce(
      (memo, [name, { ModelClass }]) => {
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

    const { content, meta, path } = this.items.get(pathId)
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

  /**
   * Returns a JSON object with metadata about the collection, along with optional
   * JSON representation of the items in the collection.
   *
   * @param {Object} options
   * @param {Boolean} [options.content=false] whether to include the content of the items in the collection
   */
  toJSON(options = {}) {
    const models = Array.from(this.models.values()).map(({ ModelClass }) => {
      const inflections = ModelClass.inflections

      return {
        name: ModelClass.name,
        prefix: ModelClass.prefix,
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
      modelAliases: this.modelAliases,
      itemIds: Array.from(this.items.keys()),
      ...optional
    }
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
  async saveItem(pathId, { content, extension = ".mdx" } = {}) {
    if (!this.items.has(pathId)) {
      const filePath = this.resolve(`${pathId}${extension}`)
      this.updateItem(pathId, { path: filePath, content })
    }

    if (isEmpty(content)) {
      throw new Error(
        `Cannot save an empty item to ${pathId}. You must pass some content.`
      )
    }

    const { path: filePath } = this.items.get(pathId)

    await fs.mkdir(path.parse(filePath).dir, { recursive: true })

    await fs.writeFile(filePath, content, "utf8")

    this.updateItem(pathId, { content })

    return this.items.get(pathId)
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
   * @returns {Collection} this
   */
  async load(options = {}) {
    const paths = await readDirectory(this.rootPath)

    await Promise.all(
      paths.map((path) => {
        const pathId = this.getPathId(path)

        return fs
          .readFile(path, "utf8")
          .then((buf) => String(buf))
          .then((raw) => {
            const { data, content } = matter(raw)
            this.updateItem(pathId, { raw, content, meta: data, path })
            return content
          })
      })
    )

    if (options.models) {
      const modelsFolder = this.resolve(options.modelsFolder || "models")
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
}

async function readDirectory(dirPath, match = /\.mdx?$/i, recursive = true) {
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

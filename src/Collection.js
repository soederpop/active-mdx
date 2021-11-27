import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import Document from "./Document.js"
import * as inflections from "inflect"

export default class Collection {
  constructor({ rootPath = process.cwd(), extensions = ["mdx", "md"] }) {
    this.extensions = extensions
    this.items = new Map()
    this.documents = new Map()
    this.models = new Map()
    this.rootPath = path.resolve(rootPath)
  }

  static resolve(...args) {
    return path.resolve(process.cwd(), ...args)
  }

  model(modelName, ModelClass, options = {}) {
    if (typeof ModelClass === "undefined") {
      if (!this.models.has(modelName)) {
        throw new Error(`Model ${modelName} not found`)
      }

      return this.models.get(modelName).ModelClass
    }

    if (this.models.has(modelName)) {
      throw new Error(`Model ${modelName} already exists`)
    }

    this.models.set(modelName, {
      ModelClass,
      options: {
        prefix: inflections.pluralize(modelName.toLowerCase()),
        ...options
      }
    })
  }

  get modelClasses() {
    return Array.from(this.models.values()).map(({ ModelClass }) => ModelClass)
  }

  get available() {
    return Array.from(this.items.keys())
  }

  document(pathId) {
    let doc = this.documents.get(pathId)

    if (doc) {
      return doc
    }

    const { content, meta, path } = this.items.get(pathId)
    doc = this.createDocument({ id: pathId, content, meta })

    this.documents.set(pathId, doc)

    return doc
  }

  createDocument(params = {}) {
    return new Document({ ...params, collection: this })
  }

  toJSON() {
    return Array.from(this.items.entries()).reduce((memo, entry) => {
      const [pathId, item] = entry
      memo[pathId] = item
      return memo
    }, {})
  }

  async saveItem(pathId, { content, extension = ".mdx" } = {}) {
    if (!this.items.has(pathId)) {
      const filePath = Collection.resolve(
        this.rootPath,
        `${pathId}${extension}`
      )
      this.updateItem(pathId, { path: filePath, content })
    }

    const { path: filePath } = this.items.get(pathId)

    await fs.mkdir(path.parse(filePath).dir, { recursive: true })

    await fs.writeFile(filePath, content, "utf8")

    this.updateItem(pathId, { content })

    return this.items.get(pathId)
  }

  updateItem(pathId, patch = {}) {
    const item = this.items.get(pathId) || {}
    this.items.set(pathId, { ...item, ...patch })
    return this.items.get(pathId)
  }

  async load() {
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
  }

  getPathId(absolutePath) {
    const relativePath = path.relative(this.rootPath, absolutePath)

    return this.extensions.reduce((memo, ext) => {
      return memo.replace(`.${ext}`, "")
    }, relativePath)
  }
}

async function readDirectory(dirPath, match = /\.mdx?$/i) {
  var paths = []
  var files = await fs.readdir(dirPath)
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(dirPath, files[i])
    var stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      paths = paths.concat(await readDirectory(filePath))
    } else {
      if (match.test(filePath)) {
        paths.push(filePath)
      }
    }
  }
  return paths
}

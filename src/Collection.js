import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import Document from "./Document.js"
import * as inflections from "inflect"

export default class Collection {
  constructor({ rootPath, extensions = ["mdx", "md"] }) {
    this.extensions = extensions
    this.items = new Map()
    this.documents = new Map()
    this.models = new Map()
    this.rootPath = path.resolve(rootPath)
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

  get available() {
    return Array.from(this.items.keys())
  }

  document(pathId) {
    let doc = this.documents.get(pathId)

    if (doc) {
      return doc
    }

    const { content, meta, path } = this.items.get(pathId)
    doc = new Document({ id: pathId, content, meta, path, collection: this })

    this.documents.set(pathId, doc)

    return doc
  }

  toJSON() {
    return Array.from(this.items.entries()).reduce((memo, entry) => {
      const [pathId, item] = entry
      memo[pathId] = item
      return memo
    }, {})
  }

  async saveItem(pathId, { content } = {}) {
    const { path } = this.items.get(pathId)
    await fs.writeFile(path, content, "utf8")
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

async function readDirectory(dirPath) {
  var paths = []
  var files = await fs.readdir(dirPath)
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(dirPath, files[i])
    var stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      paths = paths.concat(await readDirectory(filePath))
    } else {
      paths.push(filePath)
    }
  }
  return paths
}

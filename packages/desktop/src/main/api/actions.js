import { shell, screen, app } from "electron"
import fs from "fs/promises"
import { resolve } from "path"
import { Collection } from "@active-mdx/core"
import { compile } from "../javascript.js"
import storage from "../storage"

const homePath = app.getPath("home")

const collections = new Map()

export async function openWithNative(options = {}) {
  shell.openExternal(`vscode://file/${options.url}`, {
    activate: true
  })
}
export async function homeFolder(options = {}) {
  const homePath = app.getPath("home")
  const envHomePath = resolve(homePath, ".active-mdx")
  const cachePath = resolve(envHomePath, "cache")

  const cacheExists = await exists(cachePath)

  if (!cacheExists) {
    await fs.mkdir(cachePath, { recursive: true })
  }

  return {
    paths: {
      home: envHomePath,
      cache: cachePath
    }
  }
}

export async function updateWindow(options = {}) {
  const { targetWindow } = options
  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  // Create a window that fills the screen's available work area.

  if (options.profile === "centered-large") {
    targetWindow.setSize(Math.round(width * 0.8), Math.round(height * 0.8))
    targetWindow.center()
  } else if (options.profile === "main") {
    targetWindow.setSize(800, 820)
    targetWindow.center()
  } else if (options.profile === "top-drawer") {
    targetWindow.setSize(width, 400)
    targetWindow.setPosition(0, 0)
  }
}

export async function compileModel({ model, project } = {}) {
  const collection = await getCollection(project)
  const document = collection.document(model.id)

  const source = await document.compile()
  const compiled = await compile(source)

  return {
    source,
    compiled
  }
}

export async function getStorage({ key }) {
  console.log("Getting Storage Value", key)
  return storage.get(key)
}

export async function patchStorage({ key, value = {} }) {
  const current = storage.get(key) || {}

  storage.set(key, {
    ...current,
    ...value
  })

  return storage.get(key, value)
}

export async function setStorage({ key, value = {} }) {
  storage.set(key, value)
  return storage.get(key, value)
}

export async function getModel({ model, project } = {}) {
  const collection = await getCollection(project)
  const modelInstance = await collection.getModel(model.id)
  const item = collection.items.get(modelInstance.id)

  return {
    model: modelInstance.toJSON(),
    path: item.path,
    document: modelInstance.document.toJSON(),
    project
  }
}

export async function getProjectData(options = {}) {
  const projects = await listProjects()

  const project = projects.find(
    (p) => p.path === (options.path || options.rootPath).replace("~", homePath)
  )

  if (!project) {
    console.log(options)
    throw new Error(`Could not find project`)
  }

  const collection = await getCollection(project)

  const data = await collection.export(options)

  return data
}

export async function getCollection({
  rootPath,
  path = rootPath,
  modulePath,
  name = path,
  refresh = false
} = {}) {
  if (collections.has(name)) {
    return collections.get(name)
  }

  if (!modulePath) {
    const indexJsExists = await exists(resolve(rootPath, "index.js"))
    const indexMjsExists = await exists(resolve(rootPath, "index.mjs"))

    if (indexMjsExists) {
      modulePath = resolve(rootPath, "index.mjs")
    }

    if (indexJsExists) {
      modulePath = resolve(rootPath, "index.js")
    }
  }

  if (modulePath) {
    const modulePathImport = resolve(path.replace("~", homePath), modulePath)

    const collection = await import(modulePathImport).then(
      (mod) => mod.collection || mod.default
    )

    await collection.load({ models: true, refresh })

    collections.set(name, collection)

    return collection
  }

  const collection = new Collection({ rootPath: path })

  await collection.load({ models: true, refresh })

  collections.set(name, collection)

  return collection
}

export async function listProjects(options = {}) {
  const projects = storage.get("projects") || {}
  return Object.values(projects)
}

async function exists(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

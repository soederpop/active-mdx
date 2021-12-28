import { shell, screen, app, ipcMain } from "electron"
import fs from "fs/promises"
import { resolve } from "path"
import { Collection } from "@active-mdx/core"
import { compile } from "../javascript.js"

export async function openWithNative(options = {}) {
  shell.openExternal(`vscode://file/${options.url}`, {
    activate: true
  })
}

export async function homeFolder(options = {}) {
  const homePath = app.getPath("home")
  const envHomePath = resolve(homePath, ".active-mdx")
  const dbPath = resolve(envHomePath, "db")
  const projectDbPath = resolve(dbPath, "projects.json")

  await fs.mkdir(dbPath, { recursive: true })

  const projectsDbExists = await exists(projectDbPath)

  if (!projectsDbExists) {
    await fs.writeFile(
      projectDbPath,
      JSON.stringify({
        activeProject: "",
        projects: []
      })
    )
  }

  return {
    paths: {
      home: envHomePath,
      db: dbPath,
      projects: projectDbPath
    }
  }
}

export async function exists(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const homePath = app.getPath("home")

export async function updateWindow({ mainWindow, ...options } = {}) {
  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  // Create a window that fills the screen's available work area.

  if (options.profile === "centered-large") {
    mainWindow.setSize(Math.round(width * 0.8), Math.round(height * 0.8))
    mainWindow.center()
  } else if (options.profile === "main") {
    mainWindow.setSize(800, 820)
    mainWindow.center()
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

export async function getModel({ model, project } = {}) {
  const collection = await getCollection(project)
  const modelInstance = await collection.getModel(model.id)
  const item = collection.items.get(modelInstance.id)

  await modelInstance.document.reload()

  return {
    model: modelInstance.toJSON(),
    path: item.path,
    document: modelInstance.document.toJSON(),
    project
  }
}

export async function reloadCollection({ model, project }) {
  const collection = await getCollection(project)
  await collection.load({ refresh: true })

  return collection.toJSON()
}

export async function validateModel({ model, project } = {}) {
  const collection = await getCollection(project)
  const modelInstance = await collection.getModel(model.id)
  const item = collection.items.get(modelInstance.id)

  await modelInstance.document.reload()
  await modelInstance.validate()

  return {
    isValid: !model.hasErrors,
    errorMessages: modelInstance.errorMessages,
    hasErrors: model.hasErrors
  }
}

export async function getProjectData(options = {}) {
  const projects = await listProjects().then((r) => r.projects)

  const project = projects.find(
    (p) => p.path === (options.path || options.rootPath).replace("~", homePath)
  )

  if (!project) {
    throw new Error(`Could not find project`)
  }

  const collection = await reloadCollection(project)

  const data = await collection.export(options)

  return data
}

const collections = new Map()

async function getCollection({
  rootPath,
  path = rootPath,
  modulePath,
  name = path
} = {}) {
  if (modulePath) {
    const modulePathImport = resolve(path.replace("~", homePath), modulePath)

    const collection = await import(modulePathImport).then(
      (mod) => mod.collection || mod.default
    )

    await collection.load({ models: true })

    collections.set(name, collection)

    return collection
  }

  const collection = new Collection({ rootPath: path })

  await collection.load({ models: true })

  collections.set(name, collection)

  return collection
}

export async function listProjects(options = {}) {
  const { paths } = await homeFolder()

  const data = await fs
    .readFile(paths.projects)
    .then((buf) => JSON.parse(String(buf)))

  return data
}

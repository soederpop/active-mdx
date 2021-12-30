import { shell, screen, app } from "electron"
import fs from "fs/promises"
import { resolve } from "path"
import { Collection } from "@active-mdx/core"
import { compile } from "../javascript.js"
import { getMainWindow } from "../main"

const homePath = app.getPath("home")

const collections = new Map()

export async function openWithNative(options = {}) {
  shell.openExternal(`vscode://file/${options.url}`, {
    activate: true
  })
}
export async function homeFolder(options = {}) {
  console.log("Updating Home Folder")

  const homePath = app.getPath("home")
  const envHomePath = resolve(homePath, ".active-mdx")
  const dbPath = resolve(envHomePath, "db")
  const projectDbPath = resolve(dbPath, "projects.json")

  console.log("checking if db exists", {
    homePath
  })
  const dbExists = await exists(dbPath)

  if (!dbExists) {
    console.log("creating db path")
    await fs.mkdir(dbPath, { recursive: true })
  }

  console.log("checking if projects db exists")
  const projectsDbExists = await exists(projectDbPath)

  if (!projectsDbExists) {
    console.log("Writing projects cache")
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

export async function getModel({ model, project } = {}) {
  console.log("GetModel", model.id)
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
  const projects = await listProjects().then((r) => r.projects)

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
  refresh = true
} = {}) {
  if (modulePath) {
    const modulePathImport = resolve(path.replace("~", homePath), modulePath)

    const collection = await import(modulePathImport).then(
      (mod) => mod.collection || mod.default
    )

    console.log("Created Collection", collection.name, refresh)
    await collection.load({ models: true, refresh })

    collections.set(name, collection)

    return collection
  }

  const collection = new Collection({ rootPath: path })
  console.log("Created Collection from Class", collection.name, refresh)

  await collection.load({ models: true, refresh })

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

async function exists(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

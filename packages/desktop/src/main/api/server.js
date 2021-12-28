import { shell, screen, app, ipcMain } from "electron"
import fs from "fs/promises"
import { resolve } from "path"
import { Collection } from "@active-mdx/core"
import { compile } from "../javascript.js"

export async function start(options = {}) {
  setupIPCBindings(options)
  await homeFolder(options)
}

export function setupIPCBindings(options = {}) {
  const { mainWindow } = options

  ipcMain.handle("listProjects", async (event, ...args) => {
    return await listProjects(...args)
  })

  ipcMain.handle("getProjectData", async (event, ...args) => {
    return await getProjectData(...args)
  })

  ipcMain.handle("getModel", async (event, ...args) => {
    return await getModel(...args)
  })

  ipcMain.handle("compileModel", async (event, ...args) => {
    return await compileModel(...args)
  })

  ipcMain.handle("updateWindow", async (event, options = {}) => {
    return await updateWindow({ ...options, mainWindow })
  })

  ipcMain.handle("openWithNative", async (event, options = {}) => {
    return await openWithNative({ ...options })
  })
}

async function openWithNative(options = {}) {
  shell.openExternal(`vscode://file/${options.url}`, {
    activate: true
  })
}

async function homeFolder(options = {}) {
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

async function exists(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const homePath = app.getPath("home")

async function updateWindow({ mainWindow, ...options } = {}) {
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

async function compileModel({ model, project } = {}) {
  const collection = await getCollection(project)
  const document = collection.document(model.id)

  const source = await document.compile()
  const compiled = await compile(source)

  return {
    source,
    compiled
  }
}

async function getModel({ model, project } = {}) {
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

async function getProjectData(options = {}) {
  console.log("GetProjectData", options)
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

const collections = new Map()

async function getCollection({
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

async function listProjects(options = {}) {
  const { paths } = await homeFolder()

  const data = await fs
    .readFile(paths.projects)
    .then((buf) => JSON.parse(String(buf)))

  return data
}

import { dialog, shell, screen, app } from "electron"
import fs from "fs/promises"
import { resolve } from "path"
import { Collection } from "@active-mdx/core"
import { compile } from "../javascript.js"
import storage from "../storage"
import { spawnSync } from "child_process"
import { findUp } from "find-up"
const homePath = app.getPath("home")
const appDataPath = app.getPath("appData")
const userDataPath = app.getPath("userData")

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

export async function importProjectFolders({
  filePaths,
  name = "ActiveMDX Project"
}) {
  const projects = await storage.get("projects")

  for (let folder of filePaths) {
    if (projects[folder]) {
      console.log(`Project ${folder} already exists`)
    } else {
      const folderExists = await exists(folder)

      if (!folderExists) {
        throw new Error(`Folder ${folder} does not exist`)
      }

      const manifestPath = await findUp("package.json", { cwd: folder })

      if (manifestPath) {
        const manifest = await fs
          .readFile(manifestPath)
          .then((buf) => JSON.parse(String(buf)))
        name = manifest.activeMdx?.name || manifest.name || name
      }

      const indexJsExists = await exists(resolve(folder, "index.js"))
      const indexMjsExists = await exists(resolve(folder, "index.mjs"))
      const modulePath = indexMjsExists
        ? "index.mjs"
        : indexJsExists
        ? "index.js"
        : undefined

      projects[folder] = {
        path: folder,
        name: name,
        ...(modulePath && { modulePath })
      }

      await storage.set("projects", projects)
    }
  }
}

export async function openDirectory(options = {}) {
  const { targetWindow } = options
  const result = await dialog.showOpenDialog(targetWindow, {
    properties: ["openDirectory"]
  })

  return ({ canceled, filePaths = [] } = result)

  if (canceled) {
    return
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

  console.log(`Getting Project Data`, { project })

  const collection = await getCollection({ ...project, refresh: true })

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
    console.log(`Loading Collection From Module Path`, {
      modulePath,
      modulePathImport
    })

    const collection = await import(modulePathImport).then(
      (mod) => mod.collection || mod.default
    )

    await collection.load({ refresh })

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

export async function untrackProject(project = {}) {
  const projects = storage.get("projects") || {}
  delete projects[project.path.replace("~", homePath)]
  storage.set("projects", projects)

  return listProjects()
}

export async function getPaths() {
  const envHomePath = resolve(homePath, ".active-mdx")
  const cachePath = resolve(envHomePath, "cache")

  return {
    home: homePath,
    appData: appDataPath,
    userData: userDataPath,
    cachePath,
    envHomePath
  }
}

export async function deleteModel({ model, project }) {
  const collection = await getCollection(project)

  await collection.deleteItem(model.id)

  return true
}

export async function readFile({ file }) {
  return fs.readFile(file).then((buf) => String(buf))
}

export async function validateModel({ model, project }) {
  const collection = await getCollection(project)
  const modelInstance = collection.getModel(model.id)

  await modelInstance.validate()

  return {
    errors: modelInstance.errors.toJSON(),
    isValid: !modelInstance.hasErrors,
    hasErrors: modelInstance.hasErrors
  }
}

export async function saveDocument({ id, content = "", project }) {
  const collection = await getCollection(project)
  const document = collection.document(id)

  await document.replaceContent(content)
  await document.save()

  console.log("Saving Document", { id, content: content.length, project })
  await collection.load({ refresh: true })

  return true
}

export async function createNewDocument({ model, values, project }) {
  const { name } = model
  const { title = "", prefix = model.prefix } = values
  const collection = await getCollection(project)

  const { packageRoot: cwd } = collection

  spawnSync("amdx", ["create", name, "--prefix", prefix, "--title", title], {
    cwd
  })

  await collection.load({ refresh: true })

  return values
}

async function exists(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

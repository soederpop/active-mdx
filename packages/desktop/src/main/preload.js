import { ipcRenderer, contextBridge } from "electron"
import minimist from "minimist"
import { omit, kebabCase, camelCase, mapKeys } from "lodash"

const METHODS = [
  "openWithNative",
  "updateWindow",
  "getModel",
  "getProjectData",
  "listProjects",
  "closeApp",
  "closeCurrentWindow",
  "showCurrentWindow",
  "hideCurrentWindow"
]

const baseApi = {
  runActiveMdxAction,
  renderMdxDocument,
  createWindow,
  storage: {
    set: setStorage,
    get: getStorage,
    patch: patchStorage
  }
}

const entryPoint = getEntryPoint() || "App"

function getEntryPoint() {
  const index = process.argv.indexOf("--entry")
  return process.argv[index + 1]
}

const baseArgv = minimist(process.argv.slice(2))
contextBridge.exposeInMainWorld("AppEntryOptions", {
  ...baseArgv,
  ...mapKeys(omit(baseArgv, "_", "entry"), (v, k) => camelCase(kebabCase(k))),
  _: baseArgv._,
  entryPoint
})

contextBridge.exposeInMainWorld(
  "API",
  METHODS.reduce(
    (memo, actionName) => ({
      ...memo,
      [actionName]: (options = {}) => {
        try {
          return ipcRenderer.invoke(actionName, options)
        } catch (error) {
          console.error("Error invoking action", actionName, error)
        }
      }
    }),
    baseApi
  )
)

let ipcChannel = 0

async function renderMdxDocument({ cwd, pathId, ...options }) {
  const { channel = `render-mdx-document-${ipcChannel++}` } = options

  return new Promise((resolve) => {
    const output = []

    ipcRenderer.on(`spawn-${channel}`, (event, data = {}) => {
      if (data.type === "stdout") {
        output.push(data.value)
      } else if (data.type === "close") {
        resolve(output)
      }
    })

    ipcRenderer.invoke("spawn", {
      service: "renderMdxDocument",
      channel,
      args: [pathId, `--active-mdx-cwd=${cwd}`, `--styles=true`]
    })
  })
}

async function runActiveMdxAction({
  cwd,
  actionName,
  models = [],
  onEvent,
  ...options
} = {}) {
  const { channel = `active-mdx-action-${ipcChannel++}` } = options

  const args = [
    actionName,
    ...models,
    ...Object.entries(options).map(([k, v]) => `--${k}=${v}`),
    `--active-mdx-cwd=${cwd}`
  ]

  ipcRenderer.on(`spawn-${channel}`, (event, data = {}) => {
    //console.log(`spawn-${channel}`, data)
    if (typeof onEvent === "function") {
      onEvent(data)
    }
  })

  await ipcRenderer.invoke("spawn", {
    service: "runActiveMdxAction",
    args,
    channel,
    cwd
  })
}

async function createWindow(options = {}) {
  await ipcRenderer.invoke("createWindow", options)
}

async function setStorage(key, value) {
  return await ipcRenderer.invoke("setStorage", { key, value })
}

async function patchStorage(key, value) {
  return await ipcRenderer.invoke("patchStorage", { key, value })
}

async function getStorage(key) {
  if (typeof key === "string") {
    return await ipcRenderer.invoke("getStorage", { key })
  } else if (typeof key === "object") {
    return await ipcRenderer.invoke("getStorage", key)
  }
}

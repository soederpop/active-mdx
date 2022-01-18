import { ipcRenderer } from "electron"
import hashObject from "hash-object"
import { resolve } from "path"

export const storage = {
  set: setStorage,
  get: getStorage,
  patch: patchStorage
}

let ipcChannel = 0

export async function runActiveMdxCommand({
  cwd,
  command,
  onEvent,
  ...options
} = {}) {
  const { channel = `active-command-${ipcChannel++}` } = options

  console.log(`Invoking runActiveMdxCommand`, {
    cwd,
    command,
    models,
    channel,
    ...options
  })

  const args = [
    command,
    ...Object.entries(options).map(([k, v]) => `--${k}=${v}`),
    `--active-mdx-cwd=${cwd}`
  ]

  ipcRenderer.on(`spawn-${channel}`, (event, data = {}) => {
    console.log(`runActiveMdxCommand spawn-${channel}`, data)
    //console.log(`spawn-${channel}`, data)
    if (typeof onEvent === "function") {
      onEvent(data)
    }
  })

  await ipcRenderer.invoke("spawn", {
    service: "runActiveMdxCommand",
    args,
    channel,
    cwd
  })
}

export async function renderMdxDocument({ cwd, pathId, ...options }) {
  const { channel = `render-mdx-document-${ipcChannel++}` } = options

  const paths = await ipcRenderer.invoke("getPaths")

  const outputFileName = `${hashObject({ cwd, pathId })}.html`
  const outputFile = resolve(paths.cachePath, "render", outputFileName)

  await new Promise((resolve) => {
    ipcRenderer.on(`spawn-${channel}`, (event, data = {}) => {
      if (data.type === "close") {
        resolve(outputFile)
      }
    })

    ipcRenderer.invoke("spawn", {
      service: "renderMdxDocument",
      channel,
      args: [
        pathId,
        `--active-mdx-cwd`,
        cwd,
        `--styles=true`,
        "--output-file",
        outputFile
      ]
    })
  })

  const content = await ipcRenderer.invoke("readFile", { file: outputFile })
  return content
}

export async function runActiveMdxAction({
  cwd,
  actionName,
  models = [],
  onEvent,
  ...options
} = {}) {
  const { channel = `active-mdx-action-${ipcChannel++}` } = options

  console.log(`Invoking runActiveMdxAction`, {
    cwd,
    actionName,
    models,
    channel,
    ...options
  })

  const args = [
    actionName,
    ...models,
    ...Object.entries(options).map(([k, v]) => `--${k}=${v}`),
    `--active-mdx-cwd=${cwd}`
  ]

  ipcRenderer.on(`spawn-${channel}`, (event, data = {}) => {
    console.log(`runActiveMdxAction spawn-${channel}`, data)
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

export async function createWindow(options = {}) {
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

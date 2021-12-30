import { ipcRenderer, contextBridge } from "electron"

const METHODS = [
  "openWithNative",
  "updateWindow",
  "getModel",
  "getProjectData",
  "listProjects"
]

const baseApi = {
  runActiveMdxAction
}

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

async function runActiveMdxAction({
  cwd,
  actionName,
  models = [],
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
    console.log(`spawn-${channel}`, data)
  })

  await ipcRenderer.invoke("spawn", {
    service: "runActiveMdxAction",
    args,
    channel,
    cwd
  })
}

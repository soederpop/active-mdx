import { ipcRenderer, contextBridge } from "electron"

const METHODS = [
  "openWithNative",
  "updateWindow",
  "getModel",
  "getProjectData",
  "listProjects"
]

contextBridge.exposeInMainWorld(
  "API",
  METHODS.reduce(
    (memo, actionName) => ({
      ...memo,
      [actionName]: (options = {}) => ipcRenderer.invoke(actionName, options)
    }),
    {}
  )
)

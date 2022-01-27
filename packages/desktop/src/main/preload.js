import { ipcRenderer, contextBridge } from "electron"
import minimist from "minimist"
import { omit, kebabCase, camelCase, mapKeys } from "lodash"
import * as API_CLIENT_METHODS from "./api/client"

/**
 * These are names of functions exported from ./server.js
 *
 * For simple cases where we just need to pass args from the renderer directly
 * to the main function, just put the name here.
 */
const METHODS = [
  "openWithNative",
  "updateWindow",
  "getModel",
  "getProjectData",
  "listProjects",
  "closeApp",
  "closeCurrentWindow",
  "showCurrentWindow",
  "hideCurrentWindow",
  "createNewDocument",
  "deleteModel",
  "validateModel",
  "untrackProject",
  "saveDocument",
  "openDirectory",
  "importProjectFolders"
]

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

const simpleDelegators = METHODS.reduce(
  (memo, actionName) => ({
    ...memo,
    [actionName]: (options = {}) => {
      try {
        console.log(`Invoking ${actionName}`, options)
        const result = ipcRenderer.invoke(actionName, options)
        console.log(`Result of ${actionName}`, { result })
        return result
      } catch (error) {
        console.error("Error invoking action", actionName, error)
      }
    }
  }),
  {}
)
contextBridge.exposeInMainWorld("API", {
  ...API_CLIENT_METHODS,
  ...simpleDelegators
})

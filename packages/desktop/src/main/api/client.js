import { ipcRenderer } from "electron"

export async function getProjectData(options = {}) {
  return ipcRenderer.invoke("getProjectData", options)
}

export async function listProjects(options = {}) {
  return ipcRenderer.invoke("listProjects", options)
}

export async function getModel(options = {}) {
  return ipcRenderer.invoke("getModel", options)
}

export async function updateWindow(options = {}) {
  return ipcRenderer.invoke("updateWindow", options)
}

export async function compileModel(options = {}) {
  return ipcRenderer.invoke("compileModel", options)
}

export function closeApp() {
  ipcRenderer.invoke("closeApp")
}

export function openWithNative(options) {
  ipcRenderer.invoke("openWithNative", options)
}

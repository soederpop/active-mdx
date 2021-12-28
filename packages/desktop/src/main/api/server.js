import { app, ipcMain } from "electron"
export const homePath = app.getPath("home")

export async function start(options = {}, callback) {
  console.log("Starting Server")
  const actions = await import("./actions.js")

  console.log("Actions", actions)
  await actions.homeFolder()

  console.log("Home Folder Setup")
  Object.keys(actions).forEach((actionName) => {
    console.log("Setting up IPC Action", actionName)
    ipcMain.handle(actionName, async (event, options) =>
      actions[actionName](options)
    )
  })
}

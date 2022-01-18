import { app, ipcMain, BrowserWindow } from "electron"
import { fork, spawn } from "child_process"
import path from "path"

export const homePath = app.getPath("home")

export async function start(options = {}, callback) {
  const actions = await import("./actions.js")

  await actions.homeFolder()

  Object.keys(actions).forEach((actionName) => {
    ipcMain.handle(actionName, async (event, options) =>
      actions[actionName]({
        ...options,
        targetWindow: BrowserWindow.fromWebContents(event.sender)
      })
    )
  })

  ipcMain.handle("spawn", (event, options) => {
    const { channel = "", args = [], service = "main" } = options
    const childScript = path.join(__dirname, "child.js")
    const childArgs = [service].concat(args)

    console.log(`Spawning Child Process`, {
      args: childArgs,
      script: childScript,
      options
    })

    const p = fork(childScript, childArgs, {
      stdio: ["pipe", "pipe", "pipe", "ipc"]
    })

    p.stdout.on("data", (d) => {
      console.log(`[ipc-stdout ${channel}] ${d}`)
      if (channel.length) {
        event.sender.send(`spawn-${channel}`, {
          type: "stdout",
          value: String(d)
        })
      }
    })

    p.stderr.on("data", (d) => {
      console.log(`[ipc-stderr ${channel}] ${d}`)
      if (channel.length) {
        event.sender.send(`spawn-${channel}`, {
          type: "stderr",
          value: String(d)
        })
      }
    })

    p.on("message", (m) => {
      console.log(`[ipc-message ${channel}] ${JSON.stringify(m)}`)
      if (channel.length) {
        event.sender.send(`spawn-${channel}`, {
          type: "message",
          value: m
        })
      }
    })

    p.on("close", (code) => {
      console.log(`spawned app ${channel} closed`, {
        code,
        args: childArgs,
        script: childScript
      })

      if (channel.length) {
        event.sender.send(`spawn-${channel}`, {
          type: "close",
          code
        })
      }
    })

    return options
  })
}

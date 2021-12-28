import { app, protocol, ipcMain, globalShortcut, BrowserWindow } from "electron"
import { is } from "electron-util"
import fs from "fs/promises"
import path from "path"
import { format } from "url"
import * as APIServer from "./api/server"
import { compile } from "./javascript"

let win = undefined

function createWindow() {
  if (win) {
    return win
  }

  win = new BrowserWindow({
    width: 800,
    height: 820,
    minHeight: 600,
    minWidth: 650,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false
    },
    show: false
  })

  win.setWindowButtonVisibility(false)

  const isDev = is.development

  if (isDev) {
    win.loadURL("http://localhost:9080")
  } else {
    win.loadURL(
      format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    )
  }

  win.on("closed", () => {
    win = undefined
  })

  return win
}

app.on("ready", function () {
  globalShortcut.register("CommandOrControl+,", function () {
    createWindow().show()
  })

  ipcMain.handle("closeApp", function () {
    createWindow().hide()
  })

  APIServer.start({
    mainWindow: createWindow()
  })

  /*
  protocol.registerFileProtocol("mdx", (request, callback) => {
    const pathname = decodeURI(request.url.replace("mdx://", ""))
    fs.readFile(pathname).then((buf) => {
      const data = compile(buf.toString())
      console.log(data)
      callback({
        path: pathname,
        mimeType: "text/javascript",
        data: "alert(1)"
      })
    })
  })
  */
})

app.on("activate", () => {
  if (win === null && app.isReady()) {
    createWindow()
  }
})

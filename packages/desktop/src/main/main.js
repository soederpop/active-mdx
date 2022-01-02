import { app, ipcMain, globalShortcut, BrowserWindow } from "electron"
import { is } from "electron-util"
import path from "path"
import { format } from "url"
import * as APIServer from "./api/server"
import captureLogs from "./logger"

let win = undefined

captureLogs()

export const getMainWindow = () => createMainWindow()

function createMainWindow() {
  if (win) {
    return win
  }

  win = createWindow({
    entryPoint: "App",
    minHeight: 600,
    minWidth: 650,
    titleBarStyle: "hidden",
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

function createWindow(params = {}) {
  const {
    entryPoint = "App",
    args = [],
    windowButtons = false,
    fullWidth = false,
    htmlFile = "index.html",
    htmlPath = path.join(__dirname, htmlFile),
    ...options
  } = params

  console.log("Creating Window", {
    htmlFile,
    htmlPath,
    entryPoint,
    args
  })

  const win = new BrowserWindow({
    width: 800,
    height: 820,
    titleBarStyle: "hidden",
    ...options,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      webSecurity: false,
      ...(options.webPreferences || {}),
      additionalArguments: ["--entry", entryPoint, ...args]
    }
  })

  win.setWindowButtonVisibility(!!windowButtons)

  const isDev = is.development

  if (isDev) {
    win.loadURL("http://localhost:9080")
  } else {
    win.loadURL(
      format({
        pathname: htmlPath,
        protocol: "file",
        slashes: true
      })
    )
  }

  return win
}

app.on("ready", function () {
  globalShortcut.register("CommandOrControl+,", function () {
    createMainWindow().show()
  })

  ipcMain.handle("closeApp", function () {
    createMainWindow().hide()
  })

  ipcMain.handle("closeCurrentWindow", function (event) {
    BrowserWindow.fromWebContents(event.sender).close()
  })

  ipcMain.handle("showCurrentWindow", function (event) {
    BrowserWindow.fromWebContents(event.sender).show()
  })

  ipcMain.handle("hideCurrentWindow", function (event) {
    BrowserWindow.fromWebContents(event.sender).hide()
  })

  ipcMain.handle(
    "createWindow",
    function (event, { showOnReady = false, ...options }) {
      const win = createWindow(options)

      if (showOnReady) {
        win.on("ready-to-show", () => win.show())
      }
    }
  )

  Promise.resolve(APIServer.start())

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
    createMainWindow()
  }
})

import React from "react"
import { render } from "react-dom"
import App from "./App"
import TerminalOutput from "./TerminalOutput"
import "./index.css"

console.log("App Entry Options", window.AppEntryOptions)

switch (window.AppEntryOptions.entryPoint) {
  case "TerminalOutput":
    render(
      <TerminalOutput
        channel={window.AppEntryOptions.channel}
        cwd={window.AppEntryOptions.cwd}
        actionName={window.AppEntryOptions.actionName}
        modulePath={window.AppEntryOptions.modulePath}
        models={window.AppEntryOptions.models?.split(",") || []}
      />,
      document.getElementById("root")
    )
    document.onkeydown = function (e) {
      if (e.key === "Escape") {
        e.preventDefault()
        API.hideCurrentWindow()
      }
    }
    break
  case "App":
  default:
    render(<App />, document.getElementById("root"))
    document.onkeydown = function (e) {
      if (e.key === "Escape") {
        e.preventDefault()
        API.closeApp()
      }
    }
}

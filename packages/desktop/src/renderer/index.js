import React from "react"
import { render } from "react-dom"
import { App } from "./App"
import "./index.css"

render(<App />, document.getElementById("root"))

document.onkeydown = function (e) {
  if (e.key === "Escape") {
    e.preventDefault()
    API.closeApp()
  }
}

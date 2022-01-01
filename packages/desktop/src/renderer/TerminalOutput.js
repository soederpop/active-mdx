import React, { useEffect, useState } from "react"
import AppProvider from "./components/AppProvider"

window.TERMINAL_OUTPUT_CACHE = {}

export default function TerminalOutput(props = {}) {
  return (
    <AppProvider>
      <OutputWrapper {...props} />
    </AppProvider>
  )
}

export function OutputWrapper({
  channel,
  actionName,
  cwd,
  autoCloseDelay = 5000,
  models = []
}) {
  // not sure why this is necessary
  const output = (window.TERMINAL_OUTPUT_CACHE[channel] =
    window.TERMINAL_OUTPUT_CACHE[channel] || [])

  const [stdout, setStdout] = useState(output)
  const [stopped, setStopped] = useState(undefined)

  useEffect(() => {
    API.showCurrentWindow()
  }, [])

  useEffect(() => {
    API.updateWindow({ profile: "top-drawer" })

    API.runActiveMdxAction({
      actionName,
      cwd,
      channel,
      models,
      onEvent: (event) => {
        switch (event.type) {
          case "stdout":
          case "stderr":
            output.push(event.value)
            setStdout(stdout.concat([event.value]))
            break
          case "close":
            setStopped(event.code)
            setTimeout(() => {
              autoCloseDelay && API.closeCurrentWindow()
            }, autoCloseDelay)
            break
          default:
            break
        }
      }
    })
  }, [channel, actionName, cwd])

  return (
    <div
      className="w-full h-full bg-black text-white"
      style={{ height: "100vh", width: "100%" }}
    >
      <div className="text-white border-b-2 m-b-3">
        amdx action {actionName} ${models.length ? models.join(",") : ""}
      </div>
      <pre>{stdout.join("")}</pre>
      {typeof stopped !== "undefined" && (
        <div className="text-white border-t-2 m-t-3">
          Process Exited with code {stopped}
        </div>
      )}
    </div>
  )
}

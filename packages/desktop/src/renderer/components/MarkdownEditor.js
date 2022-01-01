import React, { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"

export default function MarkdownEditor(props = {}) {
  const {
    onChange,
    height = "400px",
    width = "100%",
    theme = "vs-dark",
    options = {},
    enableMiniMap = false,
    handleSave
  } = props

  const [value, setValue] = useState(props.value || "")
  const [saved, setSaved] = useState(false)

  function handleKeyDown(e) {
    if (e.key === "s" && e.metaKey) {
      handleSave &&
        Promise.resolve(handleSave(value)).then(() => setSaved(true))
    }
  }

  console.log("Content Length", value.length)

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <>
      {saved && <SavedNotification onClose={() => setSaved(false)} />}
      <Editor
        theme={theme}
        defaultLanguage="markdown"
        height={height}
        width={width}
        defaultValue={value}
        options={{
          minimap: { enabled: enableMiniMap },
          wordWrap: "on",
          ...options
        }}
        onChange={(value, event) => {
          console.log("Value Length", value.length)
          setValue(value)
          typeof onChange === "function" && onChange(value, event)
        }}
      />
    </>
  )
}

function SavedNotification({ onClose }) {
  useEffect(() => {
    setTimeout(onClose, 500)
  }, [])

  return <div className="text-white">Saved Successfully</div>
}

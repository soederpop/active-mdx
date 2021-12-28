import React, { useState } from "react"
import Editor from "@monaco-editor/react"

export default function MarkdownEditor(props = {}) {
  const {
    onChange,
    height = "400px",
    width = "100%",
    theme = "vs-dark",
    options = {},
    enableMiniMap = false
  } = props

  const [value, setValue] = useState(props.value || "")

  return (
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
        setValue(value)
        typeof onChange === "function" && onChange(value, event)
      }}
    />
  )
}

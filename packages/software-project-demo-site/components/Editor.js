import React, { useEffect } from "react"
import MonacoEditor, { useMonaco } from "@monaco-editor/react"

export default function Editor(props = {}) {
  const monaco = useMonaco()

  useEffect(() => {
    if (monaco) {
      props.getEditor && props.getEditor(monaco)
    }
  }, [monaco])

  return (
    <MonacoEditor
      height="100vh"
      defaultValue={props.value}
      defaultLanguage={props.language}
      theme="vs-dark"
      {...props}
      options={{
        minimap: { enabled: false },
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 100,
        wordWrapMinified: true,
        // try "same", "indent" or "none"
        wrappingIndent: "none",
        ...props.options
      }}
    />
  )
}

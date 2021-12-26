import { useActiveCode } from "@codesandbox/sandpack-react"
import MonacoEditor from "@monaco-editor/react"

export default function CustomEditor(props = {}) {
  const { language = "javascript" } = props
  const activeCode = useActiveCode()
  const { code, updateCode } = activeCode

  console.log(activeCode)

  return (
    <MonacoEditor
      height="90vh"
      width="100%"
      defaultLanguage={language}
      value={code}
      onChange={(value) => updateCode(value)}
      theme="vs-dark"
      options={{
        minimap: { enabled: false }
      }}
    />
  )
}

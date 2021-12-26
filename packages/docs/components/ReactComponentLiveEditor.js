import LiveCodeEditor from "components/LiveCodeEditor"

export default function EditorPage(props = {}) {
  const dependencies = {
    react: "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    ...(props.dependencies || {})
  }

  const files = {
    "/App.js":
      props.source ||
      `import React from "react";\nexport default function App() {\n  return <h1>Hello</h1>;\n}`
  }

  const customSetup = {
    entry: "/index.js"
  }

  return (
    <LiveCodeEditor
      customSetup={customSetup}
      files={files}
      dependencies={dependencies}
    />
  )
}

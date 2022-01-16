import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
  useSandpack
} from "@codesandbox/sandpack-react"
import CustomEditor from "components/CustomEditor"
import "@codesandbox/sandpack-react/dist/index.css"

const DEFAULT_FILES = {
  "/index.js":
    'import React, { StrictMode } from "react";\nimport ReactDOM from "react-dom";\nimport "./styles.css";\n\nimport App from "./App";\n\nconst rootElement = document.getElementById("root");\nReactDOM.render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n  rootElement\n);',
  "/styles.css":
    "body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}",
  "/public/index.html":
    '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>'
}
export default function LiveCodeEditor(props = {}) {
  const { dependencies = {}, files = {}, customSetup = {} } = props

  return (
    <SandpackProvider
      activePath="/App.js"
      {...props}
      customSetup={{
        dependencies,
        files: toSandboxFiles({
          ...DEFAULT_FILES,
          ...files
        }),
        ...customSetup
      }}
    >
      <SandpackThemeProvider theme="sandpack-dark">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%"
          }}
        >
          <div style={{ flexBasis: "100%", flex: 1 }}>
            <CustomEditor />
          </div>
          <div style={{ flexBasis: "100%", flex: 1 }}>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              viewportSize={{ height: "100vh", width: "100%" }}
            />
          </div>
        </div>
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

function MyComponent() {
  const { sandpack } = useSandpack()
  console.log("Sandpack", JSON.stringify(sandpack.files, null, 2))
  return <div>Yeah</div>
}

function toSandboxFiles(files = {}) {
  return Object.entries(files).reduce((acc, [key, code]) => {
    acc[key] = { code }
    return acc
  }, {})
}

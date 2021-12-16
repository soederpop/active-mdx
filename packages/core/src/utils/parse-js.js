import { parseSync } from "@babel/core"

export default function parseJavaScript(content) {
  const ast = parseSync(content, {
    sourceType: "module"
  })

  return ast
}

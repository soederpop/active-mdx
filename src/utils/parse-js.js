import { parseAsync } from "@babel/core"

export default async function parseJavaScript(content) {
  const ast = await parseAsync(content, {
    sourceType: "module"
  })

  return ast
}

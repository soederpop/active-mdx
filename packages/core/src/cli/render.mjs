import { bundleMDX } from "mdx-bundler"
import { getMDXComponent } from "mdx-bundler/client/index.js"
import { renderToStaticMarkup } from "react-dom/server.js"
import { createElement } from "react"

export default async function render(argv) {
  const { collection } = argv
  const pathId = argv._[1]

  const { code } = await bundleMDX({
    file: collection.items.get(pathId).path,
    cwd: collection.packageRoot
  })

  const Component = getMDXComponent(code)

  console.log(renderToStaticMarkup(createElement(Component, {})))
}

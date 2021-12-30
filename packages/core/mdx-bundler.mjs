import { bundleMDX } from "mdx-bundler"
import { getMDXComponent } from "mdx-bundler/client/index.js"
import { renderToStaticMarkup } from "react-dom/server.js"
import { createElement } from "react"

async function main() {
  const { code, frontmatter } = await bundleMDX({
    file: "./examples/sdlc/epics/authentication.mdx",
    cwd: process.cwd()
  })

  const Component = getMDXComponent(code)

  console.log(renderToStaticMarkup(createElement(Component, {})))
}

main()

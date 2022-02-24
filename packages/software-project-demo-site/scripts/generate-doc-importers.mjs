import fs from "fs/promises"
import path from "path"
import docs from "../docs/index.mjs"

async function main() {
  await docs.load()

  const docsComponentsFolder = path.resolve(process.cwd(), "components", "docs")

  await fs.rm(docsComponentsFolder, { recursive: true })

  await Promise.all(
    docs.available.map((id) => {
      const dir = id.split("/").slice(0, -1)
      return fs.mkdir(path.resolve(docsComponentsFolder, ...dir), {
        recursive: true
      })
    })
  )

  await Promise.all(
    docs.available.map((id) => {
      const info = path.parse(docs.items.get(id).path)
      const contents = createComponent(id, info.ext)
      const filePath = id.split("/")

      return fs.writeFile(
        `${path.resolve(docsComponentsFolder, ...filePath)}.js`,
        contents,
        "utf8"
      )
    })
  )
}

function createComponent(id, extension) {
  const template = `
import React from 'react'
import Component from 'docs/${id}${extension}'
import DocumentRenderer from 'components/DocumentRenderer'

export default function DocComponent(props = {}) {
  return <DocumentRenderer {...props} Component={Component} />
}

`.trimStart()

  return template
}

main()

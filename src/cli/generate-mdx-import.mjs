import { Collection } from "../../index.js"
import lodash from "lodash"
import fs from "fs/promises"
import path from "path"

const { camelCase, kebabCase, upperFirst } = lodash

export default async function generateMdxImport(options = {}) {
  const { output, rootPath = Collection.resolve() } = options

  const collection = new Collection({ rootPath: Collection.resolve(rootPath) })

  await collection.load()

  const modules = collection.available.map((id) => [id, toComponentName(id)])

  const lines = [
    `// This file is only necessary because I have problems dynamically importing MDX files`
  ]

  modules.forEach(([id, name]) => {
    const extension = collection.items.get(id).path.split(".").pop()
    lines.push(`import ${name} from "./${id}.${extension}"`)
  })

  lines.push(`const mdx = {`)

  modules.forEach(([id, name]) => {
    lines.push(`  "${id}": ${name},`)
  })

  lines.push(`}`)
  lines.push(`export default mdx`)

  console.log("generating mdx import", { output })

  if (output) {
    const outputPath = path.resolve(output)
    await fs.writeFile(outputPath, lines.join("\n") + "\n", "utf8")
    console.log(outputPath)
  } else {
    console.log("yo")
    console.log(lines.join("\n"))
  }
}

const prefixCounts = {
  index: 0
}

function toComponentName(id) {
  const prefix = id.split("/")[0].toLowerCase()

  prefixCounts[prefix] = prefixCounts[prefix] || 0
  prefixCounts[prefix]++

  return upperFirst(camelCase(kebabCase(prefix))) + `${prefixCounts[prefix]}`
}

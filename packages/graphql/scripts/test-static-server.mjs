import fs from "fs/promises"
import path from "path"
import createServerFromCollectionExport from "../server.js"

async function main() {
  const exportFile = await fs
    .readFile(path.join(process.cwd(), "data", "collection-export.json"))
    .then((b) => JSON.parse(b))

  const server = createServerFromCollectionExport(exportFile)

  await server.listen()

  console.log(`Server is listening`)
}

main()

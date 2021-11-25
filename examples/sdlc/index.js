import { Collection } from "active-md"
import Epic from "./models/epic.js"

async function main() {
  const collection = new Collection({
    rootPath: process.cwd()
  })

  await collection.load()

  const auth = collection.document("epics/authentication")

  const epic = new Epic(auth)

  console.log(epic)
}

main()

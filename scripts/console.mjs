import runtime from "@skypager/node"
import pkg from "../dist/index.cjs"
const { Model, Document, Collection } = pkg
import { collection, Epic, Story } from "../examples/sdlc/index.js"

async function main() {
  await collection.load()

  await runtime.repl("interactive").launch({
    runtime,
    Document,
    Collection,
    Model,
    collection,
    Epic,
    Story,
    auth: collection.document("epics/authentication"),
    epic: Epic.from(collection.document("epics/authentication"))
  })
}

main()

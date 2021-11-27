import runtime from "@skypager/node"
import { Model, Collection, Document } from "../index.js"
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
    epic: Epic.from(collection.document("epics/authentication")),
    search: Epic.from(collection.document("epics/search"))
  })
}

main()

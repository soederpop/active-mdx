import runtime from "@skypager/node"
import { Model, Collection, Document } from "../index.js"
import { collection, Epic, Story } from "../examples/sdlc/index.js"
import docs from "../../docs/content/index.mjs"
import basic from "../templates/basic/index.js"

async function main() {
  await collection.load()
  await docs.load()

  await runtime.repl("interactive").launch({
    runtime,
    Document,
    Collection,
    Model,
    collection,
    Epic,
    Story,
    authDoc: collection.document("epics/authentication"),
    epic: Epic.from(collection.document("epics/authentication")),
    search: Epic.from(collection.document("epics/searching-and-browsing")),
    docs,
    astQueryDoc: docs.document("api/AstQuery"),
    astQuery: docs.document("api/AstQuery").toModel(),
    basic
  })
}

main()

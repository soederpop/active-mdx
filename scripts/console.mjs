import runtime from "@skypager/node"
import pkg from "../dist/index.cjs"
const { Document, Collection } = pkg

async function main() {
  const c = new Collection({ rootPath: runtime.resolve("examples/sdlc") })

  await c.load()

  const d = c.document("index")

  await runtime.repl("interactive").launch({
    runtime,
    Document,
    Collection,
    c,
    d
  })
}

main()

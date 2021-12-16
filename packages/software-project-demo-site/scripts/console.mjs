import runtime from "@skypager/node"
import docs from "../docs/index.mjs"

async function main() {
  await docs.load()

  const ctx = {}

  Array.from(docs.models.entries()).forEach(([key, model]) => {
    ctx[key] = model.ModelClass
  })

  await runtime.repl("interactive").launch({
    runtime,
    docs,
    ...ctx
  })
}

main()

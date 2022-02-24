import runtime from "@skypager/node"
import docs from "../../software-project-demo-site/docs/index.mjs"
import gql from "../index.js"

async function main() {
  await docs.use(gql, {}).load()

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

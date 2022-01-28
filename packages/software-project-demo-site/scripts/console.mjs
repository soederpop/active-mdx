import runtime from "@skypager/node"
import docs from "../docs/index.mjs"
import { create } from "../docs/lib/github.js"

async function main() {
  await docs.load()

  const ctx = {}

  Array.from(docs.models.entries()).forEach(([key, model]) => {
    ctx[key] = model.ModelClass
  })

  await runtime.repl("interactive").launch({
    runtime,
    docs,
    octo: await create({
      accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    }),
    ...ctx
  })
}

main()

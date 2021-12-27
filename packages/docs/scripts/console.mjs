import runtime from "@skypager/node"
import docs from "../content/index.mjs"

async function main() {
  await docs.load()
  await runtime.repl("interactive").launch({
    runtime,
    docs
  })
}

main()

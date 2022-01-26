import runtime from "@skypager/node"
import software from "../content/usecases/software-development/docs/index.mjs"
import docs from "../content/index.js"

async function main() {
  await software.load()

  await runtime.repl("interactive").launch({
    runtime,
    software,
    docs
  })
}

main()

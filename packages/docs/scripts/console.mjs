import runtime from "@skypager/node"
import software from "../content/usecases/software-development/docs/index.mjs"

async function main() {
  await software.load()

  await runtime.repl("interactive").launch({
    runtime,
    software
  })
}

main()

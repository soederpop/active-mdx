import runtime from "@skypager/node"
import docs from "../content/index.mjs"

async function main() {
  await docs.load()
  docs.document("demos/epic-demo").stringify()
}

main()

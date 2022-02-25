import docs from "../../software-project-demo-site/docs/index.mjs"
import gql from "../index.js"

async function main() {
  await docs.load()

  docs.use(gql)

  const server = docs.createGraphqlServer()

  await server.listen()

  console.log("Server is listening")
}

main()

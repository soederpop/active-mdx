import collection from "../docs/index.mjs"
import graphqlPlugin from "@active-mdx/graphql"

async function main() {
  collection.use(graphqlPlugin)

  await collection.load()

  const server = collection.createGraphqlServer()

  await server.listen()
}

main()

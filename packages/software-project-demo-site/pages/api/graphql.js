import { ApolloServer } from "apollo-server-micro"
import docs from "docs"
import gqlPlugin from "@active-mdx/graphql"

const apolloServer = docs.use(gqlPlugin).createGraphqlServer({}, ApolloServer)

export const config = {
  api: {
    bodyParser: false
  }
}

let started

export default async function handler(req, res) {
  if (!docs.loaded) {
    await docs.load()
  }

  if (!started) {
    await apolloServer.start()
    started = true
  }

  const gqlHandler = apolloServer.createHandler({ path: "/api/graphql" })

  return gqlHandler(req, res)
}

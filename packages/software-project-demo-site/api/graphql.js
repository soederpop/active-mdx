import Cors from "cors"
import { ApolloServer } from "apollo-server-micro"
import createServer from "@active-mdx/graphql"

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST"]
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
export const config = {
  api: {
    bodyParser: false
  }
}

let started
let apolloServer

export default async function handler(req, res) {
  if (!apolloServer) {
    const exportFile = await import("../docs/collection-export.cjs")
    apolloServer = createServer(exportFile, ApolloServer)
  }

  await runMiddleware(req, res, cors)

  if (!docs.loaded) {
    console.log("loading docs")
    await docs.load()
  }

  if (!started) {
    console.log("starting graphql server")
    await apolloServer.start()
    started = true
  }

  const gqlHandler = apolloServer.createHandler({ path: "/api/graphql" })

  return gqlHandler(req, res)
}

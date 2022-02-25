import Cors from "cors"
import { ApolloServer } from "apollo-server-micro"

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

export function createServer(
  exportFile = {},
  ServerProvider = ApolloServer,
  options = {}
) {
  const resolvers = defaultsDeep(
    {},
    createResolvers(exportFile),
    options.resolvers || {}
  )

  return new ServerProvider({
    ...options,
    typeDefs: createTypeDefs(exportFile),
    resolvers
  })
}

function createResolvers({ modelData = {}, models = [] }) {
  const idIndex = mapValues(modelData, (v) => keyBy(v, "id"))

  const Query = models.reduce((memo, model) => {
    return {
      ...memo,
      [model.inflections.plural]: async (root, args, context, info) => {
        return modelData[model.name]
      },
      [model.inflections.singular]: async (root, args, context, info) => {
        const { id } = args
        return idIndex[model.name][id]
      }
    }
  }, {})

  return { Query }
}

function createTypeDefs({ models = [] }) {
  const typeDefs = models
    .map((modelClass) => createGQLType(modelClass, modelClass.schema))
    .join("\n")

  const modelQueries = models
    .reduce((memo, modelClass) => {
      return memo.concat([
        `${modelClass.inflections.singular}: ${modelClass.name}`,
        `${modelClass.inflections.plural}: [${modelClass.name}]`
      ])
    }, [])
    .flatMap((i) => i)

  const queryTypeDef = [
    `type Query {`,
    ...modelQueries.map((line) => `  ${line}`),
    `}`
  ].join("\n")

  return gql([typeDefs, queryTypeDef].join("\n"))
}

function joiObjectToGQLType(typeName = "", joiSchema = {}) {
  const subTypes = []

  const attributes = Object.entries(joiSchema.keys || {}).reduce(
    (memo, entry) => {
      const [name, config] = entry
      const { flags = {} } = config

      if (config.type === "string" && name !== "id") {
        if (flags?.presence === "required") {
          memo.push(`${name}: String!`)
        } else {
          memo.push(`${name}: String`)
        }
      }

      if (config.type === "number") {
        if (flags?.presence === "required") {
          memo.push(`${name}: Int!`)
        } else {
          memo.push(`${name}: Int`)
        }
      }

      if (config.type === "object") {
        subTypes.push(
          joiObjectToGQLType(`${typeName}${upperFirst(name)}`, config)
        )
        memo.push(`${name}: ${typeName}${upperFirst(name)}`)
      }

      return memo
    },
    []
  )

  const modelAttributes = attributes.map((attr) => {
    if (typeof attr === "string") {
      return attr
    }
  })

  return [
    ...subTypes,
    `type ${typeName} {`,
    `  id: String!`,
    ...modelAttributes.map((line) => `  ${line}`),
    `}`
  ].join("\n")
}

export function createGQLType(modelClass, schemaData) {
  if (typeof modelClass === "string") {
    modelClass = { name: modelClass }
  }

  const modelTypeDef = joiObjectToGQLType(modelClass.name, schemaData)

  return modelTypeDef
}

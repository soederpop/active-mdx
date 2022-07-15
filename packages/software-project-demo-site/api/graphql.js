import Cors from "cors"
import { ApolloServer } from "apollo-server-micro"
import { gql } from "apollo-server"
import { mapValues, keyBy, upperFirst, defaultsDeep } from "lodash-es"

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
    const exportFile = await import("../docs/collection-export.cjs").then(
      (mod) => mod.default
    )
    apolloServer = createServer(exportFile, ApolloServer, {
      introspection: true
    })
  }

  await runMiddleware(req, res, cors)

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

  console.log("Export File", Object.keys(exportFile))

  return new ServerProvider({
    introspection: true,
    playground: true,
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
  console.log(`Creating Type Defs`, models.length)

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

  const code = [typeDefs, queryTypeDef].join("\n")

  console.log("gql", code)

  return gql(code)
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

      if (config.type === "array") {
        const { items = [] } = config

        if (items[0]?.type === "string") {
          memo.push(`${name}: [String]`)
        }

        if (items[0]?.type === "object") {
          subTypes.push(
            joiObjectToGQLType(`${typeName}${upperFirst(name)}`, items[0])
          )
          memo.push(`${name}: [${typeName}${upperFirst(name)}]`)
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

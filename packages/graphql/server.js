import { mapValues, keyBy, upperFirst } from "lodash-es"
import { ApolloServer, gql } from "apollo-server"

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

export default createServer

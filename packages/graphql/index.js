import { upperFirst } from "lodash-es"
import { gql, ApolloServer } from "apollo-server"

export default function plugin(collection, options = {}) {
  const Model = collection.models.get("Model").ModelClass

  collection.createGraphqlServer = (options) => {
    return new ApolloServer({
      typeDefs: gql(collection.toGraphqlSchema()),
      resolvers: collection.toGraphqlResolvers()
    })
  }

  collection.toGraphqlSchema = function (options) {
    const typeDefs = collection.modelClasses
      .map((modelClass) => modelClass.toGraphqlType(options))
      .join("\n")

    const modelQueries = collection.modelClasses
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
    return [typeDefs, queryTypeDef].join("\n")
  }

  Model.toGraphqlType = function (options = {}) {
    return createGQLType(this, options)
  }

  collection.toGraphqlResolvers = function (options = {}) {
    return {
      Query: collection.modelClasses.reduce((memo, modelClass) => {
        return {
          ...memo,
          ...generateGQLResolvers(modelClass, { ...options, collection })
        }
      }, {})
    }
  }
}

function generateGQLResolvers(modelClass, { collection } = {}) {
  return {
    [modelClass.inflections.singular]: async (
      root,
      args = {},
      context,
      info
    ) => {
      const { id } = args
      return collection.getModel(id).toJSON()
    },
    [modelClass.inflections.plural]: async (root, args, context, info) => {
      return modelClass
        .query(args.params || {})
        .fetchAll()
        .then((models) => models.map((m) => m.toJSON()))
    }
  }
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

function createGQLType(modelClass, options = {}) {
  const schemaData = modelClass.schema.describe()

  const modelTypeDef = joiObjectToGQLType(modelClass.name, schemaData)

  return modelTypeDef
}

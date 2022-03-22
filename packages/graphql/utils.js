import { upperFirst } from "lodash-es"

export function joiObjectToGQLType(typeName = "", joiSchema = {}) {
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

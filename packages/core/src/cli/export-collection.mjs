import stringifyObject from "stringify-object"

export default async function exportCollection(options = {}) {
  const { collection } = options
  const json = await collection.export(options)

  if (options.format === "cjs") {
    console.log(`
module.exports = ${stringifyObject(json, { indent: "  " })}     
    `)
  } else if (options.format === "mjs") {
    const exportDeclarations = Object.entries(json).map(
      ([key, value]) =>
        `export const ${key} = ${stringifyObject(value, { indent: "  " })}`
    )
    console.log(exportDeclarations.join("\n"))
  } else {
    console.log(JSON.stringify(json, null, 2))
  }
}

export default async function inspect(options = {}) {
  const { collection } = options
  const { availableActions } = collection

  console.log(
    `
Collection Info:
  rootPath: ${collection.rootPath}
  packageRoot: ${collection.packageRoot}
  ${availableActions.length ? "actions:" : ""} 
  ${availableActions.map((name) => `  - ${name}`).join("\n")}
 
Models:
`.trim() + "\n"
  )

  collection.modelClasses.forEach((ModelClass) => {
    const { name, availableActions, availableQueries, prefix } = ModelClass

    console.log(
      `
${name}
---
  prefix: ${prefix}/
  ${availableActions.length ? "actions:" : ""} 
${availableActions.map((name) => `  - ${name}`).join("\n")}
  ${availableQueries.length ? "queries:" : ""} 
${availableQueries.map((name) => `  - ${name}`).join("\n")}
`.trim() + "\n"
    )
  })
}

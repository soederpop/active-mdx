import Collection from "../Collection.js"
import fs from "fs/promises"
import path from "path"

export default async function runAction(argv) {
  const [action, ...pathIds] = argv._.slice(1)

  let { modulePath, rootPath = Collection.resolve() } = argv

  if (typeof modulePath !== "string") {
    const indexExists = await exists(path.resolve(rootPath, "index.js"))
    const indexModExists = await exists(path.resolve(rootPath, "index.mjs"))

    if (indexExists) {
      modulePath = path.resolve(rootPath, "index.js")
    } else if (indexModExists) {
      modulePath = path.resolve(rootPath, "index.mjs")
    }
  }

  const collection = modulePath
    ? await import(path.resolve(modulePath)).then((mod) => {
        return mod.collection || mod.default
      })
    : new Collection({ rootPath })

  if (modulePath && collection?.constructor?.name !== "Collection") {
    throw new Error(
      `You passed a module path. We expect this module to export a collection as the named export collection or default export.`
    )
  }

  await collection.load({ models: !modulePath })

  if (collection.actions.has(action) && !pathIds.length) {
    await collection.runAction(action, argv)
    return
  }

  for (let pathId of pathIds) {
    const model = collection.getModel(pathId)

    if (!model) {
      console.warn(`Could not find a model with the id: ${pathId}`)
      console.warn(`Available: ${collection.available.join(",")}`)
      break
    }

    if (model.constructor.availableActions.indexOf(action) === -1) {
      console.warn(
        `${action} is not an available action on the model class ${model.modelName}`
      )
      break
    }

    const actionFn = model.constructor.actions.get(action).fn

    await actionFn(model, argv)
  }
}

async function exists(path) {
  try {
    await fs.stat(path)
    return true
  } catch (error) {
    return false
  }
}

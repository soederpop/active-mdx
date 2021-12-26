import Collection from "../Collection.js"
import fs from "fs/promises"
import path from "path"

export default async function runAction(argv = {}) {
  const [action, ...pathIds] = argv._.slice(1)

  const { collection } = argv

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

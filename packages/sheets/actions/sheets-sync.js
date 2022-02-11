import { isInteger, set } from "lodash-es"

export default async function sheetsSyncAction(collection, argv = {}) {
  const { sheets } = collection
  const { sheetId, name = sheetId } = argv

  if (!sheetId && !name) {
    throw new Error(
      `Must provide a sheetId argument or the name of a sheet which is configured for this collection.`
    )
  }

  const spreadSheet = await sheets.sheet(name)
  const { sheets: sheetMappings } = spreadSheet.options

  for (let entry of Object.entries(sheetMappings)) {
    const [sheetTitle, config] = entry
    let modelName
    let mappings

    if (
      typeof config.mappings === "object" &&
      typeof config.model === "string"
    ) {
      mappings = config.mappings
      modelName = config.model
    } else {
      mappings = config
      modelName =
        collection.modelAliases[String(sheetTitle)] ||
        collection.modelAliases[String(sheetTitle).toLowerCase()] ||
        sheetTitle
    }

    if (!collection.models.has(modelName)) {
      throw new Error(
        `Invalid Mapping Config.  Could not find a model name to match ${sheetTitle}`
      )
    }

    const ModelClass = collection.model(modelName)

    const WorkSheet =
      spreadSheet.googleDocument.sheetsByTitle[sheetTitle] ||
      (await spreadSheet.googleDocument.addSheet({
        title,
        headerValues: Object.keys(mappings)
      }))

    const sheetRows = await WorkSheet.getRows()

    for (let sheetRow of sheetRows) {
      const instance = collection.getModel(sheetRow.id)

      for (let headerColumn of WorkSheet.headerValues.filter(
        (name) => name !== "id"
      )) {
        const sourcePath = mappings[headerColumn]

        try {
          if (sourcePath.startsWith("meta")) {
            let nextValue = sheetRow[headerColumn]

            if (isInteger(parseInt(nextValue, 10))) {
              nextValue = parseInt(nextValue, 10)
            }

            set(
              instance.meta,
              sourcePath.replace("meta.", "").split("."),
              nextValue
            )
          }
        } catch (error) {
          console.error(
            `Error setting ${sourcePath} on ${ModelClass.name}#${instance.id}: ${error.message}`
          )
        }
      }

      await instance.save()
    }
  }
}

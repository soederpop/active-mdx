export default async function sheetsExportAction(collection, argv = {}) {
  const { sheets } = collection
  const { sheetId, name = sheetId } = argv

  if (!sheetId && !name) {
    throw new Error(
      `Must provide a sheetId argument or the name of a sheet which is configured for this collection.`
    )
  }

  const spreadSheet = await sheets.sheet(name)
  const { sheets: sheetMappings } = spreadSheet.options

  const output = {}

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

    const rowsData = await ModelClass.extractSheetData(mappings)

    console.log({ mappings, sheetTitle, modelName, rowsData })

    output[sheetTitle] = {
      mappings,
      modelName,
      sheetTitle,
      data: rowsData
    }

    for (let row of rowsData) {
      await WorkSheet.addRow(row).catch((error) => {
        console.error(
          `Error while adding row`,
          error.message,
          error.toJSON ? error.toJSON() : {}
        )
      })
    }
  }

  return output
}

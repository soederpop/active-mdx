import Sheets from "./Sheets.js"
import { get, mapValues } from "lodash-es"
import sheetsExportAction from "./actions/sheets-export.js"
import sheetsSyncAction from "./actions/sheets-sync.js"

export default function plugin(collection, options = {}) {
  collection.sheets = new Sheets(collection, options)

  const sheets = {
    ...(options.sheets || {}),
    ...(collection.packageManifest?.activeMdx?.sheets || {})
  }

  const Model = collection.models.get("Model").ModelClass

  Model.extractSheetData = async function extractSheetData(mappings = {}) {
    const models = await this.fetchAll()

    return models.map((instance) => {
      const json = instance.toJSON()

      return mapValues(mappings, (path, key) => {
        return get(json, path, `Missing value for ${path}`).toString()
      })
    })
  }

  Object.entries(sheets).forEach(([name, options]) => {
    if (typeof options === "string") {
      options = { sheetId: options }
    }

    collection.sheets.sheet(name, options)
  })

  collection.action("sheets:export", sheetsExportAction)
  collection.action("sheets:sync", sheetsSyncAction)
}

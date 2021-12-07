import { Collection } from "../index.js"
import ApiDoc from "./models/ApiDoc.js"

import path from "path"

const rootPath = path.parse(import.meta.url.replace("file://", "")).dir

export const collection = new Collection({ rootPath, models: [ApiDoc] })

collection.model("ApiDoc", ApiDoc)
collection.action("generate-api-docs", generateApiDocs)

export { ApiDoc }

export default collection

async function generateApiDocs(collection) {
  const apiDocs = await ApiDoc.query((qb) => {
    qb.where("meta.nodoc", "neq", true)
  }).fetchAll()

  for (let apiDoc of apiDocs) {
    if (!apiDoc.meta.path) {
      console.log("API Doc is missing a path meta attribute", apiDoc.id)
    } else {
      console.log(`Syncing ${apiDoc.meta.path} -> ${apiDoc.id}`)
    }
    //await apiDoc.runAction("sync-with-code")
  }
}

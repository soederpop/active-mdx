import { Collection } from "@active-mdx/core"
import ApiDoc from "./models/ApiDoc.js"

import path from "path"

const rootPath = path.parse(import.meta.url.replace("file://", "")).dir

export const collection = new Collection({ rootPath, models: [ApiDoc] })

collection.model("ApiDoc", ApiDoc)

export { ApiDoc }

export default collection

collection.action("generate-api-docs", async function generateApiDocs() {
  const apiDocs = await ApiDoc.fetchAll()

  for (let apiDoc of apiDocs) {
    await apiDoc.validate()

    if (!apiDoc.hasErrors) {
      try {
        await apiDoc.syncWithCode()
        await apiDoc.save()
        console.log(`Saved ${apiDoc.id}`)
      } catch (error) {
        console.error(`Failed to save ${apiDoc.id}`, error)
      }
    } else {
      console.log(`${apiDoc.id} is not valid. Skipping`)
    }
  }
})

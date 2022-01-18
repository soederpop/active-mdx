import { Collection } from "@active-mdx/core"
import ApiDoc from "./models/ApiDoc.js"

import path from "path"

const rootPath = path.parse(import.meta.url.replace("file://", "")).dir

export const collection = new Collection({ rootPath, models: [ApiDoc] })

collection.model("ApiDoc", ApiDoc)

export { ApiDoc }

export default collection

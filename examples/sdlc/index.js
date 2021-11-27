import { Collection } from "../../src/index.js"
import Epic from "./models/Epic.js"
import Story from "./models/Story.js"

import path from "path"

const rootPath = path.parse(import.meta.url.replace("file://", "")).dir

export const collection = new Collection({ rootPath })

collection.model("Epic", Epic)
collection.model("Story", Story)

export { Epic, Story }

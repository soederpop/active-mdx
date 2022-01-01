import { Collection } from "@active-mdx/core"
import Epic from "./models/Epic.mjs"
import Story from "./models/Story.mjs"
import Standup from "./models/Standup.mjs"
import path from "path"

const rootPath = path.parse(import.meta.url.replace("file://", "")).dir
const collection = new Collection({ rootPath, models: [Epic, Story, Standup] })

export { Epic, Story, Standup }

export default collection

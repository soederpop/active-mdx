import { Collection } from "active-mdx"

import Epic from "./models/Epic.mjs"
import Story from "./models/Story.mjs"
import Standup from "./models/Standup.mjs"

const collection = new Collection({
  rootPath: Collection.resolve("docs")
})

export { Epic, Story, Standup }

export default collection
  .model("Epic", Epic)
  .model("Story", Story)
  .model("Standup", Standup)

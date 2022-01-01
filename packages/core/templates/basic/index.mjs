import { Collection } from "@active-mdx/core"
import Post from "./models/Post.mjs"
import Author from "./models/Author.mjs"

const collection = new Collection({
  rootPath: Collection.resolve(import.meta.url),
  models: [Post, Author]
})

export default collection

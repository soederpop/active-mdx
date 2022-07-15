import { Collection } from "@active-mdx/core"
import Post from "./models/Post.js"
import Author from "./models/Author.js"

const collection = new Collection({
  rootPath: Collection.resolve(import.meta.url)
})

export default collection.model("Post", Post).model("Author", Author)

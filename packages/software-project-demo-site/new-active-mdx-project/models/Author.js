import { Model } from "@active-mdx/core"
import Post from "./Post.js"

export default class Author extends Model {
  allPosts() {
    return Post.query((qb) => {
      qb.where("meta.author", this.id.replace("authors/", ""))
    }).fetchAll()
  }
}

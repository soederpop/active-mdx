import { Model } from "active-mdx"

export default class Post extends Model {
  author() {
    return this.belongsTo("Author", {
      id: (doc) => doc.meta.author
    })
  }

  get isPublished() {
    return this.meta.status === "published"
  }

  get isDraft() {
    return this.meta.status === "draft"
  }

  get externalLinks() {
    return this.document.nodes.links.map((link) => link.url)
  }
}

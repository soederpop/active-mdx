import { Model } from "active-mdx"
import Epic from "./Epic.mjs"

export default class Story extends Model {
  get defaults() {
    return {
      meta: {
        status: "created",
        estimates: {
          low: 0,
          high: 0
        }
      }
    }
  }

  toJSON({ related = [], attributes = [], ...options } = {}) {
    return super.toJSON({
      related,
      attributes: [
        "description",
        "isComplete",
        "slug",
        "acceptanceCriteria",
        "mockupLinks",
        ...attributes
      ],
      ...options
    })
  }

  get isComplete() {
    return this.meta.status === "complete"
  }

  get description() {
    const { document } = this
    const { leadingElementsAfterTitle = [] } = document.nodes

    return leadingElementsAfterTitle.map(document.utils.toString).join("")
  }

  epic() {
    return this.belongsTo(Epic, {
      id: (document) => document.meta.epic
    })
  }

  get mockupLinks() {
    const { toString } = this.document.utils
    return Object.fromEntries(
      this.document
        .querySection("Mockups")
        .selectAll("link")
        .map((link) => [toString(link), link.url])
    )
  }

  get acceptanceCriteria() {
    const { toString } = this.document.utils
    return this.document
      .querySection("Acceptance Criteria")
      .selectAll("listItem")
      .map(toString)
  }
}

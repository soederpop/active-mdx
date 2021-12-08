import { Model } from "../../../index.js"

import Epic from "./Epic.js"

export default class Story extends Model {
  get defaults() {
    return {
      meta: {
        status: "created"
      }
    }
  }

  get isComplete() {
    return this.meta.status === "complete"
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

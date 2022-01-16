import { Model } from "@active-mdx/core"

export default class Standup extends Model {
  today() {
    const { toString } = this.document.utils

    return this.querySection("Yesterday").selectAll("listItem").map(toString)
  }

  yesterday() {
    const { toString } = this.document.utils

    return this.querySection("Yesterday").selectAll("listItem").map(toString)
  }

  blockers() {
    const { toString } = this.document.utils

    return this.querySection("Blockers").selectAll("listItem").map(toString)
  }
}

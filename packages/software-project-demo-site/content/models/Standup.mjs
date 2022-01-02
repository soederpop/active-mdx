import { Model } from "@active-mdx/core"

export default class Standup extends Model {
  static get schema() {
    const { joi } = this

    return joi
      .object({
        meta: joi
          .object({
            owner: joi.string().required()
          })
          .unknown(true),
        title: joi
          .string()
          .required()
          .regex(/^\d{4}-\d{2}-\d{2}\s\w+/)
      })
      .unknown(true)
  }

  toJSON(options = {}) {
    return super.toJSON({
      ...options,
      attributes: ["today", "yesterday", "blockers"].concat(
        options.attributes || []
      )
    })
  }

  today() {
    const { toString } = this.document.utils

    return this.document
      .querySection("Today")
      .selectAll("listItem")
      .map(toString)
  }

  yesterday() {
    const { toString } = this.document.utils

    return this.document
      .querySection("Yesterday")
      .selectAll("listItem")
      .map(toString)
  }

  blockers() {
    const { toString } = this.document.utils

    return this.document
      .querySection("Blockers")
      .selectAll("listItem")
      .map(toString)
  }
}

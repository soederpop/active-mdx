import { Model } from "@active-mdx/core"
import Story from "./Story.mjs"

export default class Epic extends Model {
  static sections = ["stories"]

  get defaults() {
    return {
      meta: {
        status: "created"
      }
    }
  }

  get totalEstimates() {
    return this.stories()
      .fetchAll()
      .reduce(
        (memo, story) => {
          const { high = 0, low = 0 } = story.meta?.estimates || {}

          return {
            high: memo.high + high,
            low: memo.low + low
          }
        },
        { high: 0, low: 0 }
      )
  }

  get isComplete() {
    return this.stories()
      .fetchAll()
      .every((story) => story.isComplete)
  }

  get percentComplete() {
    const stories = this.stories().fetchAll()
    return Math.ceil(
      (stories.filter((s) => s.isComplete).length / stories.length) * 100
    )
  }

  get description() {
    const { document } = this
    const { leadingElementsAfterTitle = [] } = document.nodes

    return leadingElementsAfterTitle.map(document.utils.toString).join("")
  }

  static get schema() {
    const { joi } = this

    return joi.object({
      id: joi.string().required(),
      title: joi.string().required(),
      slug: joi.string().required(),
      description: joi.string().required(),
      totalEstimates: joi.object({
        high: joi.number(),
        low: joi.number()
      }),
      isComplete: joi.boolean(),
      stories: joi.array().items(
        joi.object({
          id: joi.string(),
          title: joi.string(),
          description: joi.string(),
          meta: joi.object({
            status: joi.string(),
            estimates: {
              high: joi.number(),
              low: joi.number()
            }
          })
        })
      )
    })
  }

  toJSON({ related = [], attributes = [], ...options } = {}) {
    return super.toJSON({
      related: ["stories", ...related],
      attributes: [
        "description",
        "isComplete",
        "slug",
        "totalEstimates",
        ...attributes
      ],
      ...options
    })
  }

  stories() {
    return this.hasMany(Story, {
      heading: "stories",
      meta: () => ({ epic: this.title.toLowerCase() })
    })
  }

  static is(document) {
    return document.id.startsWith("epic")
  }
}

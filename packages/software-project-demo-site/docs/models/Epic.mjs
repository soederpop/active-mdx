import { Model } from "active-mdx"
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

import { Model } from "../../../index.js"
import Story from "./Story.js"

export default class Epic extends Model {
  static sections = ["stories"]

  static get schema() {
    const { joi } = this

    return joi
      .object({
        title: joi.string().required(),
        stories: joi
          .array()
          .items(
            joi
              .object({
                meta: joi.object({}).unknown(true).required(),
                title: joi.string().required().min(1)
              })
              .unknown(true)
          )
          .min(1)
      })
      .unknown(true)
  }

  get defaults() {
    return {
      meta: {
        status: "created"
      }
    }
  }

  get isComplete() {
    return this.stories()
      .fetchAll()
      .every((story) => story.isComplete)
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

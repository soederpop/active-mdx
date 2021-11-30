import { Model } from "../../../index.js"
import Story from "./Story.js"

export default class Epic extends Model {
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

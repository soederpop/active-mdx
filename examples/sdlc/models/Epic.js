import { Model } from "../../../src/index.js"
import Story from "./Story.js"

export default class Epic extends Model {
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

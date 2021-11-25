import { Model } from "active-md"

export default class Epic extends Model {
  static is(document) {
    return document.id.startsWith("epic")
  }
}

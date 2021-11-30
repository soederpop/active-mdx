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
}

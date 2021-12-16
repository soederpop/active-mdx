import Relationship from "./Relationship.js"

export default class BelongsToRelationship extends Relationship {
  get type() {
    return "belongsTo"
  }

  fetchAll(options = {}) {
    return this.fetch(options)
  }

  fetch(options = {}) {
    const relatedId = [
      this.TargetModelClass.prefix,
      this.options.id(this.parent)
    ].join("/")

    if (!this.parent.collection.items.has(relatedId)) {
      throw new Error(
        `Could not find ${this.TargetModelClass.name} with id ${relatedId}`
      )
    }

    return this.TargetModelClass.from(
      this.parent.collection.document(relatedId)
    )
  }
}

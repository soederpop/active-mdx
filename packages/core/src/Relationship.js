import inflect from "inflect"

export default class Relationship {
  constructor(parent, TargetModelClass, options = {}) {
    this.parent = parent
    this.TargetModelClass =
      typeof TargetModelClass === "string"
        ? this.parent.collection.model(TargetModelClass)
        : TargetModelClass

    if (typeof this.TargetModelClass !== "function") {
      throw new Error(
        `Invalid Relationship.  Could not find a Target Model Class.  You passed ${TargetModelClass}.  Is this a valid model registered with the collection?`
      )
    }
    this.options = options
  }

  get document() {
    return this.parent.document
  }

  get utils() {
    return {
      inflect
    }
  }
}

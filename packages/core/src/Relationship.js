import inflect from "inflect"

export default class Relationship {
  constructor(parent, TargetModelClass, options = {}) {
    this.parent = parent
    this.TargetModelClass = TargetModelClass
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

const privates = new WeakMap()

export default class Model {
  constructor(document) {
    privates.set(this, { document })
  }

  /**
   * Returns true if the document can be used by this model
   */
  static is(document) {
    return true
  }

  get document() {
    return privates.get(this).document
  }

  get title() {
    const { toString } = this.document.utils

    return toString(this.document.nodes.headings[0])
  }
}

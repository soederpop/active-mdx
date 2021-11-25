const privates = new WeakMap()

export default class Model {
  constructor(document, options = {}) {
    privates.set(this, { document })
  }

  /**
   * Returns true if the document can be used by this model
   */
  static is(document) {
    return !!document.ast?.children
  }

  static from(document, options = {}) {
    if (!this.is(document)) {
      throw new Error(`The document is not valid for this model.`)
    }

    new Model(document, options)
  }

  get document() {
    return privates.get(this).document
  }

  get title() {
    const { toString } = this.document.utils

    return toString(this.document.nodes.headings[0])
  }
}

const privates = new WeakMap()

/**
 * The Model class is intended to be subclassed, and is intended to represent
 * any type of Document which follows a specific structure.  The role of the Model class
 * is to turn a given document into an object whose attributes are derived from the content
 * of the document.
 */
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

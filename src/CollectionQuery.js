export default class CollectionQuery {
  constructor(opts = {}) {
    const { collection, model, options = {}, fn } = opts

    this.options = options
    this.fn = fn

    if (typeof collection?.document !== "function") {
      throw new Error("CollectionQuery requires a collection")
    }

    if (typeof model?.is !== "function") {
      throw new Error("CollectionQuery requires a model")
    }

    this.model = model
    this.collection = collection
  }

  async fetchAll() {
    const { collection } = this
    await (collection.available.length || collection.load())

    return []
  }
}

import QueryBuilder from "./QueryBuilder.js"
import { isEqual, get } from "lodash-es"

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

    const qb = new QueryBuilder()

    this.fn(qb)

    collection.available.forEach((id) => collection.document(id))

    return applyFilter(
      qb,
      Array.from(collection.documents.values()).map(
        (doc) => doc.modelClass === this.model && doc.toModel()
      )
    )
  }
}

const operators = {
  eq: isEqual,
  neq: (a, b) => !isEqual(a, b),
  in: (a, b) => b?.includes(a)
}

function applyFilter(queryBuilder, records) {
  return records.filter((record) => {
    const { conditions } = queryBuilder

    return (
      record &&
      Object.entries(conditions).every(([column, { operator, value }]) => {
        const actual = get(record, column)
        return operators[operator](actual, value)
      })
    )
  })
}

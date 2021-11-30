import lodash from "lodash"

const { castArray } = lodash

const privates = new WeakMap()

export default class QueryBuilder {
  constructor() {
    privates.set(this, {
      conditions: []
    })
  }

  get conditions() {
    return privates.get(this).conditions.reduce((memo, condition) => {
      const [column, operator, value] = condition
      memo[column] = memo[column] || {}
      memo[column] = { operator, value }
      return memo
    }, {})
  }

  where(attribute, operator, value) {
    if (typeof attribute === "object") {
      Object.entries(attribute).forEach(([key, value]) => {
        privates.get(this).conditions.push([key, "eq", value])
      })
      return this
    }

    if (typeof value === "undefined") {
      value = operator
      operator = "eq"
    }

    privates.get(this).conditions.push([attribute, operator, value])
  }

  whereIn(attribute, values) {
    privates
      .get(this)
      .conditions.push([attribute, "in", castArray(values).filter(Boolean)])
    return this
  }
}

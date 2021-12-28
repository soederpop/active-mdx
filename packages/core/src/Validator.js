export default class Validator {
  constructor({ model } = {}) {
    if (!model?.document) {
      throw new Error(`Must provide a model`)
    }

    if (!typeof model.model?.schema?.validate === "function") {
      throw new Error(`The model must define a valid JOI schema`)
    }

    this.model = model
  }

  get schema() {
    return this.model.constructor.schema
  }

  async validate(options = {}) {
    const results = await this.schema.validate(
      this.model.toJSON(options.json || {})
    )

    if (!results.error) {
      return true
    }

    if (options.throw) {
      throw results.error
    }

    const { details = [] } = results.error

    for (let error of details) {
      const { label } = error.context
      this.model.errors.set(label, error)
    }

    return false
  }
}

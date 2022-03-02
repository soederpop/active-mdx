import { Model } from "@active-mdx/core"

export default class Decision extends Model {
  get optionHeadings() {
    return this.document.querySection("Options").selectAll("heading[depth=3]")
  }

  static get schema() {
    const { joi } = this

    return joi.object({
      id: joi.string().required(),
      title: joi.string().required(),
      description: joi.string().required(),
      options: joi.array().items(joi.string()).required().min(1),
      prosAndCons: joi.array().items(
        joi.object({
          title: joi.string().required(),
          pros: joi.array().items(joi.string()),
          cons: joi.array().items(joi.string())
        })
      ),
      meta: joi
        .object({
          status: joi.string().required(),
          dueBy: joi.string().required(),
          result: joi
            .object({
              option: joi.string(),
              madeAt: joi.string(),
              approvedBy: joi.string()
            })
            .unknown(true)
        })
        .unknown(true)
    })
  }

  toJSON(options) {
    return {
      ...super.toJSON(options),
      options: this.options,
      prosAndCons: this.prosAndCons,
      description: this.description
    }
  }

  get description() {
    const { nodes } = this.document
    const { toString } = this.document.utils

    return nodes.leadingElementsAfterTitle
      .map((node) => toString(node))
      .join("\n")
  }

  get options() {
    const { toString } = this.document.utils

    return this.document
      .querySection("Options")
      .selectAll("heading[depth=3]")
      .map((heading) => toString(heading))
  }

  get prosAndCons() {
    const { toString } = this.document.utils
    const { optionHeadings = [] } = this

    return optionHeadings.reduce((memo, heading) => {
      const title = toString(heading)

      const conSubHeading = this.document
        .querySection(heading)
        .selectAll("heading[depth=4]")
        .find((heading) => toString(heading).toLowerCase() === "cons")

      const cons = this.document
        .querySection(conSubHeading)
        .selectAll("listItem")
        .map(toString)

      const proSubheading = this.document
        .querySection(heading)
        .selectAll("heading[depth=4]")
        .find((heading) => toString(heading).toLowerCase() === "pros")

      const pros = this.document
        .querySection(proSubheading)
        .selectAll("listItem")
        .map(toString)

      memo.push({
        title,
        pros,
        cons
      })

      return memo
    }, [])
  }
}

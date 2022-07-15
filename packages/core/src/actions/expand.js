import { isEmpty } from "lodash-es"

export default async function expand(model, options = {}) {
  if (validateModel(model) === false) {
    return
  }

  console.log(`Expanding ${model.constructor.name}#${model.id}`)

  const { sections = [] } = model.constructor

  for (let section of sections) {
    console.log(`- ${section}`)
    const models = await model[section]().fetchAll()

    for (let child of models) {
      await child.save()
    }
  }
}

function validateModel(model) {
  if (isEmpty(model.constructor.sections)) {
    console.log(`
      The ${model.constructor.name} class does not have a sections attribute.

      We expect the sections to be an array of strings which refer to methods on the class
      which return relationships that we can expand and turn into separate documents if necessary.

      Example:

      class Epic extends Model {
        static sections = ["stories"]

        stories() {
          return this.hasMany("Story")
        }
      }
    `)

    return false
  }
}

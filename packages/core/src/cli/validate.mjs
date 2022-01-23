export default async function validate({ collection, ...argv }) {
  let pathIds = argv._.slice(1)

  if (pathIds[0] === "all") {
    pathIds = collection.available
  }

  for (let pathId of pathIds) {
    const model = await collection.getModel(pathId)

    await model.validate()

    if (model.hasErrors) {
      console.log(`❌ ${pathId}`)
      Object.entries(model.errorMessages).forEach(([key, value]) => {
        console.log(`  - ${key} ${value.message}`)
      })
    } else {
      console.log(`✅ ${pathId}`)
    }
  }
}

export default async function exportCollection(options = {}) {
  const { collection } = options

  const json = await collection.export(options)

  console.log(JSON.stringify(json, null, 2))
}

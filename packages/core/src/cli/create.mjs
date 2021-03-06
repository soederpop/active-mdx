import { kebabCase } from "lodash-es"
import fs from "fs/promises"
import path from "path"
import inquirer from "inquirer"

export default async function create({ collection, ...argv }) {
  await collection.load()

  const wordArgs = argv._.slice(1)
  let modelName = wordArgs.join(" ")

  if (!wordArgs.length) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "modelName",
        choices: collection.modelClasses.map((c) => c.name)
      }
    ])

    modelName = answers.modelName
  }

  let ModelClass

  try {
    ModelClass = collection.model(modelName)
  } catch (error) {
    console.error(`Invalid model name specified: ${modelName}\n`)
    console.error(`Available Models:`)
    collection.modelClasses.forEach((ModelClass) => {
      console.error(`  - ${ModelClass.name}`)
    })
    console.error(
      `\nExample:\n\n  $ amdx create ${collection.modelClasses[0]?.name} --title="My Title"`
    )
    process.exit(1)
  }

  let { prefix = ModelClass.prefix, title = "" } = argv

  if (!title.length) {
    await inquirer
      .prompt([
        {
          name: "title",
          message: `Enter a title for the ${ModelClass.name}`,
          type: "input"
        }
      ])
      .then((answers) => (title = answers.title))
  }

  if (!title?.length) {
    console.log('Must supply a title via the --title="whatever you want" flag')
    process.exit(1)
  }

  const { slug = kebabCase(title) } = argv

  const fileName = `${slug}.mdx`
  const destinationPath =
    argv.dest ||
    argv.destination ||
    collection.resolve(...prefix.split("/"), fileName)

  const hasTemplate = collection.items.has(`templates/${ModelClass.name}`)

  let content = ""

  if (!hasTemplate) {
    console.warn(
      `No template found for ${ModelClass.name}. You can create one in templates/${ModelClass.name}.mdx`
    )
    content = defaultContent({ type: ModelClass.name, title })
  } else {
    const templateDoc = collection.document(`templates/${ModelClass.name}`)
    content = templateDoc.rawContent
  }

  console.log(`Creating ${destinationPath}`)

  await fs.mkdir(path.parse(destinationPath).dir, { recursive: true })

  await fs.writeFile(destinationPath, content, "utf8")

  const pathId = collection.getPathId(destinationPath)

  await collection.readItem(pathId)

  const doc = collection.document(pathId)

  doc.nodes.headingsByDepth[1][0].children[0].value = title

  await doc.save()
}

const defaultContent = ({ title, type }) =>
  `
---
type: ${type}
---

# ${title}
`.trim() + "\n"

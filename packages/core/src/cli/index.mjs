import minimist from "minimist"
import lodash from "lodash"
import runAction from "./run-action.mjs"
import exportCollection from "./export-collection.mjs"
import init from "./init.mjs"
import { Collection } from "../../index.js"
import path from "path"
import fs from "fs/promises"

const { mapKeys, omit, kebabCase, camelCase } = lodash

let processArgv = minimist(process.argv.slice(2))

export const argv = {
  ...processArgv,
  ...mapKeys(omit(processArgv, "_"), (v, k) => camelCase(kebabCase(k)))
}

export default async function main() {
  const [cmd] = argv._

  switch (cmd) {
    case "init":
      await init({
        ...argv,
        _: argv._.slice(1)
      })
      break
    case "export-collection":
      await loadCollection(argv).then((collection) =>
        exportCollection({ ...argv, collection })
      )
      break
    case "action":
    case "run":
      await loadCollection(argv).then((collection) =>
        runAction({ ...argv, collection })
      )
      break
    default:
      await displayHelp()
  }
}

async function displayHelp() {
  console.log("HELP TODO")
}

async function loadCollection(argv) {
  let { modulePath, rootPath = Collection.resolve() } = argv

  if (typeof modulePath !== "string") {
    const indexExists = await exists(path.resolve(rootPath, "index.js"))
    const indexModExists = await exists(path.resolve(rootPath, "index.mjs"))

    if (indexExists) {
      modulePath = path.resolve(rootPath, "index.js")
    } else if (indexModExists) {
      modulePath = path.resolve(rootPath, "index.mjs")
    }
  }

  const collection = modulePath
    ? await import(path.resolve(modulePath)).then((mod) => {
        return mod.collection || mod.default
      })
    : new Collection({ rootPath })

  if (modulePath && collection?.constructor?.name !== "Collection") {
    throw new Error(
      `You passed a module path. We expect this module to export a collection as the named export collection or default export.`
    )
  }

  await collection.load({ models: !modulePath })

  return collection
}

async function exists(path) {
  try {
    await fs.stat(path)
    return true
  } catch (error) {
    return false
  }
}

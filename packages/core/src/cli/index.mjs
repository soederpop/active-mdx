import minimist from "minimist"
import runAction from "./run-action.mjs"
import render from "./render.mjs"
import exportCollection from "./export-collection.mjs"
import init from "./init.mjs"
import { Collection } from "../../index.js"
import path from "path"
import fs from "fs/promises"
import { findUp } from "find-up"
import { mapKeys, omit, kebabCase, camelCase } from "lodash-es"

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
    case "render":
      await loadCollection(argv).then((collection) =>
        render({ ...argv, collection })
      )
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

async function loadCollection({
  modulePath,
  rootPath = process.cwd(),
  ...argv
} = {}) {
  if (!rootPath) {
    const cwd = process.cwd()
    const packageJsonPath = await findUp("package.json")
    const manifest = await fs
      .readFile(packageJsonPath, "utf8")
      .then((buf) => JSON.parse(String(buf)))

    if (manifest.activeMdx?.rootPath) {
      rootPath = path.resolve(cwd, manifest.activeMdx.rootPath)
    }
  }

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

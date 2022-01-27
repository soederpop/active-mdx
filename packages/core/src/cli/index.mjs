import minimist from "minimist"
import runAction from "./run-action.mjs"
import render from "./render.mjs"
import exportCollection from "./export-collection.mjs"
import init from "./init.mjs"
import validate from "./validate.mjs"
import create from "./create.mjs"
import inspect from "./inspect.mjs"
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
    case "inspect":
      await loadCollection(argv).then((collection) =>
        inspect({ ...argv, collection })
      )
      break

    case "export-collection":
      await loadCollection(argv).then((collection) =>
        exportCollection({ ...argv, collection })
      )
      break
    case "create":
    case "new":
      await loadCollection(argv).then((collection) =>
        create({ ...argv, collection })
      )
      break

    case "render":
      await loadCollection(argv).then((collection) =>
        render({ ...argv, collection })
      )
      break

    case "validate":
      await loadCollection(argv).then((collection) =>
        validate({ ...argv, collection })
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
  console.log(
    `

ActiveMDX 

Available Commands:

  - create              Create a new document for a given model
  - export-collection   Export the collection as JSON
  - inspect             View information about the collection
  - init                Create a new ActiveMDX project from a template
  - render              Render an ActiveMDX document as HTML
  - action              Run an action on a model / document, or the entire collection 
  - validate            Validate documents adhere to the model schema

Global Options:

  --root-path           The root path of the collection.  Will attempt to import index.js or index.mjs if present. 
  --module-path         The path to the collection module.  Will import this module and use the default or collection named export. 
  `.trim() + "\n\n"
  )
}

async function loadCollection({ modulePath, rootPath, ...argv } = {}) {
  if (!rootPath) {
    //console.log("Calculating Root Path")
    const cwd = process.cwd()
    const packageJsonPath = await findUp("package.json")

    const manifest = await fs
      .readFile(packageJsonPath, "utf8")
      .then((buf) => JSON.parse(String(buf)))

    if (manifest.activeMdx?.rootPath) {
      //console.log("Using package.json manifest", manifest.activeMdx)
      rootPath = path.resolve(cwd, manifest.activeMdx.rootPath)
    } else {
      rootPath = cwd
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

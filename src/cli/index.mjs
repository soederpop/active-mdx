import minimist from "minimist"
import lodash from "lodash"
import runAction from "./run-action.mjs"

const { mapKeys, omit, kebabCase, camelCase } = lodash

let processArgv = minimist(process.argv.slice(2))

export const argv = {
  ...processArgv,
  ...mapKeys(omit(processArgv, "_"), (v, k) => camelCase(kebabCase(k)))
}

export default async function main() {
  const [cmd] = argv._

  switch (cmd) {
    case "action":
    case "run":
      await runAction(argv)
      break
    default:
      await displayHelp()
  }
}

async function displayHelp() {
  console.log("HELP TODO")
}

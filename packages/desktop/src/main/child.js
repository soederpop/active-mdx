import minimist from "minimist"
import { omit, mapKeys, kebabCase, camelCase } from "lodash-es"
import { spawn } from "child_process"

const service = process.argv[2]
const options = mapKeys(minimist(process.argv.slice(3)), (v, k) =>
  k === "_" ? k : camelCase(kebabCase(k))
)

async function main() {
  switch (service) {
    case "runActiveMdxAction":
      await runActiveMdxAction({
        actionName: options._[0],
        models: options._.slice(1),
        ...options
      })
      break
    default:
      console.error("Unknown service", service)
  }
}

async function runActiveMdxAction(o = {}) {
  const { _, actionName, models, activeMdxCwd, ...options } = o

  const flags = Object.entries(options).map(
    ([k, v]) => `--${kebabCase(k)}=${v}`
  )

  const args = ["action", actionName, ...models, ...flags]

  //console.log("Spawning AMDX", { args, cwd: activeMdxCwd })

  return new Promise((res, rej) => {
    const child = spawn("amdx", args, {
      cwd: activeMdxCwd,
      stdio: "inherit"
    })

    child.on("error", rej)
    child.on("exit", res)
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

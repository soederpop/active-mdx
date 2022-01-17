import { transformSync, buildSync } from "esbuild"
import path from "path"
import { findUp } from "find-up"
import { stat, readFile, mkdir } from "fs/promises"
import md5 from "md5"

export async function compileToFile(file, options = {}) {
  const inputPath = path.resolve(file)
  const packageRoot = await findUp("package.json").then(
    (p) => path.parse(p).dir
  )
  const nodeModulesPath = path.resolve(packageRoot, "node_modules")
  const cachePath = path.resolve(
    nodeModulesPath,
    ".cache",
    "active-mdx",
    "render"
  )

  const md5Hash = await readFile(inputPath).then((buf) => md5(String(buf)))
  const { outfile = path.resolve(cachePath, `${md5Hash}.mjs`) } = options

  const outfileExists = await stat(outfile)
    .then((r) => true)
    .catch((e) => false)

  if (outfileExists) {
    return { result: outfile }
  }

  await mkdir(cachePath, { recursive: true })

  const result = buildSync({
    format: "esm",
    entryPoints: [inputPath],
    bundle: true,
    loader: {
      ".js": "jsx",
      ".mjs": "jsx"
    },
    outfile,
    ...options
  })

  return { result: outfile }
}

export function compileSync(code, options = {}) {
  const result = transformSync(code, {
    format: "esm",
    loader: "jsx",
    ...options
  })

  return result.code
}

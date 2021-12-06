import fs from "fs/promises"
import path from "path"

const templatesRoot = path.resolve(
  path.parse(import.meta.url).dir.replace("file://", ""),
  "..",
  "..",
  "templates"
)

export default async function init(options = {}) {
  const { template = "basic" } = options
  const [targetDir] = options._

  const destination = path.resolve(targetDir)
  const source = path.resolve(templatesRoot, template)

  console.log(`Initializing ${template} template in ${destination}`)
  console.log(`Template Source: ${source}`)
  const sourceFiles = await readDirectory(source)

  for (let file of sourceFiles) {
    const relativePath = path.relative(source, file)
    const destinationPath = path.join(destination, relativePath)

    console.log(`- ${targetDir}/${relativePath}`)

    await fs.mkdir(path.parse(destinationPath).dir, { recursive: true })
    await fs.copyFile(file, destinationPath)
  }
}

async function readDirectory(dirPath, match = /.*/i, recursive = true) {
  var paths = []
  var files = await fs.readdir(dirPath)
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(dirPath, files[i])
    var stat = await fs.stat(filePath)
    if (stat.isDirectory() && recursive) {
      paths = paths.concat(await readDirectory(filePath, match, recursive))
    } else {
      if (match.test(filePath)) {
        paths.push(filePath)
      }
    }
  }
  return paths
}

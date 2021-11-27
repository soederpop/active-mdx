import { Model } from "../../index.js"
import fs from "fs/promises"
import parse from "../../src/utils/parse-js.js"

export default class ApiDoc extends Model {
  static get prefix() {
    return "api"
  }

  get sourceFilePath() {
    return this.collection.constructor.resolve(
      this.collection.rootPath,
      "..",
      this.meta.path
    )
  }

  async readSourceAst() {
    const source = await fs.readFile(this.sourceFilePath, "utf8")
    const ast = await parse(source)

    return ast
  }
}

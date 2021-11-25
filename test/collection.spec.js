import { Collection } from "../src/index.js"
import path from "path"

describe("The Collection Class", function () {
  let collection
  beforeEach(function () {
    collection = new Collection({
      rootPath: path.resolve(process.cwd(), "examples", "sldc")
    })
  })

  it("has available documents", async function () {
    console.log(collection.available)
  })
})

import { Collection, Document } from "../src/index.js"

describe("The Document Class", function () {
  let collection

  beforeEach(async function () {
    collection = new Collection({
      rootPath: Collection.resolve("examples", "sdlc")
    })

    await collection.load()
  })

  it("can be created through the collection", function () {
    const index = collection.document("index")

    index.should.have.property("id", "index")
  })
})

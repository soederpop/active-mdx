import { Collection } from "../src/index.js"

describe("The Collection Class", function () {
  let collection

  beforeEach(async function () {
    collection = new Collection({
      rootPath: Collection.resolve("examples", "sdlc")
    })

    await collection.load()
  })

  it("has available documents", async function () {
    collection.available.should.include("index", "epics/authentication")
  })

  it("creates documents", async function () {
    const doc = collection.document("index")
    doc.should.have.property("title", "SDLC Demo")
  })
})

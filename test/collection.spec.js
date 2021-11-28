import { Collection } from "../index.js"

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

  it("can autoload model classes if theyre in a models folder", async function () {
    const docs = new Collection({
      rootPath: Collection.resolve("docs")
    })

    docs.modelClasses.should.be.empty

    await docs.load({ models: true })

    docs.modelClasses.should.not.be.empty
    docs.models.has("ApiDoc").should.equal(true)
  })
})

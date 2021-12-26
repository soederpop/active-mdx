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

    docs.modelClasses.should.have.property("length", 0)

    await docs.load({ models: true })

    docs.modelClasses.should.not.be.empty
    docs.models.has("ApiDoc").should.equal(true)
  })

  describe("Collection Actions", function () {
    it("can register action functions to be run on the collection", async function () {
      const docs = new Collection({
        rootPath: Collection.resolve("docs")
      })

      docs.should.have.property("actions")
      docs.should.have.property("availableActions").that.is.an("array")

      docs.action("test-action", function (c) {
        return c.rootPath
      })

      const result = await docs.runAction("test-action")
      result.should.equal(docs.rootPath)
    })
  })
})

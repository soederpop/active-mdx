import { Collection } from "../index.js"
import docs from "../../docs/content/index.js"

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

  it("has a package root", function () {
    collection.packageRoot.should.not.equal(collection.rootPath)
  })

  describe("Collection with a manifest", function () {
    it("finds the closest manifest", function () {
      docs.packageRoot.should.equal(docs.rootPath)
    })

    it("exposes the manifest", function () {
      docs.should.have
        .property("packageManifest")
        .that.is.an("object")
        .with.property("version")
    })
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

import { Collection } from "../index.js"
import Epic from "../examples/sdlc/models/Epic.js"

describe("The Document Class", function () {
  let collection

  beforeEach(async function () {
    collection = new Collection({
      rootPath: Collection.resolve("examples", "sdlc")
    })

    collection.model("Epic", Epic)

    await collection.load()
  })

  it("can be created through the collection", function () {
    const index = collection.document("index")
    index.should.have.property("id", "index")
  })

  it("can turn itself into a model", function () {
    const authEpic = collection.document("epics/authentication")
    authEpic.toModel().should.have.property("id", "epics/authentication")
    authEpic.toModel().constructor.name.should.equal("Epic")
  })
})

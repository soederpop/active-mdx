import { Collection } from "../index.js"

describe("Model Querying", function () {
  let collection

  beforeEach(async function () {
    collection = new Collection({
      rootPath: Collection.resolve("examples", "sdlc")
    })

    await collection.load({ models: true })
  })

  it("lets me query", async function () {
    const epics = await collection.query("Epic").fetchAll()
    epics.length.should.equal(2)
  })

  it("lets me query with attribute equality", async function () {
    const highPriority = await collection
      .query("Epic", (qb) => {
        qb.where("meta.priority", "high")
      })
      .fetchAll()

    highPriority.should.be.an("array").that.is.not.empty
    highPriority[0].meta.priority.should.equal("high")
  })
})

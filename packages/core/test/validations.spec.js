import { Model, Collection } from "../index.js"

describe("Model Validations", function () {
  let collection

  before(async function () {
    collection = new Collection({
      rootPath: Collection.resolve("examples", "sdlc")
    })

    await collection.load({ models: true })
  })

  it("can validate a model", async function () {
    const authEpic = collection.getModel("epics/authentication")

    await authEpic.validate()
    authEpic.should.have.property("hasErrors", false)
    authEpic.errorMessages.should.be.an("object").that.is.empty
  })

  it("sets errors on the model", async function () {
    const invalidEpic = collection.getModel("epics/invalid")

    await invalidEpic.validate()

    invalidEpic.should.have.property("hasErrors", true)
    invalidEpic.errorMessages.should.not.be.empty
    invalidEpic.errorMessages.should.have
      .property("stories")
      .that.is.an("object")
      .that.has.property("message")
  })
})

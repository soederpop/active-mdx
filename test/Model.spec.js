import { Model, Collection } from "../index.js"
import Epic from "../examples/sdlc/models/Epic.js"
import Story from "../examples/sdlc/models/Story.js"

describe("The Model Class", function () {
  let collection

  beforeEach(async function () {
    collection = new Collection({
      rootPath: Collection.resolve("examples", "sdlc")
    })

    collection.model("Epic", Epic)
    collection.model("Story", Story)

    await collection.load()
  })

  it("can be registered with the collection", function () {
    collection.model("Epic").should.equal(Epic)
  })

  it("suggests a prefix", function () {
    Epic.prefix.should.equal("epics")
  })

  it("can create instances of models from documents", function () {
    const epic = Epic.from(collection.document("epics/authentication"))
    epic.should.have.property("title", "Authentication")
  })

  describe("Relationships", function () {
    it("supports different styles of relationships", function () {
      const epic = Epic.from(collection.document("epics/authentication"))

      epic.should.have.property("hasMany").that.is.a("function")
      epic.should.have.property("belongsTo").that.is.a("function")
      epic.should.have.property("hasOne").that.is.a("function")
    })

    it("will fetch related models", function () {
      const epic = Epic.from(collection.document("epics/authentication"))
      const relationship = epic.stories()

      relationship.should.be.an("object")
      relationship.should.have.property("parent")
      relationship.should.have.property("type", "hasMany")

      const stories = epic.stories().fetchAll()
      stories.should.be.an("array").that.is.not.empty
      stories
        .map((story) => story.id)
        .should.include(
          "stories/authentication/a-user-should-be-able-to-register"
        )
    })

    it("can serialize the models", function () {
      const epic = Epic.from(collection.document("epics/authentication"))
      const json = epic.toJSON()
      json.should.have.property("id")
      json.should.have.property("meta")
    })

    it("can serialize the models and their relationships", function () {
      const epic = Epic.from(collection.document("epics/authentication"))
      const json = epic.toJSON({
        related: ["stories"]
      })

      json.should.have.property("stories").that.is.an("array").that.is.not.empty
      json.stories
        .map((story) => story.id)
        .should.include(
          "stories/authentication/a-user-should-be-able-to-register"
        )
    })
  })

  describe("Inflections", function () {
    it("provides inflections for the model based on the class name", function () {
      Epic.should.have.property("inflections")
      Epic.inflections.should.have.property("plural", "epics")
      Epic.inflections.should.have.property("singular", "epic")
    })
  })
})

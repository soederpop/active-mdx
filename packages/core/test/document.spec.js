import { Document, Collection } from "../index.js"
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

  it("can append to a sections content by passing markdown", function () {
    const index = collection.document("index")
    const customerHeading = index.astQuery.findHeadingByText("Customer", false)
    expect(customerHeading).to.be.an("object")

    index.appendToSection(customerHeading, "This is a test").reloadFromAST()

    const customerSection = index.extractSection(customerHeading)
    const lastNode = customerSection[customerSection.length - 1]

    expect(lastNode).to.be.an("object").with.property("type", "paragraph")

    lastNode.children.should.not.be.empty
    lastNode.children[0].should.have.property("value", "This is a test")

    index
      .appendToSection(
        "Customer",
        "[This is another test](link)\nAnd another one"
      )
      .reloadFromAST()

    index.nodes.last.should.have.property("type", "paragraph")
    index.nodes.last.children[0].should.have.property("type", "link")
  })

  it("can replace a sections content with new markdown", function () {
    const index = collection.document("index")
    index.replaceSectionContent("Customer", "Brand New Content").reloadFromAST()
    index.content.should.match(/Brand New Content/)
  })

  it("can insert content before a node", function () {
    const index = collection.document("index")
    const customerHeading = index.astQuery.findHeadingByText("Customer", false)
    index
      .insertBefore(customerHeading, "[BEFORE_CUSTOMER](link)")
      .reloadFromAST()

    index.content.should.match(/BEFORE_CUSTOMER.*\n\n\#\#\#\ Customer/)
  })

  it("can insert content before a node", function () {
    const index = collection.document("index")
    const customerHeading = index.astQuery.findHeadingByText("Customer", false)
    index.insertAfter(customerHeading, "[AFTER_CUSTOMER](link)").reloadFromAST()

    index.content.should.match(/Customer\n\n\[AFTER/)
  })
})

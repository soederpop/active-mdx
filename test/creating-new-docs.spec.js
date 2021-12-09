import { collection } from "../examples/sdlc/index.js"
import fs from "fs/promises"

describe("Creating new documents from existing documents", function () {
  before(async function () {
    await fs
      .rm(collection.resolve("stories", "searching-and-browsing"), {
        recursive: true
      })
      .catch((e) => {})
    await collection.load()
  })

  after(async function () {
    return true
    await fs
      .rm(collection.resolve("stories", "searching-and-browsing"), {
        recursive: true
      })
      .catch((e) => {})
  })

  it("can create documents from a relationship", async function () {
    const search = collection.getModel("epics/searching-and-browsing")

    const stories = await search.stories().fetchAll()

    stories.should.be.an("array").that.is.not.empty
    stories[0].title.should.equal("Searching for a product by category")
  })

  it("can save documents from a relationship if they dont yet exist", async function () {
    const search = collection.getModel("epics/searching-and-browsing")
    const existsAtFirst = await fs
      .stat(
        collection.resolve(
          "stories/searching-and-browsing/searching-for-a-product-by-category.mdx"
        )
      )
      .catch((e) => false)

    existsAtFirst.should.equal(false)
    const stories = await search.stories().create()
    const existsNow = await fs
      .stat(
        collection.resolve(
          "stories/searching-and-browsing/searching-for-a-product-by-category.mdx"
        )
      )
      .catch((e) => false)
    existsNow.should.equal(true)
  })
})

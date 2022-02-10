import docs from "../../software-project-demo-site/docs/index.mjs"
import sheets from "../index.js"
import fs from "fs"
import path from "path"

describe("Example Integration", function () {
  const serviceAccount = JSON.parse(
    fs
      .readFileSync(path.join(process.cwd(), "secrets", "serviceAccount.json"))
      .toString()
  )

  it("creates the sheets api on the collection", function () {
    docs.use(sheets, { serviceAccount })
    docs.should.have.property("sheets")
  })

  it("creates an action for exporting the collection to google sheets", function () {
    docs.availableActions.should.include("sheets:export")
  })

  it("can provide access to a google spreadsheeet", async function () {
    const sheet = await docs.sheets.sheet("example", {
      sheetId: "14A3bW57s7QLl6zQXw4-lre9gpQvSzVsq9tzYyf9g9Zo"
    })

    sheet.should.be
      .an("object")
      .that.has.property("initialize")
      .that.is.a("function")
  })
})

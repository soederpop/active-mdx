import docs from "../../software-project-demo-site/docs/index.mjs"
import graphQlPlugin from "../index.js"

describe("Example Integration", function () {
  it("creates functions on the models", function () {
    docs.use(graphQlPlugin, {})
    docs
      .model("Epic")
      .should.have.property("toGraphqlType")
      .that.is.a("function")
  })
})

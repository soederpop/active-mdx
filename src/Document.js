import lodash from "lodash"
import { toString } from "mdast-util-to-string"
import { createMdxAstCompiler } from "@mdx-js/mdx"
import AstQuery from "./AstQuery"
import NodeShortcuts from "./NodeShortcuts"

const { omit } = lodash

const privates = new WeakMap()

export default class Document {
  constructor({ meta, content, path, id, collection } = {}) {
    privates.set(this, {
      content,
      path,
      meta,
      id,
      collection
    })
  }

  get id() {
    return privates.get(this).id
  }

  /**
   * Serialize this document as JSON
   */
  toJSON() {
    const { meta, ast, content, id } = this

    return { meta, ast, content, id }
  }

  get astQuery() {
    const { ast } = this
    return new AstQuery(ast)
  }

  get nodes() {
    const { astQuery } = this
    return new NodeShortcuts(astQuery)
  }

  get utils() {
    return {
      toString
    }
  }

  get meta() {
    return privates.get(this).meta
  }

  get content() {
    return privates.get(this).content
  }

  get processor() {
    return createMdxAstCompiler({
      remarkPlugins: [],
      rehypePlugins: []
    })
  }

  get ast() {
    const { content } = this.attributes
    return this.processor.parse(content)
  }

  get attributes() {
    return omit(privates.get(this), "ast", "collection")
  }

  get collection() {
    return privates.get(this).collection
  }

  get linkedDocuments() {
    const { links = [] } = this.nodes
    const { available = [] } = this.collection

    return links
      .filter(({ url }) => available.indexOf(url) !== -1)
      .map(({ url }) => this.collection.document(url))
  }
}

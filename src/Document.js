import lodash from "lodash"
import { toString } from "mdast-util-to-string"
import { createMdxAstCompiler, sync } from "@mdx-js/mdx"
import AstQuery from "./AstQuery.js"
import Model from "./Model.js"
import NodeShortcuts from "./NodeShortcuts.js"
import stringify from "mdx-stringify"
import yaml from "js-yaml"
import gfm from "remark-gfm"

const { isEmpty, omit, minBy } = lodash

const privates = new WeakMap()

/**
 * The Document class represents an mdx file.  An instance of a document provides
 * access to the mdx ast and provides methods for querying and manipulating the ast,
 * and convert it back to mdx code.
 *
 * You will rarely need to create a Document instance yourself.  Instead this should be done by the collection.
 */
export default class Document {
  /**
   * @param {Object} attributes
   * @param {String} content the content of the mdx document, minus yaml frontmatter which should be separated from the Collection's load method using the gray-matter module
   * @param {String} path the path of the document's underlying file.  Will be passed by the collection.
   * @param {Collection} collection the collection this document belongs to
   * @param {MDAst} ast the ast of the document.
   */
  constructor({ meta = {}, content, path, id, collection, ast } = {}) {
    privates.set(this, {
      content,
      path,
      meta,
      id,
      collection,
      ast
    })
  }

  /**
   * Tells the collection this document belongs to to save its content to disk.  It will use Document#rawContent which will serialize the yaml frontmatter and prepend it to the MDX code from the current AST.
   *
   * @param {Object} options options to pass to Collection#saveItem
   */
  async save(options = {}) {
    const { collection } = this
    await collection.saveItem(this.id, { content: this.rawContent, ...options })
    return this
  }

  /**
   * Returns the raw content of the document, including yaml frontmatter.
   *
   * @readonly
   * @memberof Document
   */
  get rawContent() {
    const { meta } = this

    if (isEmpty(meta)) {
      return this.content
    } else {
      const frontmatter = yaml.dump(meta)
      return ["---", `${frontmatter}---`, this.content].join("\n")
    }
  }

  /**
   * Returns the document's id.  The ID will be the relative path to collection.rootPath, minus the file extension.
   *
   * @readonly
   * @memberof Document
   */
  get id() {
    return privates.get(this).id
  }

  get modelClass() {
    let ModelClass

    if (this.meta.type) {
      ModelClass =
        this.collection.models.get(this.meta.type)?.ModelClass ||
        this.collection.modelClasses.find(
          (modelClass) =>
            modelClass.prefix === type ||
            Object.values(modelClass.inflections).indexOf(type) !== -1
        )
    } else {
      ModelClass = this.collection.modelClasses.find((modelClass) =>
        this.id.startsWith(modelClass.prefix)
      )
    }

    if (!ModelClass) {
      ModelClass = Model
    }

    return ModelClass
  }

  /**
   * Convert this document to a Model.  You can either pass the model class as an option,
   * or we will attempt to determine the model class by using the Model.prefix and matching it
   * against the beginning of the document's id.
   *
   * @param {Object} options
   * @param {Model} options.model the model class to use
   * @returns {Model} an instance of the model class for this document
   */
  toModel(options = {}) {
    const { modelClass = this.modelClass } = options
    return modelClass.from(this, options)
  }

  /**
   * Returns the document title.  The title will be the string contents of the first heading in the document,
   * otherwise it will be the id of the document.
   *
   * @readonly
   * @memberof Document
   */
  get title() {
    const headingNode = this.astQuery.select("heading")

    if (headingNode) {
      return this.utils.toString(headingNode)
    } else {
      return this.id
    }
  }

  /**
   * Serialize this document as JSON.
   *
   * @returns {Object}
   */
  toJSON() {
    const { meta, ast, content, id } = this

    return { meta, ast, content, id }
  }

  /**
   * Returns an instance of AstQuery which provides helpers
   * for querying the AST nodes in this document.
   *
   * @returns {AstQuery}
   */
  get astQuery() {
    const { ast } = this
    return new AstQuery(ast)
  }

  /**
   * Creates a new instance of the ASTQuery class for a given AST.
   *
   * @param {MDAst} ast the ast, defaults to this document's AST
   * @returns {AstQuery}
   */
  query(ast = this.ast) {
    return new AstQuery(ast)
  }

  /**
   * Returns an instance of NodeShortcuts which provides getters
   * for common queries for our nodes.
   *
   * @returns {NodeShortcuts}
   */
  get nodes() {
    const { astQuery } = this
    return new NodeShortcuts(astQuery)
  }

  /**
   * Extract a section of the document, starting with a heading.  This will return all of the nodes
   * which are underneath a given heading.  It will stop searching when it encounters another heading
   * of the same depth, or the end of the document.
   *
   * @param {ASTNode} startHeading the heading to start the section with
   * @returns {Array[ASTNode]}
   */
  extractSection(startHeading) {
    return extractSection(this, startHeading)
  }

  /**
   * Provides access to common utility functions for working with ASTs and nodes.
   *
   * @type {Object}
   * @readonly
   * @memberof Document
   */
  get utils() {
    return {
      toString,
      stringifyAst,
      extractSection: (startHeading) => extractSection(this, startHeading),
      createNewAst: (children = []) => ({
        type: "root",
        children
      }),
      normalizeHeadings: (ast) => normalizeHeadings(ast),
      parseTable: (tableNode) => parseTable(tableNode)
    }
  }

  /**
   * Gets the YAML frontmatter of this document as a JavaScript object.
   *
   * @type {Object}
   * @readonly
   * @memberof Document
   */
  get meta() {
    return privates.get(this).meta
  }

  /**
   * Gets the MDX code content of this document, either by using the file's contents that was passed
   * from the collection, or by stringifying the AST in its current state.
   */
  get content() {
    if (privates.get(this).content) {
      return privates.get(this).content
    }

    const { ast } = this
    const content = stringifyAst(ast)

    privates.get(this).content = content

    return content
  }

  /**
   * Removes the nodes under the given heading from the AST.
   */
  removeSection(startHeading) {
    if (typeof startHeading === "string") {
      startHeading = this.astQuery.findHeadingByText(startHeading)
    }

    const sectionNodes = this.extractSection(startHeading)

    this.ast.children = this.ast.children.filter((node) => {
      return !sectionNodes.includes(node)
    })

    return sectionNodes
  }

  replaceSectionContent(startHeading, nodesOrMarkdown = []) {
    if (typeof startHeading === "string") {
      startHeading = this.astQuery.findHeadingByText(startHeading)
    }

    if (typeof nodesOrMarkdown === "string") {
      nodesOrMarkdown = this.processor.parse(nodesOrMarkdown).children
    }

    const sectionNodes = this.extractSection(startHeading).slice(1)
    const headingIndex = this.ast.children.indexOf(startHeading)

    this.ast.children.splice(
      headingIndex + 1,
      sectionNodes.length,
      ...nodesOrMarkdown
    )

    return this
  }

  insertBefore(node, nodesOrMarkdown = []) {
    if (typeof nodesOrMarkdown === "string") {
      nodesOrMarkdown = this.processor.parse(nodesOrMarkdown).children
    }
    const index = this.ast.children.indexOf(node)
    this.ast.children.splice(index, 0, ...nodesOrMarkdown)
    return this
  }

  insertAfter(node, nodesOrMarkdown = []) {
    if (typeof nodesOrMarkdown === "string") {
      nodesOrMarkdown = this.processor.parse(nodesOrMarkdown).children
    }
    const index = this.ast.children.indexOf(node)
    this.ast.children.splice(index + 1, 0, ...nodesOrMarkdown)
    return this
  }

  appendToSection(startHeading, nodesOrMarkdown = []) {
    if (typeof startHeading === "string") {
      startHeading = this.astQuery.findHeadingByText(startHeading)
    }

    if (typeof nodesOrMarkdown === "string") {
      nodesOrMarkdown = this.processor.parse(nodesOrMarkdown).children
    }

    const sectionNodes = this.extractSection(startHeading)

    const lastIndex = this.ast.children.indexOf(
      sectionNodes[sectionNodes.length - 1]
    )
    this.ast.children.splice(lastIndex + 1, 0, ...nodesOrMarkdown)

    return this
  }

  replaceContent(content) {
    privates.get(this).content = content
    privates.get(this).ast = this.processor.parse(content)
    return this
  }

  appendContent(content) {
    privates.get(this).content += content
    privates.get(this).ast = this.processor.parse(content)
    return this
  }

  rerenderAST(newContent = this.content) {
    privates.get(this).ast = this.processor.parse(newContent)
    return this
  }

  reloadFromAST(newAst = this.ast) {
    const code = stringifyAst(newAst)
    privates.get(this).content = code
    privates.get(this).ast = newAst

    return this
  }

  /**
   * Converts an AST into MDX code.
   *
   * @param {MDAst} [ast=this.ast] the AST to convert
   */
  stringify(ast = this.ast) {
    return stringifyAst(ast)
  }

  compile() {
    return sync(this.content, {
      remarkPlugins: [gfm]
    })
  }

  /**
   * Provides access to the MDX AST compiler
   */
  get processor() {
    return createMdxAstCompiler({
      remarkPlugins: [gfm],
      rehypePlugins: []
    })
  }

  /**
   * Gets the MDAST for this document.  If the document was created with one,
   * it will use that. Otherwise it will use Document#processor to compile the MDX code into
   * a crawlable AST.
   *
   * @readonly
   * @memberOf Document
   * @type {MDAst}
   */
  get ast() {
    if (privates.get(this).ast) {
      return privates.get(this).ast
    }

    const { content } = this.attributes
    const ast = this.processor.parse(content)

    privates.get(this).ast = ast

    return ast
  }

  /**
   * Provides access to the unique parts of this document.
   *
   * @readonly
   * @memberof Document
   */
  get attributes() {
    return {
      ...omit(privates.get(this), "ast", "collection", "meta"),
      collectionName: this.collection.name
    }
  }

  /**
   * Returns the collection this document belongs to.
   *
   * @type {Collection}
   * @readonly
   * @memberof Document
   */
  get collection() {
    return privates.get(this).collection
  }

  /**
   * Returns any documents which are in the collection, and linked via an href attribute.
   */
  get linkedDocuments() {
    const { links = [] } = this.nodes
    const { available = [] } = this.collection

    return links
      .filter(({ url }) => available.indexOf(url) !== -1)
      .map(({ url }) => this.collection.document(url))
  }
}

export function extractSection(doc, startHeading) {
  const endHeading = doc.astQuery.findNextSiblingHeadingTo(startHeading)

  const sectionNodes = endHeading
    ? doc.astQuery.findBetween(startHeading, endHeading)
    : doc.astQuery.findAllAfter(startHeading)

  return [startHeading, ...sectionNodes]
}

export function stringifyAst(ast) {
  return createMdxAstCompiler({
    remarkPlugins: [],
    rehypePlugins: []
  })
    .use(stringify)
    .stringify(ast)
}

export function normalizeHeadings(ast) {
  const query = new AstQuery(ast)
  const headings = query.selectAll("heading")
  const minDepth = minBy(headings, "depth").depth
  const diff = 1 - minDepth
  headings.forEach((heading) => (heading.depth = heading.depth + diff))

  return ast
}

export function parseTable(tableNode) {
  const tableRows = tableNode.children.filter(
    (node) => node.type === "tableRow"
  )
  const [headings, ...rows] = tableRows

  const headingsText = headings.children.map(toString)

  return rows.reduce((memo, row) => {
    memo.push(
      Object.fromEntries(
        row.children.map((cell, index) => [headingsText[index], toString(cell)])
      )
    )
    return memo
  }, [])
}

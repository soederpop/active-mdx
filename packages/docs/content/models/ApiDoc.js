import { Model } from "@active-mdx/core"
import fs from "fs"
import parse from "@active-mdx/core/src/utils/parse-js.js"
import traverse from "@babel/traverse"
import docBlockParser from "docblock-parser"
import {
  flatten,
  isEmpty,
  isNull,
  get,
  mapValues,
  isFunction,
  castArray
} from "lodash-es"

const privates = new WeakMap()

export default class ApiDoc extends Model {
  constructor(...args) {
    super(...args)
    privates.set(this, {})
  }

  static get prefix() {
    return "api"
  }

  get sourceFilePath() {
    return this.collection.constructor.resolve(
      this.collection.rootPath,
      "..",
      this.meta.path
    )
  }

  get sourceAst() {
    return this.readSourceAst()
  }

  get utils() {
    return {
      parseDocBlock: (content, options = {}) => {
        return docBlockParser({
          ...options,
          test: docBlockParser.multiLineTilTag,
          tags: {
            //param: docBlockParser.multiParameterTag,
            ...options.tags
          }
        }).parse(content)
      }
    }
  }

  findNodes(options = {}) {
    if (typeof options === "string") {
      options = { type: options }
    }

    if (isFunction(options)) {
      options = { filter: options }
    }

    const { filter, type, ast = this.sourceAst } = options

    const matches = []

    traverse.default(ast, {
      enter(path) {
        if (isFunction(filter)) {
          filter(path) && matches.push(path)
          return
        }

        if (typeof type === "string" && path.node && path.node.type === type) {
          matches.push(path)
        }
      }
    })

    return matches
  }

  get body() {
    return this.sourceAst?.program?.body || []
  }

  get exportDeclarations() {
    return this.body
      .map((node, index) =>
        node.type === "ExportDeclaration" ||
        node.type === "ExportDefaultDeclaration" ||
        node.type === "ExportNamedDeclaration"
          ? { node, index }
          : undefined
      )
      .filter(Boolean)
  }

  get exportNames() {
    return this.exportData.map((i) => i.name)
  }

  get exportData() {
    const { exportDeclarations = [] } = this

    const names = exportDeclarations.map((item, i) => {
      const { node, index } = item
      switch (node.type) {
        case "ExportDefaultDeclaration":
          return {
            name: "default",
            index,
            exportName: get(node, "declaration.id.name"),
            start: get(node, "declaration.loc.start.line"),
            end: get(node, "declaration.loc.end.line")
          }
        case "ExportNamedDeclaration":
          if (isNull(node.declaration) && !isEmpty(node.specifiers)) {
            return node.specifiers
              .filter((specifier) => specifier.type === "ExportSpecifier")
              .map((specifier) => ({
                index,
                name: get(specifier, "exported.name"),
                start: get(specifier, "loc.start.line"),
                end: get(specifier, "loc.end.line")
              }))
          } else if (
            !isNull(node.declaration) &&
            !isEmpty(node.declaration.declarations)
          ) {
            const entry = {
              name: get(node, "declaration.declarations[0].id.name"),
              start: get(node, "loc.start.line"),
              end: get(node, "loc.end.line"),
              index
            }

            return entry
          } else if (
            !isNull(node.declaration) &&
            node.declaration.type === "FunctionDeclaration"
          ) {
            return {
              name: get(node, "declaration.id.name"),
              start: get(node, "declaration.loc.start.line"),
              end: get(node, "declaration.loc.end.line"),
              index
            }
          } else {
            return { index, node }
          }
        default:
          return undefined
      }
    })

    return flatten(names).filter(Boolean)
  }

  convertDocBlock(title, docBlock = {}, options = {}) {
    const { text = "", tags = {} } = docBlock
    const { param = [] } = tags

    const header = [`\n#### ${title}\n`, text]

    const body = castArray(param)
      .filter(Boolean)
      .map((param) => {
        const [name, type, ...description] = param.trim().split(" ")
        return `- \`${name} ${type}\` ${description.join(" ")}`
      })

    if (tags.return || tags.returns) {
      body.push(`\nReturns \`${tags.return || tags.returns}\``)
    } else if (tags.type) {
      body.push(`\nType \`${tags.type}\``)
    }

    return header
      .concat(body)
      .filter((i) => i && i.length)
      .join("\n")
      .trim()
  }

  getDocBlocks(propertyType) {
    return mapValues(
      Object.fromEntries(
        this[propertyType].map((node) => {
          return [
            node.node?.key?.name,
            node.node?.leadingComments?.map((v) => v.value).join("\n") ||
              "/** */"
          ]
        })
      ),
      (v, k) => ({
        ...this.utils.parseDocBlock(v),
        markdown: this.convertDocBlock(k, this.utils.parseDocBlock(v)) + "\n"
      })
    )
  }

  get classInstanceMethodNames() {
    return this.classInstanceMethods.map(({ node }) => node.key.name)
  }

  get classGetterNames() {
    return this.classGetters.map(({ node }) => node.key.name)
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get classDeclarations() {
    return this.findNodes({ type: "ClassDeclaration" })
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get classInstanceMethods() {
    return this.findNodes({
      filter: ({ node }) =>
        node.type === "ClassMethod" && node.kind === "method" && !node.static
    })
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get classGetters() {
    return this.findNodes({
      filter: ({ node }) =>
        node.type === "ClassMethod" && node.kind === "get" && !node.static
    })
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get staticClassMethods() {
    return this.findNodes({
      filter: ({ node }) =>
        node.type === "ClassMethod" && node.kind === "method" && node.static
    })
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get staticClassGetters() {
    return this.findNodes({
      filter: ({ node }) =>
        node.type === "ClassMethod" && node.kind === "get" && node.static
    })
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get classProperties() {
    return this.findNodes({
      filter: ({ node }) => node.type === "ClassProperty" && !node.static
    })
  }

  /**
   *
   * @type {Array<ASTPath>}
   */
  get staticClassProperties() {
    return this.findNodes({
      filter: ({ node }) => node.type === "ClassProperty" && node.static
    })
  }

  readSourceAst() {
    if (privates.get(this).ast) return privates.get(this).ast

    const source = fs.readFileSync(this.sourceFilePath, "utf8")
    const ast = parse(source)

    privates.get(this).ast = ast

    return ast
  }
}

ApiDoc.action("sync-with-code", async function generateOutline(model) {
  const classMethods = model.classInstanceMethods
  const classGetters = model.classGetters
  const staticMethods = model.staticClassMethods
  const staticGetters = model.staticClassGetters

  const body = ["## API\n"]

  const apiHeading = model.document.astQuery.findHeadingByText("api")

  if (apiHeading) {
    model.document.removeSection(apiHeading)
    model.document.replaceContent(model.document.stringify())
    await model.save()
  }

  if (!isEmpty(classMethods)) {
    body.push("### Instance Methods\n\n")
    body.push(
      ...Object.values(model.getDocBlocks("classInstanceMethods")).map(
        (m) => m.markdown
      )
    )
    body.push("\n")
  }

  if (!isEmpty(classGetters)) {
    body.push("### Instance Properties\n\n")
    body.push(
      ...Object.values(model.getDocBlocks("classGetters")).map(
        (m) => m.markdown
      )
    )
    body.push("\n")
  }

  if (!isEmpty(staticMethods)) {
    body.push("### Static / Class Methods\n\n")
    body.push(
      ...Object.values(model.getDocBlocks("staticClassMethods")).map(
        (m) => m.markdown
      )
    )
    body.push("\n")
  }

  if (!isEmpty(staticGetters)) {
    body.push("### Static / Class Properties\n\n")
    body.push(
      ...Object.values(model.getDocBlocks("staticClassGetters")).map(
        (m) => m.markdown
      )
    )
    body.push("\n")
  }

  const apiDocsContent = body.join("\n")

  model.document.appendContent(`\n${apiDocsContent}`)
  await model.save()
})

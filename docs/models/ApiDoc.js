import { Model } from "../../index.js"
import fs from "fs"
import parse from "../../src/utils/parse-js.js"
import lodash from "lodash"
import traverse from "@babel/traverse"
import docBlockParser from "docblock-parser"

const { mapValues, isFunction } = lodash

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

  /**
   * Returns a parsed docblock for each of the static methods, getters, and properties
   */
  get staticDocBlocks() {
    return mapValues(
      Object.fromEntries(
        [
          ...this.staticInstanceMethods,
          ...this.staticGetters,
          ...this.staticProperties
        ].map((node) => {
          return [
            node.node?.key?.name,
            node.node?.leadingComments?.map((v) => v.value).join("\n") ||
              "/** */"
          ]
        })
      ),
      (v = "") => this.utils.parseDocBlock(v)
    )
  }

  get instanceDocBlocks() {
    return mapValues(
      Object.fromEntries(
        [
          ...this.classInstanceMethods,
          ...this.classGetters,
          ...this.classProperties
        ].map((node) => {
          return [
            node.node?.key?.name,
            node.node?.leadingComments?.map((v) => v.value).join("\n") ||
              "/** */"
          ]
        })
      ),
      (v = "") => this.utils.parseDocBlock(v)
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

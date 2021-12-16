import { visit } from "unist-util-visit"
import matter from "gray-matter"
import stringifyObject from "stringify-object"

export const captureMeta = () => (tree) => {
  visit(tree, (node) => {
    if (node.type === "code" && node.lang && node.lang.match(/\w+\s.*/)) {
      const parts = node.lang.split(" ")[0]
      node.lang = parts[0]
      node.meta = parts.slice(1).join(" ")
    }
  })

  return tree
}

export const syncCodeBlocks = () => (tree) => {
  tree.children.forEach((child) => {
    if (
      child.type === "element" &&
      child.tagName === "pre" &&
      child.children &&
      child.children[0].tagName === "code"
    ) {
      const { properties = {} } = child
      const code = child.children[0]
      code.properties = Object.assign(code.properties, properties)
    }
  })
}

export function remarkMarkAndUnravel() {
  return (tree) => {
    visit(tree, (node, index, parent_) => {
      const parent = /** @type {Parent} */ (parent_)
      let offset = -1
      let all = true
      /** @type {boolean|undefined} */
      let oneOrMore

      if (parent && typeof index === "number" && node.type === "paragraph") {
        const children = node.children

        while (++offset < children.length) {
          const child = children[offset]

          if (
            child.type === "mdxJsxTextElement" ||
            child.type === "mdxTextExpression"
          ) {
            oneOrMore = true
          } else if (
            child.type === "text" &&
            /^[\t\r\n ]+$/.test(String(child.value))
          ) {
            // Empty.
          } else {
            all = false
            break
          }
        }

        if (all && oneOrMore) {
          offset = -1

          while (++offset < children.length) {
            const child = children[offset]

            if (child.type === "mdxJsxTextElement") {
              // @ts-expect-error: content model is fine.
              child.type = "mdxJsxFlowElement"
            }

            if (child.type === "mdxTextExpression") {
              // @ts-expect-error: content model is fine.
              child.type = "mdxFlowExpression"
            }
          }

          parent.children.splice(index, 1, ...children)
          return index
        }
      }

      if (
        node.type === "mdxJsxFlowElement" ||
        node.type === "mdxJsxTextElement"
      ) {
        const data = node.data || (node.data = {})
        data._mdxExplicitJsx = true
      }
    })
  }
}

export const removeFrontMatter = () => (tree, file) => {
  const { data } = matter(file.contents)

  // Step 2: Remove frontmatter after converting it into JS object
  if (tree.children[0].type === "thematicBreak") {
    const firstHeadingIndex = tree.children.findIndex(
      (t) => t.type === "heading"
    )
    if (firstHeadingIndex !== -1) {
      tree.children.splice(0, firstHeadingIndex + 1)
    }
  }

  // Step 1: Convert frontmatter to JS object and push to document tree
  tree.children.push({
    type: "export",
    value: `
    export const frontMatter = ${stringifyObject(data)}
    `
  })
}

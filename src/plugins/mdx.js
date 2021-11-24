import { visit } from "unist-util-visit"

export const captureMeta = () => (tree) => {
  throw new Error("Not implemented")
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
  throw new Error("Not implemented")
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

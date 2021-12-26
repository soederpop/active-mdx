import matter from "gray-matter"
import stringifyObject from "stringify-object"

const plugin = () => (tree, file) => {
  const { content, data } = matter(file.contents)

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

export default plugin

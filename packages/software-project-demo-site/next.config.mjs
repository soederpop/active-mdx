import { removeFrontMatter } from "@active-mdx/core/src/plugins/mdx.js"
import nextMdx from "@next/mdx"
import gfm from "remark-gfm"
import { visit } from "unist-util-visit"
import rehypeSlug from "rehype-slug"
import { findBefore } from "unist-util-find-before"

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // removes yaml frontmatter from rendered react output
      removeFrontMatter,
      // add support for github flavored markdown
      gfm,
      // use code block meta content as props
      rehypeMetaAsAttributes
    ],
    rehypePlugins: [rehypeSlug, rehypeTagParentHeadings]
  }
})

export default withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx"],
  webpack: (config, { isServer }) => {
    // Fixes npm packages (mdx) that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.externals.push("active-mdx", "active-mdx/src/Collection.js")
    }

    return config
  }
})

function rehypeTagParentHeadings({
  headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"]
} = {}) {
  return (tree) => {
    visit(tree, "element", (node) => {
      try {
        const heading = findBefore(
          tree,
          node,
          (node) => headingTags.indexOf(node.tagName) > -1
        )

        if (heading) {
          node.properties["data-parent"] = heading.properties.id
        }
      } catch (error) {}
    })
  }
}

function rehypeMetaAsAttributes() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "code" && node.data && node.data.meta) {
        node.properties.meta = node.data.meta
      }
    })
  }
}

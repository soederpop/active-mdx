import { removeFrontMatter } from "active-mdx/src/plugins/mdx.js"
import nextMdx from "@next/mdx"
import gfm from "remark-gfm"
import visit from "unist-util-visit"
import rehypeSlug from "rehype-slug"

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
    rehypePlugins: [rehypeSlug]
  }
})

export default withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx"],
  webpack: (config, { isServer }) => {
    // Fixes npm packages (mdx) that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.externals.push("active-mdx")
    }

    return config
  }
})

function rehypeMetaAsAttributes() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "code" && node.data && node.data.meta) {
        node.properties.meta = node.data.meta
      }
    })
  }
}

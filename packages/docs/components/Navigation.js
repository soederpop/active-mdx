import React from "react"
import TableOfContents from "content/table-of-contents.mdx"
import MdxWrapper from "./MdxWrapper"
import DocLink from "./DocLink"
import Link from "next/link"
import { Menu } from "semantic-ui-react"
import { useLayout } from "./MainLayout"

export default function Navigation(props = {}) {
  const { toggleSidebar } = useLayout()

  const customComponents = {
    ul: (props) => <Menu.Menu {...props} />,
    li: (props) => <Menu.Item {...props} />,
    a: (props) => {
      return (
        <DocLink {...props} absolute onClick={() => toggleSidebar(false)} />
      )
    },
    h4: (props) => {
      return (
        <Menu.Item
          header
          onClick={() => {
            toggleSidebar(false)
          }}
          {...props}
          style={{ margin: 0, padding: 0, color: "white" }}
        />
      )
    },
    h1: () => {
      return (
        <Menu.Item header onClick={() => toggleSidebar(false)}>
          <Link href="/" passHref>
            <h3>ActiveMDX Docs</h3>
          </Link>
        </Menu.Item>
      )
    }
  }

  return (
    <MdxWrapper components={customComponents}>
      <TableOfContents />
    </MdxWrapper>
  )
}

import React from "react"
import TableOfContents from "docs/table-of-contents.mdx"
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
    h2: (props = {}) => {
      return (
        <Menu.Item>
          <h3>{props.children}</h3>
        </Menu.Item>
      )
    },
    h1: () => {
      return (
        <Menu.Item onClick={() => toggleSidebar(false)}>
          <Link href="/" passHref>
            <h3>Software Project</h3>
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

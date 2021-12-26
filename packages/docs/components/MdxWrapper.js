import { MDXProvider } from "@mdx-js/react"
import DocLink from "components/DocLink"
import CodeBlock from "components/CodeBlock"

export default function MdxWrapper({ children, components = {} }) {
  return (
    <MDXProvider
      components={{
        ...baseComponents,
        ...components
      }}
    >
      <div className="mdx-document">{children}</div>
    </MDXProvider>
  )
}

export const baseComponents = {
  h1: Header1,
  h2: Header2,
  h3: Header3,
  h4: Header4,
  h5: Header5,
  h6: Header6,
  a: DocLink,
  code: CodeBlock
}

function Header1(props = {}) {
  return (
    <>
      {props.id && <a name={props.id} />}
      <h1
        {...props}
        onClick={() => {
          window.location.hash = props.id
        }}
      />
    </>
  )
}

function Header2(props = {}) {
  return (
    <>
      {props.id && <a name={props.id} />}
      <h2
        {...props}
        onClick={() => {
          window.location.hash = props.id
        }}
      />
    </>
  )
}

function Header3(props = {}) {
  return (
    <>
      {props.id && <a name={props.id} />}
      <h3
        {...props}
        onClick={() => {
          window.location.hash = props.id
        }}
      />
    </>
  )
}

function Header4(props = {}) {
  return (
    <>
      {props.id && <a name={props.id} />}
      <h4
        {...props}
        onClick={() => {
          window.location.hash = props.id
        }}
      />
    </>
  )
}

function Header5(props = {}) {
  return (
    <>
      {props.id && <a name={props.id} />}
      <h5
        {...props}
        onClick={() => {
          window.location.hash = props.id
        }}
      />
    </>
  )
}

function Header6(props = {}) {
  return (
    <>
      {props.id && <a name={props.id} />}
      <h6
        {...props}
        onClick={() => {
          window.location.hash = props.id
        }}
      />
    </>
  )
}

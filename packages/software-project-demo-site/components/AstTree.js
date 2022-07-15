import { useState, useEffect } from "react"
import { Tree } from "react-arborist"
import { visit } from "unist-util-visit"

function Node(props = {}) {
  const { data: node } = props
  return <div>{node.type}</div>
}

export default function AstTree({ ast: source }) {
  const [formatted, setFormatted] = useState(false)
  const [ast] = useState(source)

  useEffect(() => {
    if (formatted) {
      return () => {}
    }
    visit(ast, (node) => {
      node.id = node.id || generateId(node)
    })
    setFormatted(true)

    return () => {}
  }, [ast, formatted])

  return formatted ? <Tree data={ast}>{Node}</Tree> : null
}

const counters = { start: 0, end: 0 }

function generateId(node) {
  const { type, position = {} } = node
  const { start = {}, end = {} } = position

  return [
    type,
    start.line || counters.start++,
    start.column || counters.start++,
    end.line || counters.end++,
    end.column || counters.end++
  ].join(":")
}

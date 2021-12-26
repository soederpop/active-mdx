import React from "react"
import { CodeBlock, atomOneDark } from "react-code-blocks"

export default function CodeBlockWrapper({ className, ...props }) {
  const match = /language-(\w+)/.exec(className || "")

  return match ? (
    <CodeBlock
      text={props.children}
      language={match ? match[1] : ""}
      showLineNumbers={false}
      theme={atomOneDark}
    />
  ) : (
    <code className={className} {...props} />
  )
}

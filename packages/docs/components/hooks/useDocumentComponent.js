import { useState, useEffect } from "react"
import mdx from "content/mdx"

export default function useDocumentComponent(
  documentId,
  { Loader = Empty } = {}
) {
  const [Component, setDocumentComponent] = useState(undefined)

  useEffect(() => {
    // Getting an error when dynamically importing mdx
    setDocumentComponent(mdx[documentId])
    /*
    import(`content/${documentId}.mdx`).then((mod) => {
      console.log(mod)
      setDocumentComponent(mod.default)
    })
    */
  }, [])

  return Component ? Component : Loader
}

function Empty() {
  return <div />
}

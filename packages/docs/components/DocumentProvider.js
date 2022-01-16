import React, { useContext } from "react"
import AstQuery from "@active-mdx/core/src/AstQuery.js"

const Context = React.createContext()

export default function DocumentProvider({
  doc,
  model,
  documentId,
  extension,
  children
}) {
  const astQuery = new AstQuery(doc.ast)
  return (
    <Context.Provider value={{ doc, model, documentId, extension, astQuery }}>
      {children}
    </Context.Provider>
  )
}

export function useCurrentDocument(props) {
  return useContext(Context)
}

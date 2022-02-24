import { Container } from "semantic-ui-react"
import DocumentProvider from "components/DocumentProvider"

export default function DocumentRenderer({
  documentId,
  doc,
  model,
  extension = "mdx",
  Component
} = {}) {
  return (
    <DocumentProvider
      doc={doc}
      model={model}
      extension={extension}
      documentId={documentId}
    >
      <>
        <Container fluid style={{ paddingRight: "1rem" }}>
          <Component />
        </Container>
      </>
    </DocumentProvider>
  )
}

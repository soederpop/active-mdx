import content from "docs"
import dynamic from "next/dynamic"
import DocumentProvider from "components/DocumentProvider"
import { Button, Grid, Container } from "semantic-ui-react"
import Link from "next/link"

export default function CatchAllPage({
  documentId,
  doc,
  model,
  extension = "mdx"
} = {}) {
  const Component = dynamic(() =>
    import(`../../docs/${documentId}.${extension}`)
  )

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

export async function getStaticPaths() {
  await content.load({
    refresh: process.env.NODE_ENV !== "production"
  })

  const paths = content.available.map((catchAll) => ({
    params: { catchAll: catchAll.split("/") }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps(context = {}) {
  const { params = {} } = context
  await content.load({
    refresh: process.env.NODE_ENV !== "production"
  })

  let model

  try {
    model = doc.toModel()
  } catch (error) {}

  const documentId = params.catchAll.join("/")
  const doc = content.document(documentId)
  const extension = content.items.get(documentId).path.split(".").pop()

  return {
    props: {
      documentId,
      extension,
      model: {
        title: model ? model.title : doc.title || documentId.split("/").pop(),
        ...((model && model.toJSON()) || {})
      },
      doc: JSON.parse(JSON.stringify(doc.toJSON()))
    }
  }
}

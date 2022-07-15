import content from "docs"
import dynamic from "next/dynamic"
import { Grid } from "semantic-ui-react"
import AstTree from "components/AstTree"

export default function CatchAllPage({ documentId, doc, model } = {}) {
  const Component = dynamic(() =>
    import(`../../components/docs/${documentId}`).catch((e) => {
      const ErrorDisplay = () => <div></div>

      return <ErrorDisplay>{e.message}</ErrorDisplay>
    })
  )

  return (
    <Grid columns="2">
      <Grid.Column>
        <Component doc={doc} model={model} documentId={documentId} />
      </Grid.Column>
      <Grid.Column>
        <AstTree ast={doc.ast} />
      </Grid.Column>
    </Grid>
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

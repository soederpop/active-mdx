import Head from "next/head"
import content from "docs"
import ScopeOfWork from "components/ScopeOfWork"

export default function ScopeOfWorkPage(props = {}) {
  return (
    <>
      <Head>
        <title>Scope of Work</title>
      </Head>
      <ScopeOfWork epics={props.epics} />
    </>
  )
}

export async function getStaticProps({ params }) {
  await content.load()

  const epics = content.available
    .filter((id) => id.startsWith("epics/"))
    .map((id) => content.getModel(id))

  return {
    props: {
      epics: epics.map((epic) => epic.toJSON())
    }
  }
}

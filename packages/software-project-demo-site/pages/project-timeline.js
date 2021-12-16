import Head from "next/head"
import content from "docs"
import ProjectTimeline from "components/ProjectTimeline"
import { sortBy } from "lodash-es"
import { Header, Segment } from "semantic-ui-react"

export default function ProjectTimelinePage({ epics = [] } = {}) {
  return (
    <>
      <Head>
        <title>Project Timeline</title>
      </Head>

      <Header as="h1">Project Timeline</Header>
      <p>
        Below is the projected completion and start points for each of the
        epics.
      </p>
      <ProjectTimeline epics={epics} />
    </>
  )
}

export async function getStaticProps({ params }) {
  await content.load({ refresh: process.env.NODE_ENV !== "production" })

  const epics = content.available
    .filter((id) => id.startsWith("epics/"))
    .map((id) => content.getModel(id))

  return {
    props: {
      epics: sortBy(
        epics.map((epic) => epic.toJSON()),
        "title"
      )
    }
  }
}

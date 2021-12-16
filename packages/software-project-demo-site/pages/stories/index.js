import React from "react"
import Link from "next/link"
import { Container, Segment, Header, Table } from "semantic-ui-react"

export default function StoriesPage(props = {}) {
  const { stories = [], epics = [] } = props
  return (
    <Container>
      <Header as="h1" content="Stories" subheader="Grouped by Epic" />
      {epics.map((epic, index) => (
        <Segment key={index} raised>
          <Header
            as="h2"
            content={<Link href={`/epics/${epic.slug}`}>{epic.title}</Link>}
          />
          <Table striped celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Estimate</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {stories
                .filter((story) => story.meta.epic == epic.slug)
                .map((story, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Link href={`/stories/${story.meta.epic}/${story.slug}`}>
                        {story.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{story.description}</Table.Cell>
                    <Table.Cell>
                      {story.meta.estimates?.low || "??"}-
                      {story.meta.estimates?.high || "??"}
                    </Table.Cell>
                    <Table.Cell>{story.meta.status}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </Segment>
      ))}
    </Container>
  )
}

export async function getStaticProps() {
  const content = await import("../../docs").then((mod) => mod.default.load())

  const stories = content.available
    .filter((i) => i.startsWith("stories"))
    .map((id) => content.getModel(id))

  const epics = content.available
    .filter((i) => i.startsWith("epics"))
    .map((id) => content.getModel(id))

  return {
    props: {
      epics: epics.map((epic) => epic.toJSON()),
      stories: stories.map((story) =>
        story.toJSON({
          attributes: ["acceptanceCriteria", "mockupLinks"]
        })
      )
    }
  }
}

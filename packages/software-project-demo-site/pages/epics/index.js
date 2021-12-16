import React from "react"
import content from "docs"
import { Icon, Container, Header, Card } from "semantic-ui-react"
import Link from "next/link"

export default function EpicsPage(props = {}) {
  const { epics = [] } = props

  return (
    <Container>
      <Header as="h1" dividing>
        Epics
      </Header>
      <Card.Group itemsPerRow={3}>
        {epics.map((epic, index) => (
          <Card key={index}>
            <Card.Content header>
              <Link href={`/epics/${epic.slug}`}>{epic.title}</Link>
            </Card.Content>
            <Card.Content description={epic.description} />
            <Card.Content extra>
              <Icon name="book" /> {epic.stories.length} stories
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  )
}

export async function getStaticProps() {
  await content.load()

  const epics = content.available
    .filter((i) => i.startsWith("epics"))
    .map((id) => content.getModel(id))

  return {
    props: {
      epics: epics.map((epic) =>
        epic.toJSON({
          attributes: ["description", "slug", "isComplete"],
          related: ["stories"]
        })
      )
    }
  }
}

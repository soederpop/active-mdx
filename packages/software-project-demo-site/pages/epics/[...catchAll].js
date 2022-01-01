import React from "react"
import content from "content"
import { Header, Message, Container, Card } from "semantic-ui-react"
import Link from "next/link"

export default function EpicsPage(props = {}) {
  const { epic, stories, slug } = props

  return (
    <Container>
      <Header as="h1">{epic.title}</Header>
      <Message>{epic.description}</Message>
      <Header as="h2">Stories</Header>
      <Card.Group itemsPerRow={3}>
        {stories.map((story, index) => (
          <Card key={index}>
            <Card.Content header>
              <Link href={`/stories/${story.meta.epic}/${story.slug}`}>
                {story.title}
              </Link>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  )
}

export async function getStaticPaths() {
  await content.load()

  const epicIds = content.available.reduce((memo, id) => {
    if (id.startsWith("epics/")) {
      memo.push(id.replace("epics/", ""))
    }
    return memo
  }, [])

  return {
    fallback: false,
    paths: epicIds.map((id) => ({
      params: { catchAll: id.split("/") }
    }))
  }
}

export async function getStaticProps({ params }) {
  const { catchAll = [] } = params

  const slug = catchAll.join("/")

  await content.load()
  const epic = content.getModel(`epics/${slug}`)
  const stories = epic.stories().fetchAll()

  return {
    props: {
      slug,
      epic: epic.toJSON(),
      stories: stories.map((story) => story.toJSON())
    }
  }
}

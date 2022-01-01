import React from "react"
import content from "content"
import dynamic from "next/dynamic"
import { Header, Message, Container, Card } from "semantic-ui-react"

export default function StoriesPage(props = {}) {
  const { slug } = props

  const StoryDoc = dynamic(() =>
    import(`../../docs/stories/${slug}.mdx`).then((mod) => mod.default)
  )

  return (
    <Container>
      <StoryDoc />
    </Container>
  )
}

export async function getStaticPaths() {
  await content.load()

  const storyIds = content.available.reduce((memo, id) => {
    if (id.startsWith("stories/")) {
      console.log(id)
      const story = content.getModel(id)
      memo.push(`${story.meta.epic}/${story.slug}`)
    }
    return memo
  }, [])

  return {
    fallback: false,
    paths: storyIds.map((id) => ({
      params: { catchAll: id.split("/") }
    }))
  }
}

export async function getStaticProps({ params }) {
  const { catchAll = [] } = params

  const slug = catchAll.join("/")

  await content.load()
  const story = content.getModel(`stories/${slug}`)
  const epic = story.epic().fetch()

  return {
    props: {
      slug,
      story: story.toJSON(),
      epic: epic.toJSON()
    }
  }
}

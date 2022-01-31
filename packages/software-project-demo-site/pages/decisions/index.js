import React from "react"
import content from "docs"
import { Container, Header, Segment } from "semantic-ui-react"
import Link from "next/link"

export default function DecisionsPage(props = {}) {
  const { decisions = [] } = props

  return (
    <Container>
      <Header as="h1" dividing>
        Decision Log
      </Header>
      <div>
        {decisions.map((decision, index) => (
          <Segment raised key={index}>
            <Header as="h3">
              <Link href={`${decision.id}`}>{decision.title}</Link>
            </Header>
            <p>{decision.description}</p>
          </Segment>
        ))}
      </div>
    </Container>
  )
}

export async function getStaticProps() {
  await content.load()

  const decisions = await content.model("Decision").fetchAll()

  return {
    props: {
      decisions: decisions.map((decision) =>
        decision.toJSON({
          attributes: ["prosAndCons", "options"]
        })
      )
    }
  }
}

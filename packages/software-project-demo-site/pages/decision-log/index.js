import React from "react"
import content from "docs"
import { Grid, Container, Header, Segment } from "semantic-ui-react"
import Link from "next/link"
import { upperFirst } from "lodash-es"

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
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Header as="h3">
                    <Link
                      href={`/decision-log/${decision.id.replace(
                        /^decisions\//,
                        ""
                      )}`}
                    >
                      {decision.title}
                    </Link>
                  </Header>
                  <p>{decision.description}</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Segment piled>
                    <Header
                      content={upperFirst(decision.meta.status || "draft")}
                      icon={
                        decision.meta.status === "completed" ? "check" : "clock"
                      }
                    />
                    {decision.meta.status !== "completed" && (
                      <p>Due by: {decision.meta.dueBy}</p>
                    )}
                    {decision.meta.status === "completed" && (
                      <>
                        <p>Decided on: {decision.meta.result.option}</p>
                        <p>Approved by: {decision.meta.result.approvedBy}</p>
                      </>
                    )}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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

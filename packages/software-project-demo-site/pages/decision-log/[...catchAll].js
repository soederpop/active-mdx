import React from "react"
import content from "docs"
import {
  Divider,
  Icon,
  List,
  Header,
  Container,
  Segment,
  Grid,
  Message
} from "semantic-ui-react"
import Link from "next/link"

export default function DecisionPage(props = {}) {
  const { id, decision } = props
  const { prosAndCons = {}, description, title } = decision
  const { status = "draft", result = {} } = decision.meta
  const { approvedBy, option } = result

  return (
    <Container>
      <Header dividing as="h1">
        {title}
      </Header>
      {status === "completed" && (
        <Message success>
          A decision was made to go with option: {option} by {approvedBy}
        </Message>
      )}
      <Segment raised>{description}</Segment>
      <Header as="h2" dividing>
        Options
      </Header>
      {prosAndCons.map(({ title, pros, cons }) => (
        <Option
          key={title}
          title={title}
          pros={pros}
          cons={cons}
          disabled={status === "completed" && title !== option}
          selected={status === "completed" && title === option}
        />
      ))}
      <Divider />
      <Link href={`/docs/${id}`}>View Full Document</Link>
    </Container>
  )
}

function Option({ title, pros, cons, disabled, selected }) {
  return (
    <>
      <Segment
        raised
        as={Grid}
        padded
        disabled={disabled}
        color={selected ? "green" : null}
      >
        <Grid.Row columns="1">
          <Header
            as="h3"
            content={title}
            {...(selected ? { icon: <Icon name="check" color="green" /> } : {})}
          />
        </Grid.Row>
        <Grid.Row columns="2" divided="vertically">
          <Grid.Column>
            <Header
              as="h4"
              icon={<Icon small size="smaller" name="plus" color="green" />}
              content="Pros"
            />
            <List bulleted>
              {pros.map((pro, index) => (
                <List.Item key={index}>{pro}</List.Item>
              ))}
            </List>
          </Grid.Column>
          <Grid.Column>
            <Header
              as="h4"
              content="Cons"
              icon={<Icon name="minus" color="red" />}
            />
            <List bulleted>
              {cons.map((con, index) => (
                <List.Item key={index}>{con}</List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Segment>
      <div style={{ margin: "24px" }} />
    </>
  )
}

export async function getStaticPaths() {
  await content.load()

  const decisionIds = content.available.reduce((memo, id) => {
    if (id.startsWith("decisions/")) {
      memo.push(id.replace("decisions/", ""))
    }
    return memo
  }, [])

  return {
    fallback: false,
    paths: decisionIds.map((id) => ({
      params: { catchAll: id.split("/") }
    }))
  }
}

export async function getStaticProps({ params }) {
  const { catchAll = [] } = params

  const slug = catchAll.join("/")

  await content.load()
  const decision = content.getModel(`decisions/${slug}`)

  return {
    props: {
      slug,
      id: decision.id,
      decision: decision.toJSON()
    }
  }
}

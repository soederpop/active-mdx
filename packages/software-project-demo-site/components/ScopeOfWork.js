import { Table, Segment, Header, Grid, Statistic } from "semantic-ui-react"

export default function ScopeOfWork({ epics = [] }) {
  const lowTotal = epics.reduce((memo, epic) => {
    const lows = epic.stories.flatMap((story) => story.meta.estimates.low)
    return memo + lows.reduce((memo, estimate) => memo + estimate, 0)
  }, 0)
  const highTotal = epics.reduce((memo, epic) => {
    const highs = epic.stories.flatMap((story) => story.meta.estimates.high)
    return memo + highs.reduce((memo, estimate) => memo + estimate, 0)
  }, 0)
  const lowTotalCost = (lowTotal * 125).toLocaleString()
  const highTotalCost = (highTotal * 125).toLocaleString()
  return (
    <Segment>
      <Header as="h2" dividing content="Scope of Work" />
      <Grid stackable columns={3} as={Segment} raised>
        <Grid.Column>
          <Statistic color="yellow" size="small">
            <Statistic.Value>{lowTotal}</Statistic.Value>
            <Statistic.Label>Low Estimate (Hours)</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic color="orange" size="small">
            <Statistic.Value>{highTotal}</Statistic.Value>
            <Statistic.Label>High Estimate (Hours)</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic color="green" size="small">
            <Statistic.Value>
              ${lowTotalCost}-${highTotalCost}
            </Statistic.Value>
            <Statistic.Label>Cost</Statistic.Label>
          </Statistic>
        </Grid.Column>
      </Grid>
      <Table stackable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Estimate Low</Table.HeaderCell>
            <Table.HeaderCell>Estimate High</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {epics.map((epic, index) => (
            <>
              <Table.Row>
                <Table.Cell>
                  <Header as="h3" content={epic.title} />
                </Table.Cell>
              </Table.Row>
              {epic.stories.map((story, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{story.title}</Table.Cell>
                  <Table.Cell>{story.meta.estimates?.low}</Table.Cell>
                  <Table.Cell>{story.meta.estimates?.high}</Table.Cell>
                </Table.Row>
              ))}
            </>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  )
}

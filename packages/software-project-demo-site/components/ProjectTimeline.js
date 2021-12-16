import React from "react"
import {
  Divider,
  Grid,
  GridRow as Row,
  GridColumn as Col,
  Header,
  Segment,
  Table
} from "semantic-ui-react"
import { sumBy } from "lodash-es"

export default function ProjectTimeline({ epics = [] }) {
  const totalHours = sumBy(epics, (epic) => epic.totalEstimates.high)

  return (
    <div style={{ maxWidth: "80vw" }}>
      <Table condensed celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Epic</Table.HeaderCell>
            {Array.from(new Array(totalHours / 8)).map((i, j) => (
              <Table.HeaderCell key={j}>{j + 1}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ overflowX: "scroll" }}>
          {epics.map((epic) => {
            const startCell = epic.meta.timeline.startAt / 8
            const endCell =
              (epic.meta.timeline.startAt + epic.totalEstimates.high) / 8

            return (
              <Table.Row key={epic.id} style={{ position: "relative" }}>
                <Table.Cell>
                  <small>{epic.title}</small>
                </Table.Cell>
                {Array.from(new Array(totalHours / 8)).map((i, j) => (
                  <Table.Cell
                    style={{
                      backgroundColor:
                        j >= startCell && j < endCell ? "cyan" : "white"
                    }}
                    key={j}
                  ></Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export function ProjectTimelineGrid({ epics = [] } = {}) {
  const totalHours = sumBy(epics, (epic) => epic.totalEstimates.high)

  return (
    <Grid style={{ width: "100%" }} divided="vertically">
      {epics.map((epic) => (
        <Row key={epic.id}>
          <Col width={3}>
            <Header as="h5" content={epic.title} />
          </Col>
          <Col width={13}>
            <Segment
              basic
              inverted
              color="blue"
              data-startAt={epic.meta.timeline.startAt}
              textAlign="center"
              style={{
                left: toPercent(epic.meta.timeline.startAt, totalHours),
                width: toPercent(epic.totalEstimates.high, totalHours)
              }}
            >
              {epic.totalEstimates.high} Hours
            </Segment>
          </Col>
        </Row>
      ))}
      <Row>
        <Col width={8} floated="right" textAlign="right">
          <Header as="h5" content={`Total Hours: ${totalHours}`} />
        </Col>
      </Row>
    </Grid>
  )
}

function toPercent(value, total) {
  return `${(value / total) * 100}%`
}

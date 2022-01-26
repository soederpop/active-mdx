import React from "react"
import { Header, Segment, Grid } from "semantic-ui-react"
import { CodeBlock, atomOneDark } from "react-code-blocks"

const collectionCode = `
collection
  .getModel('stories/authentication/a-user-should-be-able-to-register')
  .toJSON({
    attributes: ['mockupLinks','acceptanceCriteria']
  })
`.trim()
const epicJSON = `
{
  "id": "epics/authentication",
  "meta": {
    "priority": "high",
    "status": "gathering-requirements"
  },
  "title": "Authentication",
  "stories": [
    {
      "id": "stories/authentication/a-user-should-be-able-to-register.",
      "meta": {
        "epic": "authentication",
        "status": "created"
      },
      "title": "A User should be able to register."
    },
    {
      "id": "stories/authentication/a-user-should-be-able-to-login.",
      "meta": {
        "epic": "authentication",
        "status": "created"
      },
      "title": "A User should be able to login."
    }
  ]
}
`.trim()

const storyJSON = `
{
  "id": "stories/authentication/a-user-should-be-able-to-login.",
  "meta": {
    "epic": "authentication",
    "status": "created"
  },
  "title": "A User should be able to login.",
  "mockupLinks": {
    "Invision: Login Form": "https://invisionapp.com",
    "Invision: Login Form Error State ": "https://invisionapp.com"
  },
  "acceptanceCriteria": [
    "A user can visit the signup form, supply their name, email, and password",
    "The signup form should validate the user's information and supply errors",
    "The user should receive a confirmation email",
    "The user should show up in our database as confirmed after clicking the confirmation link"
  ]
}
`

const modelCode = `
import { Model } from '@active-mdx/core'

class Epic extends Model {
  stories() {
    return this.hasMany(Story, {
      heading: "stories"
    })
  }
}


export default class Story extends Model {
  get defaults() {
    return {
      meta: {
        status: "created"
      }
    }
  }

  get isComplete() {
    return this.meta.status === "complete"
  }

  epic() {
    return this.belongsTo(Epic, {
      id: (document) => document.meta.epic
    })
  }

  get mockupLinks() {
    const { toString } = this.document.utils
    return Object.fromEntries(
      this.document
        .querySection("Mockups")
        .selectAll("link")
        .map((link) => [toString(link), link.url])
    )
  }

  get acceptanceCriteria() {
    const { toString } = this.document.utils
    return this.document
      .querySection("Acceptance Criteria")
      .selectAll("listItem")
      .map(toString)
  }
}

`

export default function ModelAndData() {
  return (
    <Segment className="code-samples">
      <Grid fluid stackable columns={2}>
        <Grid.Column>
          <CodeBlock
            language="javascript"
            text={modelCode}
            theme={atomOneDark}
            style={{ fontFamily: "monospace" }}
          />
        </Grid.Column>
        <Grid.Column>
          <Header dividing as="h4">
            ActiveMDX Code
          </Header>
          <CodeBlock
            language="javascript"
            text="collection.getModel('epics/authentication').toJSON({ related: ['stories'] })"
            showLineNumbers={false}
            theme={atomOneDark}
            style={{ fontFamily: "monospace" }}
          />
          <Header dividing as="h4">
            Result
          </Header>
          <CodeBlock
            language="json"
            text={epicJSON}
            theme={atomOneDark}
            showLineNumbers={false}
            style={{ fontFamily: "monospace" }}
          />
          <Header dividing as="h4">
            ActiveMDX Code
          </Header>
          <CodeBlock
            language="javascript"
            text={collectionCode}
            showLineNumbers={false}
            theme={atomOneDark}
            style={{ fontFamily: "monospace" }}
          />
          <Header dividing as="h4">
            Result
          </Header>
          <CodeBlock
            language="json"
            text={storyJSON}
            theme={atomOneDark}
            showLineNumbers={false}
            style={{ fontFamily: "monospace" }}
          />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

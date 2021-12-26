import React from "react"
import { Segment, Grid } from "semantic-ui-react"
import EpicExample from "./epic-example.mdx"
import { CodeBlock, atomOneDark } from "react-code-blocks"

const markdownCode = `
---
priority: high
status: gathering-requirements
---

# Authentication

The Authentication stories cover users logging in and out of the application. 

It also covers the roles and permissions granted to these users and how they are enforced in the application.

## Stories

### A User should be able to register.

As a User I would like to register so that I can use the application.

#### Acceptance Criteria

- A user can visit the signup form, supply their name, email, and password
- The signup form should validate the user's information and supply errors
- The user should receive a confirmation email
- The user should show up in our database as confirmed after clicking the confirmation link

#### Mockups

- [Invision: Registration Form](https://invisionapp.com)
- [Invision: Registration Form Error State](https://invisionapp.com)

### A User should be able to login.

As a User I would like to login so that I can use the application.

#### Acceptance Criteria

- A user can visit the signup form, supply their name, email, and password
- The signup form should validate the user's information and supply errors
- The user should receive a confirmation email
- The user should show up in our database as confirmed after clicking the confirmation link

#### Mockups

- [Invision: Login Form](https://invisionapp.com)
- [Invision: Login Form Error State ](https://invisionapp.com)

`.trim()

export default function SideBySide() {
  return (
    <Segment className="code-samples">
      <Grid fluid stackable columns={2}>
        <Grid.Column>
          <CodeBlock
            text={markdownCode}
            language="markdown"
            showLineNumbers
            theme={atomOneDark}
          />
        </Grid.Column>
        <Grid.Column>
          <EpicExample />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

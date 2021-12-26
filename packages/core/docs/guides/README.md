# Introduction to ActiveMDX

ActiveMDX lets you define a Content Model to represent different markdown / mdx files in your project.

The Content Model lets you work with your writing, and the concepts and things you are writing about, as data.

## An Example ActiveMDX Project

[The Software Development Lifecycle](https://github.com/soederpop/active-mdx/tree/master/examples/sdlc) contains documentation for an imaginary software project.

Many of us have worked with tools like Jira, or Github issues.

Epics are categories of stories, and stories represent individual features or tasks required to make the software work.

```
├── epics
│   ├── authentication.mdx
│   └── search.mdx
├── index.js
├── index.mdx
├── models
│   ├── Epic.js
│   └── Story.js
└── stories
    ├── authentication
    │   └── a-user-should-be-able-to-register.mdx
    └── search
        └── searching-for-a-product-by-category.mdx
```

With ActiveMDX it is possible to write a single epic document, and expand it into separate story documents later.  You can then publish the stories to github or jira, or wherever.  As those stories progress through the development lifecycle, you can keep the files in sync.  You can generate a google document with all of the stories, and have people provide estimates, and then sync the estimates back into the content.

ActiveMDX makes it easy to keep your writing in sync with the rest of the world, as the things you are writing about move and change and progress.

## Collections represent a bunch of markdown / mdx documents

Assuming the example tree above is in the `content` folder.

```javascript
// index.js
import { Collection } from "@active-mdx/core"

const collection = new Collection({
    rootPath: Collection.resolve('content')
})
```

## Models represent different types of documents

A `Model` subclass is used to represent the assumed structure of a type of document.  Generally, this means a document with a known heading hierarchy.  A Model is responsible for using the [AstQuery](../api/AstQuery.mdx) and [NodeShortcuts](../api/NodeShortcuts.mdx) utilities for extracting nodes from the markdown AST.    

By turning a document into data, the model class can be used to automate various tasks, such as creating other documents in the project, or publishing content to an API.  For example, the Story class in the [SDLC Example](https://github.com/soederpop/active-mdx/blob/master/examples/sdlc/models/Story.js) could publish the stories to Jira or Github.

```javascript
import { Model } from "../../../index.js"

import Epic from "./Epic.js"

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
}

Story.action("publish", async function(story) {
  const issue = await githubAPI.issues.create({ title: story.title, content: story.document.content })

  story.meta.issueNumber = issue.number

  await story.save()
})
```

## Models can be used to generate content

An example use case for this, would be how I generate API documentation in markdown by analyzing the structure of various JavaScript modules in the ActiveMDX project.

See the [ApiDoc](../models/ApiDoc.js) class as an example.  I use this module to generate API documentation found in [the api folder](../api)

```javascript
ApiDoc.action("sync-with-code", async function generateOutline(model) {
  const classMethods = model.classInstanceMethods
  const classGetters = model.classGetters
  const staticMethods = model.staticClassMethods
  const staticGetters = model.staticClassGetters

  const body = ["## API\n"]

  const apiHeading = model.document.astQuery.findHeadingByText("api")

  if (apiHeading) {
    model.document.removeSection(apiHeading)
    model.document.replaceContent(model.document.stringify())
    await model.save()
  }

  if (!isEmpty(classMethods)) {
    body.push("### Instance Methods\n\n")
    body.push(
      ...Object.values(model.getDocBlocks("classInstanceMethods")).map(
        (m) => m.markdown
      )
    )
    body.push("\n")
  }

  const apiDocsContent = body.join("\n")

  model.document.appendContent(`\n${apiDocsContent}`)
  await model.save()
})
```

With the underlying [Document Instance](../api/Document.mdx) you can use methods like `appendContent`, or `replaceSection(heading, newContent)` to generate content from data.  This can be useful for generating an outline and then adding your own writing within the outline.

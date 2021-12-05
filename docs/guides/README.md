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

## Collections represent a bunch of markdown / mdx documents

Assuming the example tree above is in the `content` folder.

```javascript
// index.js
import { Collection } from "active-mdx"

const collection = new Collection({
    rootPath: Collection.resolve('content')
})
```

## Models represent different types of documents

A `Model` subclass is used to represent the assumed structure of a type of document.  Generally, this means a document with a known heading hierarchy.  A Model is responsible for using the [AstQuery](../api/AstQuery.mdx) and [NodeShortcuts](../api/NodeShortcuts.mdx) utilities for extracting nodes from the markdown AST.    

By turning a document into data, the model class can be used to automate various tasks, such as creating other documents in the project, or publishing content to an API.  For example, the Story class in the [SDLC Example](https://github.com/soederpop/active-mdx/blob/master/examples/sdlc/models/Story.js) could publish the stories to Jira or Github.

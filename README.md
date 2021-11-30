# Active MDX
> Content Modeling for MDX

[MDX](https://mdxjs.com) lets you combine Markdown and React to interactive presentations for your writing.  Where regular markdown provides you with static html, MDX provides you with a dynamic, react based output which you can customize and make interactive. 

ActiveMDX works in Node.js and provides a structured content modeling API on top of [Collections](docs/api/Collection.mdx) of MDX files in a folder and its subfolders. This lets you work with the collection of documents as if it was a database, an individual document being a record, and the structure of the content ( and YAML frontmatter ) determining its attributes.

Active MDX is a Content Modeling library which lets you develop `Model`s for the different types of MDX documents in your project.  A `Model` assumes that a document follows a known heading and sub-heading structure.  For example, A `Recipe` will have an `Ingredients` section and a `Steps` section.  Active MDX Models allow you to turn any MDX Document into a JSON object by providing helpers for working with the document in [AST form](https://mdxjs.com).  What goes into the JSON object will depend entirely on what you are writing inside of this predicable structure.  Active MDX Models are backed by a [Document](./docs/api/Document.mdx) class which provides you with many utilities for turning the content being written about into structured data.

The data Active MDX makes available based on what is being written about can be used to power all sorts of applications. If you are building a website which which is a cookbook that has a dozen recipes, Active MDX can give you a database of all of the ingredients and quantities and you could render a button to place the order let users find a recipe based on what ingredients they had.  

## Requirements

- Node.js 14.15.0 or later.

## Installation

```shell
$ npm install active-mdx
```

## Usage

ActiveMDX works on the server, in Node.js. Use later versions of node which support esm modules natively.

To start with, you have a folder that contains mdx files.  

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

This folder is represented by an instance of the Active MDX [Collection](./docs/api/Collection.mdx)

```js
// index.js
import { Collection } from "active-mdx"

export default async () => new Collection({ rootPath: "./content" }).load()
```

The mdx files inside of the `epics` folder are represented by a [Model](./docs/api/Model.mdx) that we defined in [./models/Epic.js](./examples/sdlc/models/Epic.js)

```javascript
// ./models/Epic.js
import { Model } from "active-mdx"
import Story from "./Story.js"

export default class Epic extends Model {
  stories() {
    return this.hasMany(Story, {
      heading: "stories",
      meta: () => ({ epic: this.title.toLowerCase() })
    })
  }

  get isComplete() {
    return this.stories().fetchAll().every((story) => story.meta.status === 'completed')
  }

  static is(document) {
    return document.id.startsWith("epic")
  }
}
```

This will take mdx content such as [epics/authentication.mdx](./examples/sdlc/epics/authentication.mdx)

```md
---
status: proposed
---

# Authentication

The Authentication stories cover users logging in and out of the application, as well as the roles and permissions granted to these users and how they are enforced in the application.

## Stories

### A User should be able to register

As a User I would like to register so that I can use the application.

### A User should be able to login

As a User I would like to login so that I can use the application.
```

In addition to displaying the Epic in MDX form, we can also work with it as data and reference the things contained in the writing itself.

```javascript
const authEpic = collection.getModel("epics/authentication")
console.log(authEpic.toJSON({ related: ["stories"], attributes: ["isComplete"] }))
/*
{
  "id": "epics/authentication",
  "meta": {
    "status": "proposed"
  },
  "title": "Authentication",
  "stories": [
    {
      "id": "stories/authentication/a-user-should-be-able-to-register",
      "meta": {
        "epic": "authentication"
      },
      "title": "A User Should be able to Register"
    },
    {
      "id": "stories/authentication/a-user-should-be-able-to-login",
      "meta": {
        "epic": "authentication"
      },
      "title": "A User should be able to login"
    }, ...
  ],
  "isComplete": false
}
*/
```

## CLI

The package ships with a bin `amdx` which can be used to initialize a new project, and work with the documents and models.

```shell
$ amdx --help
```

## Guides and Documentation

- [Introduction](./docs/guides/introduction.mdx)
- [Usage with NextJS](./docs/guides/usage/with-nextjs.mdx)
- [Models](./docs/guides/models)

## Example Projects

- [Example Next.js Blog](https://github.com/soederpop/active-mdx-nextjs-blog)
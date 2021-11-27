# Active MDX

[MDX](https://mdxjs.com) is a great tool, it lets you combine Markdown and React to create beautiful and interactive presentations for your writing.

With ActiveMDX you can treat collections of MDX files as a database, and even provide an API for your content so that a computer can interact with it. The word Active in MDX is a reference to the [Active Record Pattern](https://en.wikipedia.org/wiki/Active_record_pattern) or [ActiveRecord](https://guides.rubyonrails.org/active_record_basics.html) in Rails.

## Requirements

- Node.js 14.15.0 or later.

## Installation

```shell
$ npm install active-mdx
```

## Usage

ActiveMDX works on the server, in Node.js. Use later versions of node which support esm modules natively.

It works best with a project like [Next.js](https://nextjs.org)

```js
// content.js
import { Collection, Model } from "active-mdx"

// say you had a subfolder content/stories with .e.g content/stories/authentication/registration.mdx
class Story extends Model {
  epic() {
    return this.belongsTo(Epic)
  }
}

// say you had a subfolder content/epics with e.g. content/epics/authentication.mdx
class Epic extends Model {
  stories() {
    return this.hasMany(Story)
  }
}

// assumes all your mdx files live in a folder called content
const collection = new Collection({
  rootPath: Collection.resolve("content"),
  models: [Story, Epic]
})

export default collection
```

## Why does this exist?

Most of the writing I do is about software. If I write about software in a very structured way, then it is possible to let a computer understand what I am writing, and the context in which I am writing, and actually do things with what I've written. Whether I am writing requirements for software that somebody else will develop, or documentation about software I've written, or an API that I've made available, if the only value that writing is providing is to the people reading it, there is a lot of value being wasted.

Github Copilot can take a sentence I type in english and suggest really good code to use, but Github Copilot is trained with supercomputers on billions of lines of code over decades. If you are writing in Markdown, it is already possible to turn that writing into an AST. Since we can do that, we can leverage the patterns of structured writing to treat english itself as a form of code and data and use it to automate applications I haven't even thought of yet.

ActiveMDX helps you do that, by defining model classes to represent different types of markdown documents. (Think about Github issue or Pull Request templates). These models let you describe the meaning of your writing.

## Introduction

Say you had a folder structure like the one in [examples/sdlc](examples/sdlc)

```
examples/sdlc
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

The file [epics/authentication.mdx](examples/sdlc/epics/authentication.mdx) can be represented as a [Model](src/Model.js) which you would subclass, e.g. [Epic](examples/sdlc/models/Epic.js). The file [stories/authentication/a-user-should-be-able-to-register.mdx](examples/sdlc/stories/authentication/a-user-should-be-able-to-register.mdx) can be represented by another class [Story](examples/sdlc/models/Story.js).

You can say an `Epic.hasMany("Stories")` and now the system knows these files are related.

ActiveMDX will automatially treat files in the subfolder `stories` as instances of the `Story` class, and all files in the subfolder `epics` as instances of the `Epic` class.

```javascript
import { Model } from "active-mdx"
import Story from "./Story.js"

export default class Epic extends Model {
  stories() {
    return this.hasMany(Story, {
      heading: "stories",
      meta: () => ({ epic: this.title.toLowerCase() })
    })
  }

  static is(document) {
    return document.id.startsWith("epic")
  }
}
```

This will take content like

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

And let you work with it as an object

```javascript
import { Collection, Model } from "active-mdx"

async function main() {
  // Assumes your mdx content lives in a subfolder called content
  const collection = new Collection({ rootPath: Collection.resolve("content") })
  const doc = collection.document("epics/authentication")
  const epic = doc.toModel()
  const stories = epic.stories().fetchAll()
}

main()
```

In the example above, stories will each have an `.mdx` file backing it. If those files don't exist, you can create them when you save them.

```javascript
await Promise.all(stories.map((story) => story.save()))
```

This means you can start from a single file in epics, and eventually expand that into separate files when the content is ready.

What can you do with Epics and Stories by treating them as objects? Besides just displaying these documents on a web page since they're MDX.

I could automatically publish them to Github Issues or Jira. I could export them to a google spreadsheet, and get my team to estimate them, and then generate a project proposal for a client to review and agree to.

The possibilities are endless.

## Example Projects

- [Example Next.js Blog](https://github.com/soederpop/active-mdx-nextjs-blog)

## Inspiration

- I tried to do this back in the day with Ruby, and ran a successful software consultancy using markdown as a primary tool for communicating with clients and developers. That project was called [Brief](https://github.com/datapimp/brief)
- I discovered the work of [Titus Wormer](https://github.com/wooorm) who has developed hundreds of modules in JavaScript for a system called [Unified](https://unifiedjs.com/) which provides a system for working with ASTs for all kinds of structured writing.
- [MDX](https://mdxjs.com) let us combine Markdown with React and develop interactive UI for working with writing besides just the HTML normal markdown gave us.

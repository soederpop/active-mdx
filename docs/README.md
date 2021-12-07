# ActiveMDX

This is the documentation for ActiveMDX.  You can view the source on [Github](https://github.com/soederpop/active-mdx).

ActiveMDX is a content modeling library that lets you turn collections of markdown and mdx files into a database.  This means different types of documents are like a table, and each individual document of that type is a row in that table.  Each row will have attributes that depend on the content of that document.  ActiveMDX models are relational, meaning documents can relate to other documents.

ActiveMDX can be used to automate many different tasks using the data contained in your content, such as generating new documents, or interacting with APIs.  You can also use the data that is derived from your writing to provide an enhanced UI for viewing the document, since with MDX you have the full power of React components available.

ActiveMDX assumes your writing is structured, and that documents of the same type will have the same structure, e.g. headings and subheadings.  A Recipe document will have a section `## Steps` and a section `## Ingredients`.  Then if you have many different Recipe documents, you can do things like

```javascript
import collection from "./content"
const Recipe = collection.model('Recipe')

const recipes = await Recipe.query((qb) => qb.where("category", "vegetarian")).fetchAll()
const vegetarianIngredients = new Set(...recipes.flatMap(recipe => recipe.ingredients()))
```

ActiveMDX lets you combine your writing with data, either data from the writing itself, or data from other sources that you pull in using the names of things you reference in your writing.  You really are only limited by your imagination.

## Installation

```shell
$ npm install active-mdx
# Or if you're using yarn
$ yarn add active-mdx
```

## Initializing Your First Project

The following command will create your first ActiveMDX collection inside the folder content

```shell
$ amdx init ./content
```

## Guides

This section contains guides for getting started with and using ActiveMDX.

- [Introduction](./guides/README.md)
- [Models](./guides/models/README.md)
- [Usage with Next.js](./guides/usage/with-nextjs.mdx)

## API Docs

The following documentation is about the different classes and methods available in the ActiveMDX API.

- [AstQuery](./api/AstQuery.mdx)
- [Collection](./api/Collection.mdx)
- [CollectionQuery](./api/CollectionQuery.mdx)
- [Document](./api/Document.mdx)
- [Model](./api/Model.mdx)
- [NodeShortcuts](./api/NodeShortcuts.mdx)

# ActiveMDX Collections

The ActiveMDX library provides a [Collection Class](../../api/Collection.mdx) which is used to represent a folder in your project that contains all of your MDX or Markdown files.

```javascript
// content/index.js
import { Collection } from 'active-mdx'

export default new Collection({
  rootPath: Collection.resolve("content")
})
```

To begin using the collection, you'll need to call its `load` function which is asynchronous.  This will recursively search the folder for `**/*.mdx` and `**/*.md` files, load their content, and metadata (YAML Frontmatter)

## Accessing a document

Every document found by the collection will get an `id` attribute. A file in `./content/posts/intro.mdx` will have the id `posts/intro`.  The id is the path of the document, relative to the collection's rootPath, and without an extension.

```javascript
import collection from "./content/index.js"

collection.document("posts/intro")
```

## Getting a model instance 

You can call the `getModel` method to get an instance of a model for a given document

```javascript
let introModel = collection.getModel("posts/intro")

// equivalent to
const doc = collection.getModel("posts/intro")

introModel = doc.toModel()
```

## Registering a model with the collection

When you call `load()` on the collection, you can pass `{ models: true }` and it will auto-register any model found in the `models/` folder.

If you've already loaded the collection and want to register another model, you can do it this way:

```javascript
import { Model } from "@active-mdx/core"
import collection from "./content/index.js"

class Post extends Model {

}

collection.model("Post", Post)
```

## Accessing a model class

```javascript
import collection from "./content/index.js"

const Post = collection.model("Post")
```

## Action System

You are able to register action functions with the collection.  

```javascript

export const collection = new Collection({ rootPath, models: [ApiDoc] })

collection.model("ApiDoc", ApiDoc)
collection.action("generate-api-docs", generateApiDocs)

export { ApiDoc }

export default collection

async function generateApiDocs(collection) {
  const apiDocs = await ApiDoc.query((qb) => {
    qb.where("meta.nodoc", "neq", true)
  }).fetchAll()

  for (let apiDoc of apiDocs) {
    if (!apiDoc.meta.path) {
      console.log("API Doc is missing a path meta attribute", apiDoc.id)
    } else {
      console.log(`Syncing ${apiDoc.meta.path} -> ${apiDoc.id}`)
      await apiDoc.runAction("sync-with-code")
    }
  }
}
```

You can run this action on the collection with the `amdx` CLI.

```shell
$ amdx action generate-api-docs 
```

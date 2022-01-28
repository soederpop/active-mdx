import { Collection } from "@active-mdx/core"

import Epic from "./models/Epic.mjs"
import Story from "./models/Story.mjs"
import Standup from "./models/Standup.mjs"
import github from "./lib/github.js"

const collection = new Collection({
  rootPath: Collection.resolve("docs")
})

export { Epic, Story, Standup }

export default collection
  .model("Epic", Epic)
  .model("Story", Story)
  .model("Standup", Standup)

collection.action("setup:github", async function (collection, options = {}) {
  console.log("What up man")
  const { repository = "" } = collection.packageManifest
  if (!options.owner || !options.repo) {
    options.owner = options.owner || repository.split(":")[1].split("/")[0]
    options.repo = options.repo || repository.split(":")[1].split("/")[1]
  }

  if (!options.owner?.length || !options.repo?.length) {
    throw new Error(
      `Must provide owner/repo.  Add repository github:owner/repo to the package.json`
    )
  }

  const { owner, repo } = options

  console.log(`Setting up Github integration with ${owner}/${repo}`)
  const octokit = await github()
})

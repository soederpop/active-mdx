import { Collection } from "@active-mdx/core"
import path from "path"
import Epic from "./models/Epic.mjs"
import Story from "./models/Story.mjs"
import Standup from "./models/Standup.mjs"
import Decision from "./models/Decision.mjs"

const rootPath = path.parse(import.meta.url.replace("file://", "")).dir

const collection = new Collection({ rootPath })

collection.githubRepo = () => {
  const { repository = "" } = collection.packageManifest

  return {
    owner: repository.split(":")[1].split("/")[0],
    repo: repository.split(":")[1].split("/")[1]
  }
}

export { Epic, Story, Standup }

export default collection
  .model("Epic", Epic)
  .model("Story", Story)
  .model("Standup", Standup)
  .model("Decision", Decision)

collection.action("github:publish-all", async function (collection, options) {
  const stories = await collection.query("Story").fetchAll()

  for (let story of stories) {
    if (story.hasGithubIssue) {
      console.log(
        `Story ${story.id} has a github issue already: ${story.meta.github.issue}`
      )
    } else {
      const { issue } = await story.publishToGithub()
      console.log(`Created issue #${issue.number} for ${story.id}`)
    }
  }
})

collection.action("github:setup", async function (collection, options = {}) {
  const github = await import("./lib/github.js").then((mod) => mod.default)

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

  const statuses = await collection
    .model("Story")
    .fetchAll()
    .then((stories) => stories.map((story) => story.meta.status))
    .then((statuses) => [...new Set(statuses)])

  console.log(`Ensuring Status Labels Exist`)

  const { data: existingLabels } = await octokit.rest.issues.listLabelsForRepo({
    owner,
    repo
  })

  let idx = 0
  for (let status of statuses) {
    const label = existingLabels.find(
      (label) => label.name === `story-${status}`
    )

    if (label) {
      console.log(`label ${label.name} already exists.`)
    } else {
      console.log(`Creating label story-${status}`)
      octokit.rest.issues
        .createLabel({
          owner,
          repo,
          name: `story-${status}`,
          color: randomHexColorCodes[idx++ % randomHexColorCodes.length],
          description: `story is in ${status}`
        })
        .then((created) => {
          console.log(`Created label ${created.name}`)
        })
    }
  }
})

const randomHexColorCodes = [
  "f44336",
  "e91e63",
  "9c27b0",
  "673ab7",
  "3f51b5",
  "2196f3",
  "03a9f4",
  "00bcd4",
  "009688",
  "4caf50",
  "8bc34a"
]

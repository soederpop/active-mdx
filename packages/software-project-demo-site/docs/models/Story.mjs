import { Model } from "@active-mdx/core"
import Epic from "./Epic.mjs"

export default class Story extends Model {
  static statuses = ["created", "in-progress", "qa", "approved", "complete"]

  static get schema() {
    const { joi } = this

    return joi
      .object({
        title: joi.string().required(),
        description: joi.string().required(),
        id: joi.string().required(),
        totalEstimates: joi.object({
          high: joi.number().required(),
          low: joi.number().required()
        }),
        meta: joi
          .object({
            epic: joi.string().required(),
            status: joi
              .string()
              .required()
              .pattern(
                new RegExp(`^(${this.statuses.join("|")})$`),
                "valid statuses"
              ),
            estimates: joi
              .object({
                high: joi.number().required(),
                low: joi.number().required()
              })
              .unknown(true)
              .required(),
            github: joi.object({
              issue: joi.number()
            })
          })
          .required()
          .unknown(true)
      })
      .unknown(true)
  }

  get defaults() {
    return {
      meta: {
        status: "created",
        estimates: {
          low: 0,
          high: 0
        }
      }
    }
  }

  toJSON({ related = [], attributes = [], ...options } = {}) {
    return super.toJSON({
      related,
      attributes: [
        "description",
        "isComplete",
        "slug",
        "acceptanceCriteria",
        "mockupLinks",
        ...attributes
      ],
      ...options
    })
  }

  get isComplete() {
    return this.meta.status === "complete"
  }

  get description() {
    const { document } = this
    const { leadingElementsAfterTitle = [] } = document.nodes

    return leadingElementsAfterTitle.map(document.utils.toString).join("")
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

  get hasGithubIssue() {
    return !!this.meta.github?.issue
  }

  async getGithubIssue(options = {}) {
    const github = await import("../lib/github.js").then((mod) => mod.default)
    if (!this.hasGithubIssue) {
      throw new Error(
        `This story does not have meta.github.issue set.  Call publishToGithub first or edit the documents meta data`
      )
    }

    const { repository = "" } = this.collection.packageManifest

    if (!options.owner || !options.repo) {
      options.owner = options.owner || repository.split(":")[1].split("/")[0]
      options.repo = options.repo || repository.split(":")[1].split("/")[1]
    }

    if (!options.owner?.length) {
      throw new Error(
        `Must provide owner/repo.  Add repository github:owner/repo to the package.json`
      )
    }

    const { owner, repo, number = this.meta.github?.issue } = options

    const octokit = await github()

    const { data: issue } = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: number
    })

    return { issue, owner, repo }
  }

  async syncWithGithub(options = {}) {
    const { meta } = this
    const { issue } = await this.getGithubIssue(options)
    // const github = await import("../lib/github.js").then((mod) => mod.default)

    const labelNames = issue.labels.map(({ name }) => name)
    const storyLabel = labelNames.find((name) => name.startsWith(`story-`))

    if (storyLabel) {
      const issueStatus = storyLabel.split("-").slice(1).join("-")
      if (meta.status !== issueStatus) {
        this.meta.status = issueStatus
      }
    }

    await this.save()
  }

  async publishToGithub(options = {}) {
    if (this.hasGithubIssue) {
      return this.getGithubIssue()
    }

    const github = await import("../lib/github.js").then((mod) => mod.default)
    const { title, content: body } = this.document
    const { repository = "" } = this.collection.packageManifest

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

    const octokit = await github()

    const { data: issue } = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body
    })

    this.meta.github = {
      issue: issue.number
    }

    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: issue.number,
      labels: ["story-created", `epic-${this.meta.epic}`]
    })

    await this.save()

    return { owner, repo, issue }
  }
}

Story.action("github:publish", async (story, options = {}) => {
  if (story.hasGithubIssue) {
    console.log(
      `Story is already published to Github ${story.meta.github.issue}`
    )
  } else {
    const { issue, owner, repo } = await story.publishToGithub(options)
    console.log(`Created issue #${issue} on ${owner}/${repo}`)
  }
})

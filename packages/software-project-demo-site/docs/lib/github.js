import { Octokit } from "octokit"

let octokit

export async function create(options = {}) {
  if (octokit) {
    return octokit
  }

  octokit = new Octokit({
    auth: options.accessToken || process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  })

  return octokit
}

export default create

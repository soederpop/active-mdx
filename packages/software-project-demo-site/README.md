# ActiveMDX Software Project Starter

This project is a Next.js site for presenting documentation about a software project.

It uses [ActiveMDX](https://active-mdx.soederpop.com) to treat individual documents as data.

[View the website](https://active-mdx-software-demo.soederpop.com/)

## Getting Started

1) Clone this repo

```shell
$ git clone git@github.com:soederpop/active-mdx-software-project-starter.git ./my-project
```

2) Install the dependencies

```shell
$ npm install
# or if you use yarn
$ yarn
```

3) Start the dev server

```shell
$ yarn dev
```

## Project Documentation

The project documentation lives in [docs](./docs).  

## Useful CLI Commands

1) Create a new epic

```shell
$ amdx create epic --title "Whatever"
```

2) Expand the epic into stories

```shell
$ amdx action expand epics/whatever
```

This will create separate story documents for you to further edit.

3) Create a new decision

```shell
$ amdx create decision --title "Decision Title"
```

## Github Integration

You can use the github integration to publish the stories from [docs/stories](docs/stories) to github.

1) Point this `package.json` to the repository you wish to create issues in, by editing the package.json file's `repository` field.

```json
{
  "repository": "github:soederpop/active-mdx-software-starter"
}
```

2) Set your github personal access token in the environment variable `GITHUB_PERSONAL_ACCESS_TOKEN`

3) Run `amdx action github:setup` to create the necessary labels for epics and story statuses.

4) Run `amdx action github:publish-all` to create issues in github, and update your local stories with the github status.

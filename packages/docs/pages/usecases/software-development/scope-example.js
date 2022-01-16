import React from "react"
import ScopeOfWorkIntro from "content/usecases/software-development/scope-of-work.mdx"

export default function ScopeOfWorkDemo(props = {}) {
  return (
    <div>
      <ScopeOfWorkIntro />
    </div>
  )
}

export async function getStaticProps() {
  const collection = await import(
    "content/usecases/software-development/docs/index.mjs"
  ).then((mod) => mod.default.load())

  const epics = await collection.model("Epic").query().fetchAll()

  return {
    props: {
      epics: epics.map((epic) => epic.toJSON({ related: ["stories"] }))
    }
  }
}

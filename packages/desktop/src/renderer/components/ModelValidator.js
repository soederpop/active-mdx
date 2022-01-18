import React from "react"
import { useClientCall } from "./hooks"
import ErrorList from "./ErrorList"

export default function ModelValidator({ project, model }) {
  const { isValid, errors = {} } = useClientCall(() =>
    API.validateModel({ project, model })
  )

  if (isValid) {
    return <div className="text-white">Model is Valid</div>
  }

  return <ErrorList messages={Object.values(errors).map((i) => i.message)} />
}

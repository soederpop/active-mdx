import React, { useEffect, useState } from "react"
import Divider from "./Divider"
import { useClientCall } from "./hooks"
import { useAppContext } from "./AppProvider"

import ModelList from "./ModelList"
import ModelInstanceView from "./ModelInstanceView"
import ModelView from "./ModelView"

export default function ProjectHome({
  filter,
  setActiveProject,
  project,
  ...props
}) {
  const { loading, response = {} } = useClientCall(() =>
    API.getProjectData(project).then((response) => {
      console.log("Project Data", response)
      return response
    })
  )

  const { context, setContext } = useAppContext()

  if (loading) {
    return <div />
  }

  const { screen = "main" } = context

  console.log("Rendering Project Home", screen, context)

  switch (screen) {
    case "model-instance":
      return (
        <ModelInstanceView
          filter={filter}
          {...context}
          {...response}
          project={project}
        />
      )
    case "model":
      console.log("Model View", context.model)
      return (
        <ModelView
          filter={filter}
          {...context}
          {...response}
          onSelect={(model) =>
            setContext({
              model,
              modelClass: context.model,
              screen: "model-instance"
            })
          }
        />
      )
    case "main":
    default:
      return (
        <ProjectMainScreen
          filter={filter}
          {...response}
          setContext={setContext}
          project={project}
        />
      )
  }
}

function ProjectMainScreen(props = {}) {
  const {
    filter,
    recent = [],
    modelData,
    models = [],
    project,
    setContext
  } = props

  useEffect(() => {
    setContext({ screen: "main" })
  }, [])

  return (
    <div className="text-white p-10">
      <h2 className="font-medium">{project.name}</h2>
      <Divider title="Recent" />
      {recent.map(([id, timestamp, modelClassName], index) => (
        <div
          onClick={() => {
            const model = modelData[modelClassName]?.find((m) => m.id === id)
            setContext({
              model,
              modelClass: models.find((m) => m.name === modelClassName),
              screen: "model-instance"
            })
          }}
          key={id}
          className="py-2 border-b-slate-600 border-b-2"
        >
          {id}
        </div>
      ))}
      <Divider title="Models" />
      <ModelList
        filter={filter}
        models={models}
        onSelect={(model) => {
          setContext({ model, screen: "model" })
        }}
      />
    </div>
  )
}

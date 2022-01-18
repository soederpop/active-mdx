import React, { useEffect, useState } from "react"
import Divider from "./Divider"
import { useClientCall } from "./hooks"
import { useAppContext } from "./AppProvider"
import ModelList from "./ModelList"
import ModelInstanceView from "./ModelInstanceView"
import ModelView from "./ModelView"
import { runCollectionAction } from "../actions"
import { titleize } from "inflect"

export default function ProjectHome({
  filter,
  setActiveProject,
  project,
  ...props
}) {
  const {
    loading,
    reload,
    response = {}
  } = useClientCall(() =>
    API.getProjectData(project).then((response) => {
      console.log("Project Data", response)
      return response
    })
  )

  const { context, setContext } = useAppContext()

  if (loading) {
    return <div />
  }

  // console.log("APP Context", context)

  const { screen = "main" } = context

  switch (screen) {
    case "model-instance":
      return (
        <ModelInstanceView
          filter={filter}
          {...context}
          {...response}
          {...(response.serverResponse || {})}
          project={project}
          reload={reload}
        />
      )
    case "model":
      return (
        <ModelView
          filter={filter}
          {...context}
          {...response}
          modelClass={context.model}
          project={project}
          reload={reload}
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
          reload={reload}
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
    availableActions = [],
    packageRoot,
    project,
    setContext,
    reload
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
          className="py-2 border-b-slate-600 border-b-2 hover:bg-slate-600"
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
      <Divider title="Actions" />
      <ActionList
        filter={filter}
        actions={availableActions}
        packageRoot={packageRoot}
        project={project}
        reload={reload}
      />
    </div>
  )
}

let actionCounter = 0
function ActionList({
  filter = "",
  project,
  packageRoot,
  actions: availableActions,
  reload
}) {
  const { setActiveProject } = useAppContext()

  const actions = availableActions
    .map((action) => ({
      action,
      name: titleize(action.replace(/-/g, " "))
    }))
    .filter(
      ({ name, action }) =>
        !filter.length || name.includes(filter) || action.includes(filter)
    )

  return (
    <div className="text-white">
      <div
        className="p-4 border-b-2 border-slate-600 hover:bg-slate-600"
        onClick={() => API.openWithNative({ url: packageRoot })}
      >
        Open in VSCode
      </div>
      <div
        className="p-4 border-b-2 border-slate-600 hover:bg-slate-600"
        onClick={() =>
          API.untrackProject(project).then(() => setActiveProject(null))
        }
      >
        Untrack Project
      </div>

      {actions.map(({ action, name }) => (
        <div
          className="p-4 border-b-2 border-slate-600 hover:bg-slate-600"
          key={action}
          onClick={() =>
            runCollectionAction({ actionName: action, cwd: packageRoot })
          }
        >
          {name}
        </div>
      ))}
    </div>
  )
}

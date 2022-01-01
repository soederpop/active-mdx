import React, { useEffect, useState } from "react"
import MarkdownEditor from "./MarkdownEditor"
import MdxPreview from "./MdxPreview"
import ModelValidator from "./ModelValidator"
import { useClientCall } from "./hooks"
import { useAppContext } from "./AppProvider"
import { runModelAction } from "../actions.js"

export default function ModelInstanceView({
  model,
  packageRoot: cwd,
  project,
  modelClass,
  reload
}) {
  const [view, setView] = useState("source")
  const { toggleFilter, setContext, context } = useAppContext()
  const {
    reload: reloadModel,
    loading,
    response
  } = useClientCall(() =>
    API.getModel({
      model,
      project
    })
  )

  const deleteModel = () =>
    API.deleteModel({ model, project }).then(() =>
      setContext({
        screen: "model",
        model: context.modelClass,
        reload: true
      })
    )

  useEffect(() => {
    toggleFilter(false)
    setContext({
      ...context,
      breadcrumb: [
        {
          name: modelClass.name,
          current: false,
          onClick: () => {
            setContext({
              screen: "model",
              model: modelClass
            })
          }
        },
        {
          name: model.id,
          current: true
        }
      ]
    })
    API.updateWindow({ profile: "centered-large" })
  }, [])

  if (loading) {
    return <div />
  }

  return (
    <div className="flex w-full">
      <div className="text-white w-2/5 pl-2">
        <div
          className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
          onClick={() => setView("source")}
        >
          View Source
        </div>
        <div
          className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
          onClick={() => setView("preview")}
        >
          Preview
        </div>
        <div
          className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
          onClick={() => API.openWithNative({ url: response.path })}
        >
          Open in VSCode
        </div>
        <div
          onClick={() => setView("validate")}
          className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
        >
          Validate this model
        </div>
        <div
          className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
          onClick={() => setView("json")}
        >
          View JSON
        </div>
        <div
          onClick={() => deleteModel()}
          className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
        >
          Delete this model
        </div>

        {modelClass.availableActions.map((action) => {
          return (
            <div
              key={action}
              onClick={() =>
                runModelAction({
                  cwd,
                  actionName: action,
                  models: [response.model.id]
                })
              }
              className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
            >
              Run {action} action
            </div>
          )
        })}
      </div>
      <div className="w-3/5">
        {view === "source" && response?.document?.content && (
          <MarkdownEditor
            value={response.document.content}
            height="90vh"
            handleSave={(content) =>
              API.saveDocument({
                id: response.document.id,
                content,
                project
              })
            }
          />
        )}
        {view === "preview" && response?.document?.id && (
          <MdxPreview cwd={cwd} pathId={response.document.id} height="90vh" />
        )}
        {view === "validate" && response?.model?.id && (
          <ModelValidator project={project} model={model} height="90vh" />
        )}
        {view === "json" && response?.model && (
          <pre>{JSON.stringify(response.model, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}

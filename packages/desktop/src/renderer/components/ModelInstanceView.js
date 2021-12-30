import React, { useEffect, useState } from "react"
import MarkdownEditor from "./MarkdownEditor"
import { useClientCall } from "./hooks"
import { useAppContext } from "./AppProvider"

export default function ModelInstanceView({
  model,
  packageRoot: cwd,
  project,
  modelClass
}) {
  const [view, setView] = useState("source")
  const { toggleFilter, setContext, context } = useAppContext()
  const { loading, response } = useClientCall(() =>
    API.getModel({
      model,
      project
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
        <div className="p-4 border-b-2 border-slate-600 hover:bg-slate-600">
          <a onClick={() => setView("source")}>View Source</a>
        </div>
        <div className="p-4 border-b-2 border-slate-600 hover:bg-slate-600">
          <a onClick={() => API.openWithNative({ url: response.path })}>
            Open this Document in VSCode
          </a>
        </div>
        <div className="p-4 border-b-2 border-slate-600 hover:bg-slate-600">
          <a>Validate this Model</a>
        </div>
        <div className="p-4 border-b-2 border-slate-600 hover:bg-slate-600">
          <a onClick={() => setView("json")}>View JSON</a>
        </div>
        {modelClass.availableActions.map((action) => {
          const runModelAction = () => {
            API.runActiveMdxAction({
              cwd,
              actionName: action,
              models: [response.model.id],
              modulePath: "./content/index.mjs"
            })
          }
          return (
            <div
              key={action}
              onClick={runModelAction}
              className="p-4 border-b-2 border-slate-600 hover:bg-slate-600"
            >
              Run {action} action
            </div>
          )
        })}
      </div>
      <div className="w-3/5">
        {view === "source" && response?.document?.content && (
          <MarkdownEditor value={response.document.content} height="90vh" />
        )}
        {view === "json" && response?.model && (
          <pre>{JSON.stringify(response.model, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}

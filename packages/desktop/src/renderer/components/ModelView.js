import React, { useState, useEffect } from "react"
import { useAppContext } from "./AppProvider"
import { sortBy } from "lodash-es"
import NewDocument from "./NewDocument"
import SlidingDrawer from "./SlidingDrawer"

export default function ModelView(props = {}) {
  const {
    model,
    modelData = {},
    filter = "",
    onSelect,
    project,
    reload
  } = props
  const records = modelData[model.name] || []
  const { context, setContext, toggleFilter } = useAppContext()

  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    if (context.reload) {
      console.log("Reloading", context)
      Promise.resolve(reload()).then(() => {
        console.log("Reloaded")
        setContext({ ...context, reload: false })
      })
    }
  }, [context.reload])

  useEffect(() => {
    toggleFilter(true)
    setContext({
      ...context,
      breadcrumb: [
        {
          name: model.name,
          current: true
        }
      ]
    })
  }, [toggleFilter])

  const filterFn = (record) => {
    if (!filter.length) {
      return true
    }

    if (String(record.title).toLowerCase().includes(filter.toLowerCase())) {
      return true
    }

    if (String(record.id).toLowerCase().includes(filter.toLowerCase())) {
      return true
    }

    return false
  }

  return (
    <>
      <div className="flex p-10 text-white">
        <div className="w-3/4 pr-2">
          {sortBy(records.filter(filterFn), "title").map((record, index) => (
            <div
              onClick={() => onSelect(record)}
              key={index}
              className="py-2 border-b-slate-600 border-b-2 hover:bg-slate-600 cursor-pointer"
            >
              {record.title}
              <div className="text-slate-500">{record.id}</div>
            </div>
          ))}
        </div>
        <div className="w-1/4 text-white">
          <div
            onClick={() => setShowDrawer(true)}
            className="cursor-pointer p-4 border-b-2 border-slate-600 hover:bg-slate-600"
          >
            New {model.name}
          </div>
        </div>
      </div>
      {showDrawer && (
        <SlidingDrawer open={showDrawer} onClose={() => setShowDrawer(false)}>
          <NewDocument
            onClose={() => setShowDrawer(false)}
            model={model}
            onSubmit={(values = {}) =>
              API.createNewDocument({
                model,
                values,
                project
              }).then((response) => reload().then(() => response))
            }
          />
        </SlidingDrawer>
      )}
    </>
  )
}

import React, { useEffect } from "react"
import { useAppContext } from "./AppProvider"
import { sortBy } from "lodash-es"

export default function ModelView(props = {}) {
  const { model, modelData = {}, filter = "", onSelect } = props
  const records = modelData[model.name] || []
  const { context, setContext, toggleFilter } = useAppContext()

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
    <div className="flex p-10 text-white">
      <div className="w-3/4 pr-2">
        {sortBy(records.filter(filterFn), "title").map((record, index) => (
          <div
            onClick={() => onSelect(record)}
            key={index}
            className="py-2 border-b-slate-600 border-b-2"
          >
            {record.title}
            <div className="text-slate-500">{record.id}</div>
          </div>
        ))}
      </div>
      <div className="w-1/4">
        <a>New</a>
      </div>
    </div>
  )
}

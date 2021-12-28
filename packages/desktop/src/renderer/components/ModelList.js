import React, { useEffect } from "react"
import { useAppContext } from "./AppProvider"

const bgColors = [
  "bg-pink-600",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-green-500",
  "bg-red-600",
  "bg-orange-400",
  "bg-lime-400",
  "bg-teal-400",
  "bg-fuschia-500"
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function ModelList(props = {}) {
  const { models = [], onSelect, filter = "" } = props
  const { toggleFilter } = useAppContext()

  useEffect(() => {
    toggleFilter(true)
  }, [toggleFilter])

  return (
    <ul
      role="list"
      className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {models
        .filter(
          (model) =>
            !filter.length ||
            model.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((model, index) => (
          <li
            key={model.name}
            className="col-span-1 flex shadow-sm rounded-md"
            onClick={() => onSelect && onSelect(model)}
          >
            <div
              className={classNames(
                bgColors[index % bgColors.length],
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
              )}
            >
              {model.name[0]}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-slate-800 rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href="#" className="text-white font-medium">
                  {model.name}
                </a>
                <p className="text-gray-500">
                  {model.matchingPaths?.length || 0} Item(s)
                </p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <button
                  type="button"
                  className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open options</span>
                  {/*<DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />*/}
                </button>
              </div>
            </div>
          </li>
        ))}
    </ul>
  )
}

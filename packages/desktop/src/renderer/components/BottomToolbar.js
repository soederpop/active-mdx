import React from "react"
import { useAppContext } from "./AppProvider"
import { HomeIcon } from "@heroicons/react/solid"

export default function ToolbarWrapper(props = {}) {
  return (
    <div className="p-4">
      <BottomToolbar />
    </div>
  )
}

export function BottomToolbar() {
  const { setActiveProject, context, setContext, activeProject } =
    useAppContext()

  const { breadcrumb } = context

  if (!activeProject) {
    return <div />
  }

  const pages = []

  if (activeProject) {
    pages.push({
      name: activeProject.name,
      current: !breadcrumb,
      onClick: () => setContext({ screen: "main" })
    })
  }

  if (breadcrumb) {
    pages.push(...breadcrumb)
  }

  return (
    <nav className="bg-slate-900  flex" aria-label="Breadcrumb">
      <ol
        role="list"
        className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4 sm:px-6 lg:px-8"
      >
        <li className="flex">
          <div className="flex items-center">
            <a
              onClick={() => setActiveProject(undefined)}
              className="text-gray-400 hover:text-gray-500"
            >
              <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page, index) => (
          <li key={page.index + page.name} className="flex">
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 w-6 h-full text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <a
                onClick={page.onClick}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

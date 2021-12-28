import React, { useEffect } from "react"
import { useClientCall } from "./hooks"
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

export default function ListProjects({
  title = "Your Projects",
  filter = "",
  onSelectProject
}) {
  const { loading, response = {} } = useClientCall(() => API.listProjects())
  const { setContext } = useAppContext()

  useEffect(() => {
    setContext({ screen: "main" })
    API.updateWindow({ profile: "main" })
  }, [])

  const projects = (response.projects || [])
    .map((project, index) => ({
      ...project,
      path: project.path.replace(/\/Users\/\w+\//, "~/"),
      bgColor: bgColors[index % bgColors.length],
      initials: toInitials(project.name)
    }))
    .filter((project) =>
      filter.length
        ? project.name.toLowerCase().includes(filter.toLowerCase())
        : true
    )

  if (loading) {
    return <div className="p-10">Loading</div>
  }

  if (!projects.length) {
    return <div>Empty</div>
  }

  return (
    <div className="p-10">
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {title}
      </h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {projects.map((project) => (
          <li
            key={project.name}
            className="col-span-1 flex shadow-sm rounded-md"
            onClick={() => onSelectProject(project)}
          >
            <div
              className={classNames(
                project.bgColor,
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
              )}
            >
              {project.initials}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-slate-800 rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href={project.href} className="text-white font-medium">
                  {project.name}
                </a>
                <p className="text-gray-500">{project.path}</p>
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
    </div>
  )
}

function toInitials(name) {
  const parts = name.split(" ")

  return parts.length > 1
    ? parts
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : `${name[0]}${name[1]}`.toUpperCase()
}

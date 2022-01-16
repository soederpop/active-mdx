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
  const { loading, response = [] } = useClientCall(() => API.listProjects())
  const { setContext } = useAppContext()

  useEffect(() => {
    setContext({ screen: "main" })
    API.updateWindow({ profile: "main" })
  }, [])

  const projects = response
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
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-4">
        Project Actions
      </h2>
      <div className="flex mx-auto mt-4">
        <div className="w-1/2 pr-4">
          <CreateNewProject />
        </div>
        <div className="w-1/2 pl-4">
          <ImportExistingProject />
        </div>
      </div>
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

export function ImportExistingProject() {
  function handleNewProject() {
    return API.openDirectory().then((result) => {
      console.log("Result", result)
    })
  }

  return (
    <button
      type="button"
      className="relative block w-full border-2 border-slate-300 border-dashed rounded-lg p-12 text-center hover:border-slate-400 focus:outline-none"
      onClick={handleNewProject}
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
        />
      </svg>
      <span className="mt-2 block text-sm font-medium text-slate-300">
        Import Project
      </span>
    </button>
  )
}

export function CreateNewProject() {
  function handleNewProject() {
    return API.openDirectory().then((result) => {
      console.log("Result", result)
    })
  }

  return (
    <button
      type="button"
      className="relative block w-full border-2 border-slate-300 border-dashed rounded-lg p-12 text-center hover:border-slate-400 focus:outline-none"
      onClick={handleNewProject}
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
        />
      </svg>
      <span className="mt-2 block text-sm font-medium text-slate-300">
        Create a new project
      </span>
    </button>
  )
}

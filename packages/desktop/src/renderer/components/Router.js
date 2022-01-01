import React, { useEffect } from "react"
import { useAppContext } from "./AppProvider"
import ListProjects, { CreateNewProject } from "./ListProjects"
import ProjectHome from "./ProjectHome"

export default function Router(props = {}) {
  const { activeProject, setActiveProject, filter, context } = useAppContext()

  const { screen } = context

  useEffect(() => {
    API.showCurrentWindow()
  }, [])

  if (!activeProject) {
    return (
      <>
        <ListProjects
          onSelectProject={(project) => {
            setActiveProject(project)
          }}
        />
        <div className="w-1/2 mx-auto">
          <CreateNewProject />
        </div>
      </>
    )
  } else {
    return <ProjectHome project={activeProject} />
  }
}

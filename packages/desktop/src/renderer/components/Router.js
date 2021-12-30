import React, { useEffect } from "react"
import { useAppContext } from "./AppProvider"
import ListProjects from "./ListProjects"
import ProjectHome from "./ProjectHome"

export default function Router(props = {}) {
  const { activeProject, setActiveProject, filter, context } = useAppContext()

  const { screen } = context

  useEffect(() => {
    API.showCurrentWindow()
  }, [])

  if (!activeProject) {
    return (
      <ListProjects
        onSelectProject={(project) => {
          setActiveProject(project)
        }}
      />
    )
  } else {
    return <ProjectHome project={activeProject} />
  }
}

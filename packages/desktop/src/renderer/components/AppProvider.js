import React, { useState, useContext } from "react"

const Context = React.createContext()

export default function AppProvider(props) {
  const local = localStorage.getItem("activeProject")?.startsWith("{")
    ? JSON.parse(localStorage.getItem("activeProject"))
    : null
  const [activeProject, setActiveProject] = useState(local)
  const [context, setContext] = useState({
    screen: "main"
  })

  function updateActiveProject(nextValue) {
    setActiveProject(nextValue)

    if (nextValue) {
      localStorage.setItem("activeProject", JSON.stringify(nextValue))
    } else {
      localStorage.removeItem("activeProject")
    }
  }

  return (
    <Context.Provider
      value={{
        activeProject,
        setActiveProject: updateActiveProject,
        context,
        setContext,
        ...props
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export function useAppContext(props) {
  return useContext(Context)
}

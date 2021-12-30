import React, { useState } from "react"
import AppProvider from "./components/AppProvider"
import MainInput from "./components/MainInput"
import Router from "./components/Router"
import BottomToolbar from "./components/BottomToolbar"

export default function App() {
  const [filter, setFilter] = useState("")
  const [showFilter, setShowFilter] = useState(true)

  return (
    <AppProvider
      filter={filter}
      clearFilter={() => setFilter("")}
      toggleFilter={(nextState = !showFilter) => setShowFilter(nextState)}
    >
      <div
        className="bg-slate-900 text-slate-50 flex flex-col min-h-screen"
        style={{ height: "100vh", width: "100%" }}
      >
        <MainInput value={filter} onChange={(e) => setFilter(e.target.value)} />
        <div
          className="flex-grow"
          style={{ maxHeight: "90vh", overflowY: "scroll" }}
        >
          <Router />
        </div>
        <BottomToolbar />
      </div>
    </AppProvider>
  )
}

"use client"

import { createContext, useContext, useState } from "react"

const AppStateContext = createContext<any>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState([])

  return (
    <AppStateContext.Provider value={{ reports, setReports }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  return useContext(AppStateContext)
}
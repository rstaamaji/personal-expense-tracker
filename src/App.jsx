import React from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Background3D from './components/Background3D'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Background3D />
      <div className="app-container">
        <Navbar
          activeRoute="dashboard"
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="main-content-wrapper">
          <Dashboard />
        </main>
      </div>
    </>
  )
}

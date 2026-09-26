import React from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="app-container">
      <Navbar activeRoute="dashboard" />
      <main className="main-content-wrapper">
        <Dashboard />
      </main>
    </div>
  )
}

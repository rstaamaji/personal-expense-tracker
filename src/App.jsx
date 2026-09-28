import React from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import Background3D from './components/Background3D'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-muted)',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div
          className="auth-spinner"
          style={{
            width: '36px',
            height: '36px',
            borderWidth: '3px',
            borderColor: 'rgba(139, 92, 246, 0.2)',
            borderTopColor: 'var(--cyan)',
          }}
        />
        <span
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-subtle)',
          }}
        >
          Connecting to Vision Intelligence...
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div className="app-container">
      <Navbar activeRoute="dashboard" />
      <main className="main-content-wrapper">
        <Dashboard />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Background3D />
      <AppContent />
    </AuthProvider>
  )
}

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LoadingSpinner } from './components/common/LoadingSpinner'

// Pages
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DumpPage } from './pages/DumpPage'
import { HistoryPage } from './pages/HistoryPage'
import { DumpDetailPage } from './pages/DumpDetailPage'
import { SummariesPage } from './pages/SummariesPage'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public Route Component (redirect to home if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DumpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dump/:id"
          element={
            <ProtectedRoute>
              <DumpDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summaries"
          element={
            <ProtectedRoute>
              <SummariesPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

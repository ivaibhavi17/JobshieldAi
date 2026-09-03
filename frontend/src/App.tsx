import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppHeader from './components/layout/AppHeader'
import PageIndex from './components/layout/PageIndex'
import AnalyzePage from './pages/AnalyzePage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import LandingPage from './pages/LandingPage'
import ModelPerformancePage from './pages/ModelPerformancePage'
import ReportPage from './pages/ReportPage'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return null
}

function AppShell() {
  return (
    <div className="app-page">
      <AppHeader />
      <div className="app-frame">
        <PageIndex />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/analysis/:id" element={<ReportPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/model-performance" element={<ModelPerformancePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <footer className="page-footer">
            <span className="page-footer__brand">JobShield AI</span>
            <span>Check Before You Apply. · AI-assisted risk assessment · Always independently verify the employer.</span>
            <span className="mono-type">Demo Data / 2026</span>
          </footer>
        </main>
      </div>
      <ScrollToTop />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App

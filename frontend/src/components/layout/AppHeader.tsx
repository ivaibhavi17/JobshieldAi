import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthModal } from '../AuthModal'
import { apiClient, removeAuthToken, getAuthToken } from '../../api/client'
import type { User } from '../../types/api'

const navItems = [
  { label: 'Analyze', to: '/analyze' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'History', to: '/history' },
  { label: 'Model performance', to: '/model-performance' },
]

function AppHeader() {
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (getAuthToken()) {
      apiClient.getMe()
        .then(setUser)
        .catch(() => removeAuthToken())
    }
  }, [])

  const handleSignOut = () => {
    removeAuthToken()
    setUser(null)
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="brand-lockup" to="/" aria-label="JobShield AI home">
          <span className="brand-lockup__title display-type">JobShield AI</span>
          <span className="brand-lockup__divider" aria-hidden="true" />
          <span className="brand-lockup__tagline">Check Before You Apply.</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <div className="primary-nav__links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `primary-nav__link${isActive ? ' primary-nav__link--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>
                  👤 {user.fullName || user.email.split('@')[0]}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '4px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                style={{
                  background: 'var(--color-primary, #3b82f6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign In / Pro
              </button>
            )}
          </div>
        </nav>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
    </header>
  )
}

export default AppHeader

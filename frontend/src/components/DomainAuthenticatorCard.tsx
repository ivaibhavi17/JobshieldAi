import React, { useState } from 'react'
import { apiClient } from '../api/client'
import type { DomainVerificationResult } from '../types/api'

export const DomainAuthenticatorCard: React.FC = () => {
  const [input, setInput] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DomainVerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await apiClient.verifyDomain({
        emailOrDomain: input.trim(),
        companyWebsite: website.trim(),
      })
      setResult(res)
    } catch (err: any) {
      setError(err?.message || 'Failed to verify domain security.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--color-bg-card, #111827)',
      border: '1px solid var(--color-border, #1f2937)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🕵️</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text, #f9fafb)' }}>
          Recruiter Email & Domain Authenticator
        </h3>
        <span style={{
          background: 'rgba(59, 130, 246, 0.2)',
          color: '#60a5fa',
          fontSize: '0.7rem',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          Pro Security
        </span>
      </div>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted, #9ca3af)' }}>
        Verify recruiter emails (e.g., <code>recruiter@google-careers-india.com</code>) to detect domain spoofing, typosquatting, and unverified webmail providers.
      </p>

      <form onSubmit={handleVerify} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Recruiter Email or Domain (e.g. hr@company.com)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          style={{
            background: 'var(--color-bg-input, #1f2937)',
            border: '1px solid var(--color-border, #374151)',
            color: '#fff',
            borderRadius: '6px',
            padding: '0.6rem 0.8rem',
            fontSize: '0.875rem'
          }}
        />
        <input
          type="text"
          placeholder="Official Company Website (Optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{
            background: 'var(--color-bg-input, #1f2937)',
            border: '1px solid var(--color-border, #374151)',
            color: '#fff',
            borderRadius: '6px',
            padding: '0.6rem 0.8rem',
            fontSize: '0.875rem'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--color-primary, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.2rem',
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {loading ? 'Scanning...' : 'Verify Domain'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: '#f87171', fontSize: '0.875rem' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background: result.isSpoofed || result.riskLevel === 'VERY HIGH'
            ? 'rgba(239, 68, 68, 0.15)'
            : result.isFreeWebmail
            ? 'rgba(245, 158, 11, 0.15)'
            : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${
            result.isSpoofed || result.riskLevel === 'VERY HIGH'
              ? '#ef4444'
              : result.isFreeWebmail
              ? '#f59e0b'
              : '#10b981'
          }`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {result.isSpoofed ? '🚨 DOMAIN SPOOFING DETECTED' : result.isFreeWebmail ? '⚠️ UNVERIFIED FREE WEBMAIL' : '✅ AUTHENTIC DOMAIN'}
            </span>
            <span style={{
              background: result.isSpoofed ? '#ef4444' : result.isFreeWebmail ? '#f59e0b' : '#10b981',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '4px'
            }}>
              {result.riskLevel} RISK
            </span>
          </div>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#e5e7eb' }}>
            {result.explanation}
          </p>
          {result.targetBrand && (
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              <strong>Imitated Brand:</strong> {result.targetBrand}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

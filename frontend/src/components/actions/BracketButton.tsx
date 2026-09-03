import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface BracketButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  tone?: 'rust' | 'blue'
}

function BracketButton({ children, loading = false, tone = 'rust', disabled, ...props }: BracketButtonProps) {
  return (
    <button className={`bracket-button${tone === 'blue' ? ' bracket-button--secondary' : ''}`} disabled={disabled || loading} {...props}>
      {loading ? 'Analyzing…' : children}
      {!loading ? <span className="bracket-button__arrow" aria-hidden="true">→</span> : null}
    </button>
  )
}

export default BracketButton

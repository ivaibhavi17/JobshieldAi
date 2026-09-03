import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  copy: string
  action?: ReactNode
}

function EmptyState({ title, copy, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__copy">{copy}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}

export default EmptyState

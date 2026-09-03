import { useEffect, useRef } from 'react'
import BracketButton from '../actions/BracketButton'

interface DeleteAnalysisDialogProps {
  jobTitle: string
  onCancel: () => void
  onConfirm: () => void
}

function DeleteAnalysisDialog({ jobTitle, onCancel, onConfirm }: DeleteAnalysisDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-analysis-title">
        <p className="section-kicker section-kicker--rust">Destructive action</p>
        <h2 className="confirm-dialog__title" id="delete-analysis-title">Delete this analysis?</h2>
        <p className="confirm-dialog__copy">“{jobTitle}” will be removed from stored history. This does not change any external job posting.</p>
        <div className="confirm-dialog__actions">
          <button className="text-link" type="button" ref={cancelRef} onClick={onCancel}>Cancel</button>
          <BracketButton type="button" onClick={onConfirm}>Confirm delete</BracketButton>
        </div>
      </div>
    </div>
  )
}

export default DeleteAnalysisDialog

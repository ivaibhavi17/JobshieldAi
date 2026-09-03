import { useState } from 'react'
import SectionHeader from '../components/layout/SectionHeader'
import HistoryTable from '../components/history/HistoryTable'
import DeleteAnalysisDialog from '../components/history/DeleteAnalysisDialog'
import ErrorBanner from '../components/ui/ErrorBanner'
import EmptyState from '../components/ui/EmptyState'
import BracketButton from '../components/actions/BracketButton'
import { apiClient } from '../api/client'
import { useHistory } from '../hooks/useHistory'
import type { HistoryRow } from '../types/api'

function downloadFallback(row: HistoryRow) {
  const contents = [
    'JobShield AI · AI-assisted preliminary risk assessment',
    `Job title: ${row.jobTitle}`,
    `Company: ${row.companyName}`,
    `Risk score: ${row.riskScore} / 100`,
    `Risk level: ${row.riskLevel}`,
    `Status: ${row.status}`,
    '',
    'Always independently verify the employer before taking action.',
  ].join('\n')
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `jobshield-report-${row.id}.txt`
  anchor.click()
  URL.revokeObjectURL(url)
}

function HistoryPage() {
  const { items, setItems, error } = useHistory()
  const [expandedId, setExpandedId] = useState<number | null>(items[0]?.id ?? null)
  const [deleteTarget, setDeleteTarget] = useState<HistoryRow | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  async function handleExport(row: HistoryRow) {
    try {
      const response = await apiClient.exportReport(row.id)
      if (!response.ok) throw new Error('Export unavailable')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `jobshield-report-${row.id}.txt`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch {
      downloadFallback(row)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await apiClient.deleteAnalysis(deleteTarget.id)
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setMutationError('Deletion did not complete. The analysis remains visible.')
      setDeleteTarget(null)
    }
  }

  return (
    <section className="page-section page-section--first" id="history">
      <SectionHeader kicker="05 / record book · Demo Data" title="Past analyses" description="Compare prior assessments, open a full report, or export a readable copy. Delete remains separate from review actions." />
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      {mutationError ? <ErrorBanner>{mutationError}</ErrorBanner> : null}
      {items.length ? <HistoryTable items={items} expandedId={expandedId} onTogglePreview={setExpandedId} onDelete={setDeleteTarget} onExport={handleExport} /> : <EmptyState title="No jobs analyzed yet" copy="Start with a posting to create your first assessment record." action={<BracketButton type="button" onClick={() => window.location.assign('/analyze')}>Analyze a job</BracketButton>} />}
      {deleteTarget ? <DeleteAnalysisDialog jobTitle={deleteTarget.jobTitle} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
    </section>
  )
}

export default HistoryPage

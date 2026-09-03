import { Link } from 'react-router-dom'
import HistoryRowPreview from './HistoryRowPreview'
import Icon from '../ui/Icon'
import { formatDate, formatRiskScore, RISK_LEVEL_META } from '../../types/api'
import type { HistoryRow } from '../../types/api'

interface HistoryTableProps {
  items: HistoryRow[]
  expandedId: number | null
  onTogglePreview: (id: number | null) => void
  onDelete: (row: HistoryRow) => void
  onExport: (row: HistoryRow) => void
}

function HistoryTable({ items, expandedId, onTogglePreview, onDelete, onExport }: HistoryTableProps) {
  return (
    <div className="table-shell">
      <div className="table-shell__header">
        <div>
          <p className="label-mono">Archive / {items.length} records</p>
          <h3 className="table-shell__title">Assessment history</h3>
        </div>
        <span className="label-mono muted-copy">Select a row to preview evidence</span>
      </div>
      <div className="history-table-wrap">
        <table className="history-table">
          <caption className="sr-only">Past JobShield AI analyses</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Job title</th>
              <th scope="col">Risk score</th>
              <th scope="col">Risk level</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const meta = RISK_LEVEL_META[row.riskLevel]
              return (
                <HistoryTableRow key={row.id} row={row} expanded={expandedId === row.id} meta={meta} onTogglePreview={onTogglePreview} onDelete={onDelete} onExport={onExport} />
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="table-shell__note"><span className="label-mono">Note</span> Delete and export controls remain separate from report review actions. Demo rows are labeled and do not represent a trained model’s performance.</p>
    </div>
  )
}

interface HistoryTableRowProps {
  row: HistoryRow
  expanded: boolean
  meta: { label: string; color: string; range: string }
  onTogglePreview: (id: number | null) => void
  onDelete: (row: HistoryRow) => void
  onExport: (row: HistoryRow) => void
}

function HistoryTableRow({ row, expanded, meta, onTogglePreview, onDelete, onExport }: HistoryTableRowProps) {
  return (
    <>
      <tr className="history-table__row">
        <td className="history-table__id">{String(row.id).padStart(4, '0')}</td>
        <td>
          <button className="history-table__title-button" type="button" onClick={() => onTogglePreview(expanded ? null : row.id)} aria-expanded={expanded}>
            <span className="history-table__title">{row.jobTitle}</span>
            <span className="history-table__company">{row.companyName}</span>
          </button>
        </td>
        <td className="history-table__score" style={{ color: meta.color }}>{formatRiskScore(row.riskScore)}</td>
        <td><span className="history-table__level" style={{ color: meta.color }}>{meta.label}</span><span className="history-table__company">{row.riskLevel === 'LOW' ? 'Lower risk indicators' : 'Potentially suspicious'}</span></td>
        <td className="history-table__date">{formatDate(row.date)}</td>
        <td><span className="history-table__status">{row.status === 'ANALYZED' ? 'Analyzed' : row.status}</span>{row.demoMode ? <span className="history-table__demo">Demo Data</span> : null}</td>
        <td>
          <div className="table-actions">
            <Link className="table-actions__open" to={`/analysis/${row.id}`}>Open full report</Link>
            <button className="table-actions__button" type="button" onClick={() => onExport(row)}><Icon name="download" size={16} color="var(--color-editorial-blue)" /> Export</button>
            <span className="table-actions__divider" aria-hidden="true" />
            <button className="table-actions__button table-actions__button--danger" type="button" onClick={() => onDelete(row)}><Icon name="trash" size={16} /> Delete analysis</button>
          </div>
        </td>
      </tr>
      {expanded ? <HistoryRowPreview row={row} /> : null}
    </>
  )
}

export default HistoryTable

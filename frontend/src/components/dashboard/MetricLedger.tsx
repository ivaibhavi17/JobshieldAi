import type { DashboardData } from '../../types/api'

interface MetricLedgerProps {
  totals: DashboardData['totals']
}

const metrics = [
  { key: 'analyzed', label: 'Jobs analyzed', className: '' },
  { key: 'low', label: 'Low risk', className: 'metric-ledger__value--low' },
  { key: 'moderate', label: 'Moderate', className: 'metric-ledger__value--moderate' },
  { key: 'high', label: 'High', className: 'metric-ledger__value--high' },
  { key: 'veryHigh', label: 'Very high', className: 'metric-ledger__value--very-high' },
] as const

function MetricLedger({ totals }: MetricLedgerProps) {
  return (
    <div className="metric-ledger" aria-label="Analysis totals">
      {metrics.map((metric) => (
        <div className="metric-ledger__item" key={metric.key}>
          <span className="metric-ledger__label">{metric.label}</span>
          <p className={`metric-ledger__value ${metric.className}`}>{String(totals[metric.key]).padStart(2, '0')}</p>
        </div>
      ))}
    </div>
  )
}

export default MetricLedger

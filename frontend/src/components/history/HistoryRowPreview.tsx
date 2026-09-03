import { formatIndicatorCategory } from '../../types/api'
import type { HistoryRow } from '../../types/api'

interface HistoryRowPreviewProps {
  row: HistoryRow
}

function HistoryRowPreview({ row }: HistoryRowPreviewProps) {
  return (
    <tr className="history-preview">
      <td colSpan={7}>
        <div className="history-preview__grid">
          <div>
            <p className="label-mono history-preview__label">Expanded evidence preview</p>
            <p className="history-preview__copy">{row.indicators.length ? `${row.indicators.length} indicators linked to submitted text` : 'No listed warning signs were detected in this posting.'}</p>
          </div>
          <div>
            <p className="label-mono history-preview__label">Why it matters</p>
            <p className="history-preview__copy">{row.indicators.length ? row.indicators.slice(0, 2).map((indicator) => `${formatIndicatorCategory(indicator.category)} · “${indicator.matchedPhrase ?? indicator.title}”`).join(' · ') : row.explanation}</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default HistoryRowPreview

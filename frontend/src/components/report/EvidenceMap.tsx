import { useMemo, useState } from 'react'
import { formatIndicatorCategory } from '../../types/api'
import type { AssessmentReport, Indicator } from '../../types/api'

interface EvidenceMapProps {
  report: AssessmentReport
}

function EvidenceText({ text, indicators, activeId, onFocus }: { text: string; indicators: Indicator[]; activeId: string | null; onFocus: (id: string) => void }) {
  const matches = useMemo(() => {
    const usable = indicators
      .filter((indicator) => indicator.matchedPhrase)
      .map((indicator) => ({ indicator, phrase: indicator.matchedPhrase ?? '' }))
      .sort((a, b) => text.toLowerCase().indexOf(a.phrase.toLowerCase()) - text.toLowerCase().indexOf(b.phrase.toLowerCase()))
    const parts: Array<{ text: string; indicator?: Indicator; reference?: number }> = []
    let cursor = 0

    usable.forEach(({ indicator, phrase }, indicatorIndex) => {
      const start = text.toLowerCase().indexOf(phrase.toLowerCase(), cursor)
      if (start < cursor) return
      if (start > cursor) parts.push({ text: text.slice(cursor, start) })
      parts.push({ text: text.slice(start, start + phrase.length), indicator, reference: indicatorIndex + 1 })
      cursor = start + phrase.length
    })
    if (cursor < text.length) parts.push({ text: text.slice(cursor) })
    return parts.length ? parts : [{ text }]
  }, [indicators, text])

  return (
    <p>
      {matches.map((part, index) => part.indicator ? (
        <button
          type="button"
          className={`evidence-highlight${activeId === part.indicator.id ? ' evidence-highlight--active' : ''}`}
          key={`${part.indicator.id}-${index}`}
          onMouseEnter={() => onFocus(part.indicator?.id ?? '')}
          onFocus={() => onFocus(part.indicator?.id ?? '')}
          onClick={() => onFocus(part.indicator?.id ?? '')}
          aria-label={`Evidence ${index + 1}: ${part.text}`}
        >
          {part.text}<sup>{String(part.reference ?? index + 1).padStart(2, '0')}</sup>
        </button>
      ) : <span key={`text-${index}`}>{part.text}</span>)}
    </p>
  )
}

function EvidenceMap({ report }: EvidenceMapProps) {
  const [activeId, setActiveId] = useState<string | null>(report.indicators[0]?.id ?? null)
  return (
    <div className="evidence-map">
      <article className="evidence-sheet">
        <div className="evidence-sheet__header">
          <div>
            <p className="label-mono">Source sheet / posting-{String(report.id).padStart(4, '0')}</p>
            <h3 className="evidence-sheet__title">{report.jobTitle}</h3>
            <p className="muted-copy">{report.companyName} · Remote · Entry level</p>
          </div>
          <div className="source-sheet__meta">{report.demoMode ? 'Demo Data' : 'Submitted'}<br />p. 01 / 01</div>
        </div>
        <div className="evidence-sheet__content">
          <EvidenceText text={report.reviewedText} indicators={report.indicators} activeId={activeId} onFocus={setActiveId} />
        </div>
        <div className="evidence-sheet__footer">
          <span>Input: {report.sourceType} · extracted text editable</span>
          <span>{new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(report.createdAt))} · source retained for review</span>
        </div>
      </article>
      <aside className="evidence-notes" aria-label="Evidence found">
        <div className="evidence-notes__heading">
          <p className="label-mono">Right margin / linked findings</p>
          <h3 className="evidence-sheet__title">Evidence found</h3>
          <span className="label-mono muted-copy">{report.indicators.length} notes</span>
        </div>
        {report.indicators.length ? report.indicators.map((indicator, index) => (
          <article className={`evidence-note${activeId === indicator.id ? ' evidence-note--active' : ''}`} key={indicator.id} onMouseEnter={() => setActiveId(indicator.id)}>
            <div>
              <span className="evidence-note__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="evidence-note__category">{formatIndicatorCategory(indicator.category)}</span>
            </div>
            <p className="evidence-note__phrase">Matched phrase: “{indicator.matchedPhrase ?? 'pattern detected'}”</p>
            <p className="evidence-note__copy">{indicator.explanation}</p>
          </article>
        )) : <p className="empty-state__copy">No listed warning signs were detected in this posting.</p>}
      </aside>
    </div>
  )
}

export default EvidenceMap

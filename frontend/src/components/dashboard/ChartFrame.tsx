import type { ReactNode } from 'react'

interface ChartFrameProps {
  title: string
  meta: string
  summary: string
  children: ReactNode
  wide?: boolean
}

function ChartFrame({ title, meta, summary, children, wide = false }: ChartFrameProps) {
  return (
    <article className={`chart-frame${wide ? ' chart-frame--wide' : ''}`}>
      <div className="chart-frame__heading">
        <h3 className="chart-frame__title">{title}</h3>
        <span className="chart-frame__meta">{meta}</span>
      </div>
      <div className="chart-frame__plot">{children}</div>
      <p className="chart-frame__summary">{summary}</p>
    </article>
  )
}

export default ChartFrame

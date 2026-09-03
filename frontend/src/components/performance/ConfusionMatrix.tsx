import type { ConfusionMatrixData } from '../../types/api'

interface ConfusionMatrixProps {
  matrix: ConfusionMatrixData | null
}

function ConfusionMatrix({ matrix }: ConfusionMatrixProps) {
  const labels = matrix?.labels ?? ['Lower risk', 'Suspicious']
  const values = matrix?.values ?? [[null, null], [null, null]]
  return (
    <article>
      <p className="section-kicker">Actual output</p>
      <h3 className="performance-note__title confusion-heading">Confusion matrix</h3>
      <p className="confusion-description">The matrix stays unavailable until a trained model produces evaluation output.</p>
      <div className="confusion-matrix" role="table" aria-label="Confusion matrix">
        <div aria-hidden="true" />
        <div>Pred. lower</div>
        <div>Pred. suspicious</div>
        <div className="confusion-matrix__row-label">Actual lower</div>
        <div>{values[0]?.[0] ?? '—'}</div>
        <div>{values[0]?.[1] ?? '—'}</div>
        <div className="confusion-matrix__row-label">Actual suspicious</div>
        <div>{values[1]?.[0] ?? '—'}</div>
        <div>{values[1]?.[1] ?? '—'}</div>
      </div>
      <div className="confusion-label-note"><span>Rows: actual label</span><span>Columns: model prediction</span><span>{labels.join(' · ')}</span></div>
    </article>
  )
}

export default ConfusionMatrix

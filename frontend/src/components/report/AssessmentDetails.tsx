import { formatConfidence, formatIndicatorCategory } from '../../types/api'
import type { AssessmentReport } from '../../types/api'

interface AssessmentDetailsProps {
  report: AssessmentReport
}

function AssessmentDetails({ report }: AssessmentDetailsProps) {
  return (
    <section className="assessment-details">
      <div className="assessment-details__header">
        <h3 className="assessment-details__title">Assessment details</h3>
        <span className="label-mono muted-copy">technical context</span>
      </div>
      <div className="assessment-detail-row">
        <span>Classification</span>
        <span className="assessment-detail-row__value assessment-detail-row__value--accent">{report.prediction === 'SUSPICIOUS' ? 'Potentially suspicious' : 'Lower risk pattern'}</span>
      </div>
      <div className="assessment-detail-row">
        <span>Indicators</span>
        <span className="assessment-detail-row__value">{report.indicators.length} listed matches</span>
      </div>
      <div className="assessment-detail-row">
        <span>Categories</span>
        <span className="assessment-detail-row__value">{new Set(report.indicators.map((indicator) => formatIndicatorCategory(indicator.category))).size}</span>
      </div>
      <div className="assessment-detail-row">
        <span>Confidence</span>
        <span className="assessment-detail-row__value">{formatConfidence(report.confidence)}</span>
      </div>
      <div className="assessment-detail-row">
        <span>Mode</span>
        <span className="assessment-detail-row__value">{report.demoMode ? 'Demo Data' : 'Model connected'}</span>
      </div>
    </section>
  )
}

export default AssessmentDetails

import { RISK_LEVEL_META, formatRiskScore } from '../../types/api'
import type { AssessmentReport } from '../../types/api'
import RiskScale from './RiskScale'

interface RiskSummaryProps {
  report: AssessmentReport
}

function RiskSummary({ report }: RiskSummaryProps) {
  const meta = RISK_LEVEL_META[report.riskLevel]
  return (
    <>
      <div className="report-heading-row">
        <div>
          <p className="section-kicker">03 / explainable result · {report.demoMode ? 'Demo Data' : 'connected model'}</p>
          <h2 className="page-section__title">Risk summary</h2>
        </div>
        <div className="risk-summary__score bracketed" aria-label={`${formatRiskScore(report.riskScore)}, ${meta.label}`}>
          <span className="risk-summary__number">{formatRiskScore(report.riskScore)}</span>
          <span className="risk-summary__label">{meta.label} · {report.prediction === 'SUSPICIOUS' ? 'Potentially suspicious' : 'Lower risk indicators'}</span>
        </div>
      </div>
      <RiskScale score={report.riskScore} level={report.riskLevel} />
      <div className="report-intro">
        <div className="report-intro__line">
          <span>This posting contains signals that warrant extra verification before you continue.</span>
          <span className="report-intro__meta">AI-assisted risk assessment<br />{report.confidence == null ? 'Confidence is unavailable for this assessment.' : `${Math.round(report.confidence * 100)}% model confidence`}</span>
        </div>
      </div>
    </>
  )
}

export default RiskSummary

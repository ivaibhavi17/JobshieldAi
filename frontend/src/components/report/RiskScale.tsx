import type { RiskLevel } from '../../types/api'
import { RISK_LEVEL_META } from '../../types/api'

interface RiskScaleProps {
  score: number
  level: RiskLevel
}

function RiskScale({ score, level }: RiskScaleProps) {
  const position = Math.min(100, Math.max(0, score))
  return (
    <div className="risk-scale" aria-label={`Risk scale, ${score} out of 100, ${RISK_LEVEL_META[level].label}`}>
      <div className="risk-scale__track" aria-hidden="true">
        <span className="risk-scale__segment risk-scale__segment--low" />
        <span className="risk-scale__segment risk-scale__segment--moderate" />
        <span className="risk-scale__segment risk-scale__segment--high" />
        <span className="risk-scale__segment risk-scale__segment--very-high" />
      </div>
      <div className="risk-scale__marker-wrap" aria-hidden="true">
        <span className="risk-scale__marker" style={{ left: `${position}%` }} />
      </div>
      <div className="risk-scale__labels">
        <span style={{ color: 'var(--color-low)' }}>Low</span>
        <span style={{ color: 'var(--color-moderate)' }}>Moderate</span>
        <span style={{ color: 'var(--color-high)' }}>High</span>
        <span style={{ color: 'var(--color-very-high)' }}>Very High</span>
      </div>
      <div className="risk-scale__thresholds">
        <span>0–30</span>
        <span>31–60</span>
        <span>61–80</span>
        <span>81–100</span>
      </div>
    </div>
  )
}

export default RiskScale

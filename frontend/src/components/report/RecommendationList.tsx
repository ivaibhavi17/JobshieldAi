import { useState } from 'react'
import type { Recommendation } from '../../types/api'

interface RecommendationListProps {
  recommendations: Recommendation[]
}

function RecommendationList({ recommendations }: RecommendationListProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  return (
    <section className="recommendation-list">
      <div className="recommendation-list__header">
        <h3 className="recommendation-list__title">Recommended actions</h3>
        <span className="label-mono muted-copy">Reading aid · local only</span>
      </div>
      {recommendations.map((recommendation) => (
        <label className={`recommendation-row${checked[recommendation.id] ? ' recommendation-row--checked' : ''}`} key={recommendation.id}>
          <input type="checkbox" checked={Boolean(checked[recommendation.id])} onChange={(event) => setChecked((previous) => ({ ...previous, [recommendation.id]: event.target.checked }))} />
          <span>{recommendation.text}</span>
        </label>
      ))}
    </section>
  )
}

export default RecommendationList

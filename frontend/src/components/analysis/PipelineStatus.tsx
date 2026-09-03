import Icon from '../ui/Icon'
import { PIPELINE_STAGES } from '../../types/api'
import type { PipelineStageResult } from '../../types/api'

interface PipelineStatusProps {
  stages: PipelineStageResult[]
}

const stageCopy: Record<string, string> = {
  text_extraction: 'Read the submitted source',
  preprocessing: 'Clean and normalize text',
  feature_extraction: 'Prepare language features',
  classification: 'Apply available model',
  score_calculation: 'Combine score signals',
  indicator_detection: 'Match listed warning signs',
  explanation: 'Write plain-language context',
  recommendations: 'Suggest practical checks',
}

function PipelineStatus({ stages }: PipelineStatusProps) {
  return (
    <div className="pipeline-status" aria-live="polite">
      <div className="section-intro-row">
        <h3 className="subsection-title">Processing path</h3>
        <span className="label-mono muted-copy">8 stages</span>
      </div>
      <ol className="pipeline-list">
        {PIPELINE_STAGES.map((stage, index) => {
          const result = stages.find((item) => item.stage === stage.id)
          const state = result?.state ?? 'PENDING'
          return (
            <li className={`pipeline-list__item pipeline-list__item--${state.toLowerCase()}`} key={stage.id}>
              <span className="pipeline-list__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="pipeline-list__marker" aria-hidden="true">
                {state === 'COMPLETE' ? <Icon name="check" size={15} /> : state === 'IN_PROGRESS' ? <Icon name="loader-2" size={15} /> : state === 'ERROR' ? <Icon name="alert-triangle" size={15} /> : '·'}
              </span>
              <span className="pipeline-list__copy">
                <strong>{stage.label}</strong>
                <small>{result?.message ?? stageCopy[stage.id]}</small>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default PipelineStatus

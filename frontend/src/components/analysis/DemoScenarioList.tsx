import { DEMO_SCENARIOS } from '../../data/demo'
import type { DemoScenarioId } from '../../types/api'

interface DemoScenarioListProps {
  onSelect: (scenario: DemoScenarioId) => void
}

function DemoScenarioList({ onSelect }: DemoScenarioListProps) {
  return (
    <div className="demo-list" aria-label="Demo scenarios">
      {DEMO_SCENARIOS.map((scenario) => (
        <button className="demo-scenario" type="button" key={scenario.id} onClick={() => onSelect(scenario.id)}>
          <span className="demo-scenario__level">{scenario.label}</span>
          <strong className="demo-scenario__title">{scenario.description}</strong>
          <span className="demo-scenario__meta">Demo Data · {scenario.title}</span>
        </button>
      ))}
    </div>
  )
}

export default DemoScenarioList

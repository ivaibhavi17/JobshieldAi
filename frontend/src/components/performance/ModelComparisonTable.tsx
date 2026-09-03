import { formatMetric } from '../../types/api'
import type { ModelMetrics } from '../../types/api'

interface ModelComparisonTableProps {
  models: ModelMetrics[]
}

function ModelComparisonTable({ models }: ModelComparisonTableProps) {
  return (
    <div className="evaluation-table-wrap">
      <table className="evaluation-table">
        <caption className="sr-only">Comparison of model evaluation metrics</caption>
        <thead>
          <tr>
            <th scope="col">Model</th>
            <th scope="col">Accuracy</th>
            <th scope="col">Precision</th>
            <th scope="col">Recall</th>
            <th scope="col">F1-score</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.modelName}>
              <td className="evaluation-table__model">{model.selected ? <span className="evaluation-table__selected bracketed">{model.modelName}</span> : model.modelName}</td>
              <td className="mono-type">{formatMetric(model.accuracy)}</td>
              <td className="mono-type">{formatMetric(model.precision)}</td>
              <td className="mono-type">{formatMetric(model.recall)}</td>
              <td className="mono-type">{formatMetric(model.f1Score)}</td>
              <td className={model.selected ? 'evaluation-table__status evaluation-table__status--selected' : 'evaluation-table__status'}>{model.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ModelComparisonTable

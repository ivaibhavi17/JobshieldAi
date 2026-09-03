import SectionHeader from '../components/layout/SectionHeader'
import ModelComparisonTable from '../components/performance/ModelComparisonTable'
import ConfusionMatrix from '../components/performance/ConfusionMatrix'
import ErrorBanner from '../components/ui/ErrorBanner'
import { useModelPerformance } from '../hooks/useModelPerformance'

function ModelPerformancePage() {
  const { data, error } = useModelPerformance()
  return (
    <section className="page-section page-section--first" id="model-performance">
      <SectionHeader kicker="06 / technical appendix" title="Model performance" description="Actual evaluation results belong here when a labeled dataset, train/test split, and saved model are connected." />
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      <div className="evaluation-shell">
        <div className="evaluation-shell__header">
          <h3 className="evaluation-shell__title">Evaluation comparison</h3>
          <span className="label-mono section-kicker--rust">{data.available ? 'Connected evaluation' : 'Demo Mode · actual metrics unavailable'}</span>
        </div>
        <ModelComparisonTable models={data.models} />
      </div>
      <div className="performance-grid">
        <ConfusionMatrix matrix={data.confusionMatrix} />
        <aside className="performance-note">
          <p className="section-kicker">Reading the appendix</p>
          <h3 className="performance-note__title">{data.available ? 'Interpret the measures carefully' : 'Confidence is unavailable'}</h3>
          <p className="performance-note__copy">{data.explanation}</p>
          <p className="performance-note__footer">Required inputs: labeled CSV dataset · completed train/test split · saved TF-IDF vectorizer · evaluated model output.</p>
        </aside>
      </div>
      <div className="inline-notice model-performance-notice"><strong>Why this matters.</strong> Accuracy, precision, recall, F1-score, and the confusion matrix should be actual results from the connected training pipeline—not invented values.</div>
    </section>
  )
}

export default ModelPerformancePage

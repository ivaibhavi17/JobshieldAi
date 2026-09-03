import SectionHeader from '../components/layout/SectionHeader'
import MetricLedger from '../components/dashboard/MetricLedger'
import ChartFrame from '../components/dashboard/ChartFrame'
import JobsOverTimeChart from '../components/dashboard/JobsOverTimeChart'
import RiskDistributionChart from '../components/dashboard/RiskDistributionChart'
import IndicatorChart from '../components/dashboard/IndicatorChart'
import ScoreDistributionChart from '../components/dashboard/ScoreDistributionChart'
import ErrorBanner from '../components/ui/ErrorBanner'
import { useDashboard } from '../hooks/useDashboard'

function DashboardPage() {
  const { data, loading, error } = useDashboard()
  return (
    <section className="page-section page-section--first" id="dashboard">
      <SectionHeader kicker={`04 / field log · ${data.demoMode ? 'Demo Data' : 'live data'}`} title="Dashboard" description="A presentation view of the assessments recorded in this state. Live totals should come from the dashboard API." />
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      <MetricLedger totals={data.totals} />
      <div className="dashboard-grid">
        <ChartFrame title="Jobs analyzed over time" meta="last 8 weeks" summary="The line shows the count returned for each recorded period. It is descriptive, not a forecast.">
          <JobsOverTimeChart data={data.jobsOverTime} />
        </ChartFrame>
        <ChartFrame title="Risk distribution" meta="share of recorded jobs" summary="High and Very High records are shown with their recorded share; this is not a guarantee about future postings.">
          <RiskDistributionChart data={data.riskDistribution} />
        </ChartFrame>
        <ChartFrame title="Common indicators" meta={`${data.commonIndicators.length} ranked signals`} summary="Counts reflect detected indicator categories in the current dashboard dataset." wide>
          <IndicatorChart data={data.commonIndicators} />
        </ChartFrame>
        <ChartFrame title="Risk score distribution" meta="thresholds remain visible" summary="Bands preserve the Low, Moderate, High, and Very High score thresholds from the assessment model." wide>
          <ScoreDistributionChart data={data.scoreDistribution} />
        </ChartFrame>
      </div>
      {loading ? <p className="label-mono muted-copy dashboard-loading" role="status">Checking the dashboard API… Demo Data remains visible until it responds.</p> : null}
    </section>
  )
}

export default DashboardPage

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import BracketButton from '../components/actions/BracketButton'
import DemoScenarioList from '../components/analysis/DemoScenarioList'
import JobDetailsForm from '../components/analysis/JobDetailsForm'
import PipelineStatus from '../components/analysis/PipelineStatus'
import PostingInput from '../components/analysis/PostingInput'
import SourceSelector from '../components/analysis/SourceSelector'
import UploadDropzone from '../components/analysis/UploadDropzone'
import ErrorBanner from '../components/ui/ErrorBanner'
import Icon from '../components/ui/Icon'
import { DomainAuthenticatorCard } from '../components/DomainAuthenticatorCard'
import { DEMO_SCENARIOS } from '../data/demo'
import { useAnalysis } from '../hooks/useAnalysis'
import type { DemoScenarioId, JobDetails, SourceType } from '../types/api'
import SectionHeader from '../components/layout/SectionHeader'

function AnalyzePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state, setSourceType, setText, selectFile, extractFile, loadDemoScenario, submitAnalysis } = useAnalysis()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<JobDetails>({ defaultValues: state.details })

  useEffect(() => {
    const demoScenario = (location.state as { demoScenario?: DemoScenarioId } | null)?.demoScenario
    if (!demoScenario) return
    const scenario = DEMO_SCENARIOS.find((item) => item.id === demoScenario)
    if (!scenario) return
    const details = demoScenario === 'low'
      ? { jobTitle: 'Operations Coordinator', companyName: 'Northline Services', companyWebsite: 'https://northline.example', recruiterInformation: 'Hiring team · careers@northline.example' }
      : { jobTitle: 'Customer Support Associate', companyName: 'BrightPath Careers', companyWebsite: '', recruiterInformation: 'Coordinator via messaging app' }
    Object.entries(details).forEach(([key, value]) => setValue(key as keyof JobDetails, value))
    loadDemoScenario(demoScenario)
    window.history.replaceState({}, document.title, window.location.pathname)
  }, [loadDemoScenario, location.state, setValue])

  async function onSubmit(values: JobDetails) {
    const report = await submitAnalysis(values)
    if (report) navigate(`/analysis/${report.id}`)
  }

  function handleDemo(scenario: DemoScenarioId) {
    const details = scenario === 'low'
      ? { jobTitle: 'Operations Coordinator', companyName: 'Northline Services', companyWebsite: 'https://northline.example', recruiterInformation: 'Hiring team · careers@northline.example' }
      : { jobTitle: 'Customer Support Associate', companyName: 'BrightPath Careers', companyWebsite: '', recruiterInformation: 'Coordinator via messaging app' }
    Object.entries(details).forEach(([key, value]) => setValue(key as keyof JobDetails, value))
    loadDemoScenario(scenario)
  }

  const sourceType: SourceType = state.sourceType
  const showUpload = sourceType === 'image' || sourceType === 'document'

  return (
    <section className="page-section page-section--first" id="analyze">
      <SectionHeader kicker="02 / input review" title="Analyze a job" description="Enter the details you know, review extracted text, then explicitly start the assessment." />
      
      <DomainAuthenticatorCard />

      <form className="analyze-layout" onSubmit={handleSubmit(onSubmit)}>
        <div className="analyze-details-column">
          <JobDetailsForm register={register} errors={errors} />
          <div className="analyze-source-control">
            <p className="label-mono muted-copy">Input source</p>
            <SourceSelector value={sourceType} onChange={setSourceType} />
            <p className="analyze-source-control__help">Accepted image types: JPG, JPEG, PNG. Accepted documents: PDF, TXT.</p>
          </div>
          <div className="pipeline-summary">
            <span className="label-mono">Pipeline</span>
            <span>Text extraction → preprocessing → features → model → risk score → indicators → explanation</span>
          </div>
        </div>
        <div className="analyze-content-column">
          <div className="source-sheet source-sheet--analyze">
            <div className="source-sheet__header">
              <div>
                <p className="label-mono">Content / review before run</p>
                <h2 className="source-sheet__title">Posting content</h2>
              </div>
              <span className="source-sheet__meta">Extracted text · editable</span>
            </div>
            <div className="source-sheet__body">
              {showUpload ? (
                <>
                  <UploadDropzone sourceType={sourceType} file={state.file} status={state.extraction} error={state.error} onFile={extractFile} onClear={() => selectFile(null)} />
                  {state.text ? <PostingInput sourceType={sourceType} text={state.text} onSourceChange={setSourceType} onTextChange={setText} heading="Extracted text" showSelector={false} /> : null}
                </>
              ) : (
                <PostingInput sourceType={sourceType} text={state.text} onSourceChange={setSourceType} onTextChange={setText} heading="Extracted text" />
              )}
              <div className="privacy-note">
                <Icon name="lock" size={16} className="privacy-note__icon" />
                <span><strong>Privacy handling.</strong> Validate file type and size, sanitize input, clean up temporary uploads, and do not submit passwords, OTPs, card details, or banking credentials.</span>
              </div>
              {state.error ? <ErrorBanner>{state.error}</ErrorBanner> : null}
              <div className="analyze-submit-row">
                <span className="label-mono muted-copy">{state.text ? `${state.text.trim().length} characters ready` : 'Review the content before running'}</span>
                <BracketButton type="submit" loading={state.stages.some((stage) => stage.state === 'IN_PROGRESS')}>Analyze job</BracketButton>
              </div>
            </div>
          </div>
          <PipelineStatus stages={state.stages} />
        </div>
      </form>
      <div className="analyze-demo-block">
        <div>
          <p className="section-kicker">Demo Data</p>
          <p className="analyze-demo-block__copy">Use a sample to see the full review and explanation flow. Demo predictions are not model metrics.</p>
        </div>
        <DemoScenarioList onSelect={handleDemo} />
      </div>
    </section>
  )
}

export default AnalyzePage

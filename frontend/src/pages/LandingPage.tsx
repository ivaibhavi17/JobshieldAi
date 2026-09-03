import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BracketButton from '../components/actions/BracketButton'
import DemoScenarioList from '../components/analysis/DemoScenarioList'
import PostingInput from '../components/analysis/PostingInput'
import SourceSelector from '../components/analysis/SourceSelector'
import Icon from '../components/ui/Icon'
import type { DemoScenarioId, SourceType } from '../types/api'

function LandingPage() {
  const navigate = useNavigate()
  const [sourceType, setSourceType] = useState<SourceType>('paste')
  const [text, setText] = useState('')

  function selectDemo(scenario: DemoScenarioId) {
    navigate('/analyze', { state: { demoScenario: scenario } })
  }

  return (
    <>
      <section className="page-section page-section--first" id="landing">
        <div className="landing-meta-row">
          <div>
            <p className="section-kicker">01 / first check</p>
            <p className="landing-meta-row__copy">A careful starting point for students, freshers, and job seekers.</p>
          </div>
          <span className="label-mono muted-copy">job posting → evidence → action</span>
        </div>
        <div className="hero-grid">
          <div className="hero-intro">
            <div>
              <h1 className="hero-intro__title">Is This Job<br /><span>Really Safe?</span></h1>
              <p className="hero-intro__copy">Use AI to analyze suspicious job postings and understand potential risk indicators before you apply.</p>
              <div className="hero-actions">
                <Link className="bracket-button" to="/analyze">Analyze a job <span className="bracket-button__arrow" aria-hidden="true">→</span></Link>
                <a className="hero-actions__secondary" href="#workflow">
                  <strong>How It Works <span className="hero-actions__arrow" aria-hidden="true">↓</span></strong>
                  <span className="label-mono muted-copy">See four steps below</span>
                </a>
              </div>
            </div>
            <div className="workflow-rule" id="workflow">
              <div>
                <p className="label-mono muted-copy">Workflow</p>
                <p className="workflow-rule__steps">Paste <span className="workflow-rule__arrow">→</span> Analyze <span className="workflow-rule__arrow">→</span> Understand <span className="workflow-rule__arrow">→</span> Verify</p>
              </div>
              <span className="workflow-rule__mark" aria-hidden="true" />
            </div>
          </div>
          <div className="hero-composer">
            <div className="responsible-use">
              <p className="section-kicker section-kicker--rust">Responsible use</p>
              <div className="responsible-use__points">
                <span>AI-assisted<br />assessment</span>
                <span>Not proof<br />of fraud</span>
                <span>Always verify<br />independently</span>
              </div>
            </div>
            <div className="source-sheet">
              <div className="source-sheet__header">
                <div>
                  <p className="label-mono">Source / input</p>
                  <h2 className="source-sheet__title">Start with a posting</h2>
                </div>
                <span className="source-sheet__meta">Text<br />Image<br />PDF / TXT</span>
              </div>
              <div className="source-sheet__body">
                <SourceSelector value={sourceType} onChange={setSourceType} ariaLabel="Quick analyzer source" />
                {sourceType === 'paste' ? (
                  <PostingInput sourceType={sourceType} text={text} onSourceChange={setSourceType} onTextChange={setText} heading="Paste Job Description Here" showSelector={false} />
                ) : (
                  <div className="landing-upload-message">
                    <Icon name={sourceType === 'image' ? 'photo-scan' : 'file-upload'} size={24} />
                    <strong>{sourceType === 'image' ? 'Upload a screenshot' : 'Upload a PDF or TXT file'}</strong>
                    <span>Review extracted text before analysis.</span>
                  </div>
                )}
                <div className="privacy-note">
                  <Icon name="lock" size={16} className="privacy-note__icon" />
                  <span><strong>Preliminary only.</strong> JobShield AI does not verify employers or store unnecessary upload content.</span>
                </div>
                <BracketButton type="button" onClick={() => navigate('/analyze')}>Analyze a job</BracketButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" id="features">
        <div className="page-section__heading">
          <div>
            <p className="section-kicker">The field guide principle</p>
            <h2 className="page-section__title">Read the signals. Then verify.</h2>
          </div>
          <p className="page-section__description">The product connects a posting’s own language to clear, practical next steps.</p>
        </div>
        <div className="feature-triptych">
          <article className="feature-module">
            <Icon name="text-search" size={21} className="feature-module__icon" />
            <p className="label-mono muted-copy feature-module__kicker">01 / inspect</p>
            <h3 className="feature-module__title">AI Analysis</h3>
            <p className="feature-module__copy">Reviews wording and patterns using NLP, machine learning, and indicator rules.</p>
            <p className="feature-module__excerpt">“No prior experience is needed for high earnings.”</p>
          </article>
          <article className="feature-module feature-module--focus">
            <Icon name="brackets" size={21} className="feature-module__icon" />
            <p className="label-mono muted-copy feature-module__kicker">02 / explain</p>
            <h3 className="feature-module__title">Risk Explanation</h3>
            <p className="feature-module__copy">Connects detected language to understandable reasons, without presenting a verdict.</p>
            <p className="feature-module__excerpt">“The request appears before any interview or employment step.”</p>
          </article>
          <article className="feature-module">
            <Icon name="clipboard-check" size={21} className="feature-module__icon" />
            <p className="label-mono muted-copy feature-module__kicker">03 / respond</p>
            <h3 className="feature-module__title">Safety Guidance</h3>
            <p className="feature-module__copy">Suggests checks before you pay, share details, or continue with a recruiter.</p>
            <p className="feature-module__excerpt">“Verify the official website and recruiter independently.”</p>
          </article>
        </div>
        <DemoScenarioList onSelect={selectDemo} />
      </section>
    </>
  )
}

export default LandingPage

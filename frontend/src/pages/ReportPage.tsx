import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EvidenceMap from '../components/report/EvidenceMap'
import RecommendationList from '../components/report/RecommendationList'
import AssessmentDetails from '../components/report/AssessmentDetails'
import DisclaimerBanner from '../components/report/DisclaimerBanner'
import RiskSummary from '../components/report/RiskSummary'
import { apiClient } from '../api/client'
import { DEMO_REPORT } from '../data/demo'
import { getStoredReport } from '../hooks/useAnalysis'
import type { AssessmentReport } from '../types/api'

function ReportPage() {
  const { id } = useParams()
  const [report, setReport] = useState<AssessmentReport>(() => getStoredReport() ?? DEMO_REPORT)
  const [loading, setLoading] = useState(false)
  const [downloadingCert, setDownloadingCert] = useState(false)

  useEffect(() => {
    const numericId = Number(id)
    if (!Number.isFinite(numericId) || numericId === DEMO_REPORT.id) return
    let active = true
    apiClient.getReport(numericId)
      .then((payload) => { if (active) setReport(payload) })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const handleDownloadCertificate = async () => {
    setDownloadingCert(true)
    try {
      const res = await apiClient.downloadAuditCertificate(report.id)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `JobShield_Audit_Certificate_${report.id}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      alert('Failed to download audit certificate.')
    } finally {
      setDownloadingCert(false)
    }
  }

  return (
    <section className="page-section page-section--first" id="report">
      {loading ? <div className="inline-notice" role="status">Loading the stored assessment…</div> : null}
      <RiskSummary report={report} />
      <div className="report-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Review the source phrases before making your own decision.</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleDownloadCertificate}
            disabled={downloadingCert}
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              border: '1px solid #10b981',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: downloadingCert ? 'wait' : 'pointer'
            }}
          >
            {downloadingCert ? 'Generating...' : '📜 Download Official Audit Certificate'}
          </button>
          <Link className="text-link" to="/analyze">Edit and analyze again ↓</Link>
        </div>
      </div>
      <EvidenceMap report={report} />
      <div className="report-copy">
        <p className="section-kicker">Interpretation</p>
        <h3 className="report-copy__title">AI explanation</h3>
        <p className="report-copy__body">{report.explanation}</p>
      </div>
      <div className="report-lower-grid">
        <RecommendationList recommendations={report.recommendations} />
        <AssessmentDetails report={report} />
      </div>
      <DisclaimerBanner />
    </section>
  )
}

export default ReportPage

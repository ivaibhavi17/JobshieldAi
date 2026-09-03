export type SourceType = 'paste' | 'image' | 'document'
export type DemoScenarioId = 'low' | 'suspicious' | 'very-suspicious'
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH'
export type Prediction = 'LOWER_RISK' | 'SUSPICIOUS'
export type AnalysisStatus = 'DRAFT' | 'EXTRACTING' | 'READY_TO_REVIEW' | 'ANALYZING' | 'ANALYZED' | 'ERROR'
export type PipelineStage =
  | 'text_extraction'
  | 'preprocessing'
  | 'feature_extraction'
  | 'classification'
  | 'score_calculation'
  | 'indicator_detection'
  | 'explanation'
  | 'recommendations'
export type PipelineStageState = 'PENDING' | 'IN_PROGRESS' | 'COMPLETE' | 'ERROR'
export type IndicatorCategory =
  | 'FINANCIAL_REQUEST'
  | 'UNREALISTIC_CLAIM'
  | 'URGENCY'
  | 'SENSITIVE_INFORMATION'
  | 'SUSPICIOUS_COMMUNICATION'

export interface JobDetails {
  jobTitle: string
  companyName: string
  companyWebsite: string
  recruiterInformation: string
}

export interface Indicator {
  id: string
  category: IndicatorCategory
  title: string
  matchedPhrase?: string | null
  explanation: string
  severity: RiskLevel
  startOffset?: number | null
  endOffset?: number | null
}

export interface Recommendation {
  id: string
  text: string
}

export interface AssessmentReport {
  id: number
  jobTitle: string
  companyName: string
  sourceType: SourceType
  reviewedText: string
  riskScore: number
  riskLevel: RiskLevel
  prediction: Prediction
  confidence: number | null
  modelName: string | null
  indicators: Indicator[]
  explanation: string
  recommendations: Recommendation[]
  demoMode: boolean
  status: AnalysisStatus
  createdAt: string
}

export interface ExtractionResult {
  sourceType: SourceType
  text: string
  filename?: string
  contentType?: string
  demoMode: boolean
}

export interface PipelineStageResult {
  stage: PipelineStage
  state: PipelineStageState
  message?: string
}

export interface DashboardData {
  demoMode: boolean
  totals: {
    analyzed: number
    low: number
    moderate: number
    high: number
    veryHigh: number
  }
  jobsOverTime: Array<{ date: string; count: number }>
  riskDistribution: Array<{ level: RiskLevel; count: number; percentage: number }>
  commonIndicators: Array<{ label: string; count: number }>
  scoreDistribution: Array<{ band: string; count: number; min: number; max: number }>
}

export interface HistoryRow {
  id: number
  jobTitle: string
  companyName: string
  riskScore: number
  riskLevel: RiskLevel
  date: string
  status: AnalysisStatus
  demoMode: boolean
  indicators: Pick<Indicator, 'id' | 'category' | 'title' | 'matchedPhrase'>[]
  explanation?: string
}

export interface ModelMetrics {
  modelName: string
  accuracy: number | null
  precision: number | null
  recall: number | null
  f1Score: number | null
  status: string
  selected: boolean
}

export interface ConfusionMatrixData {
  labels: string[]
  values: Array<Array<number | null>>
}

export interface ModelPerformanceData {
  demoMode: boolean
  available: boolean
  models: ModelMetrics[]
  confusionMatrix: ConfusionMatrixData | null
  selectedModel: string | null
  explanation: string
}

export interface ApiError {
  detail: string
  code?: string
}

export interface AnalysisRequest extends JobDetails {
  sourceType: SourceType
  text: string
  demoScenario?: string
}

// --- NEW STARTUP & ENTERPRISE TYPES ---

export interface DomainVerificationRequest {
  emailOrDomain: string
  companyWebsite?: string
}

export interface DomainVerificationResult {
  emailOrDomain: string
  domain?: string
  isAuthentic: boolean
  isSpoofed: boolean
  isFreeWebmail: boolean
  hasMxRecord: boolean
  riskLevel: RiskLevel
  explanation: string
  targetBrand?: string | null
}

export interface User {
  id: number
  email: string
  fullName: string
  role: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  user: User
}

export interface AuditCertificate {
  certificateId: string
  reportId: number
  jobTitle: string
  companyName: string
  sourceType: SourceType
  riskScore: number
  riskLevel: RiskLevel
  prediction: Prediction
  confidence: number | null
  modelName: string
  verificationHash: string
  issuedAt: string
  validUntil: string
  issuer: string
  securitySeal: string
  certificateUrl: string
}

export const PIPELINE_STAGES: Array<{ id: PipelineStage; label: string }> = [
  { id: 'text_extraction', label: 'Text extraction' },
  { id: 'preprocessing', label: 'Preprocessing' },
  { id: 'feature_extraction', label: 'Feature extraction' },
  { id: 'classification', label: 'Classification' },
  { id: 'score_calculation', label: 'Score calculation' },
  { id: 'indicator_detection', label: 'Indicator detection' },
  { id: 'explanation', label: 'Explanation' },
  { id: 'recommendations', label: 'Recommendations' },
]

export const RISK_LEVEL_META: Record<RiskLevel, { label: string; color: string; range: string }> = {
  LOW: { label: 'Low risk', color: 'var(--color-low)', range: '0–30' },
  MODERATE: { label: 'Moderate risk', color: 'var(--color-moderate)', range: '31–60' },
  HIGH: { label: 'High risk', color: 'var(--color-high)', range: '61–80' },
  'VERY HIGH': { label: 'Very High risk', color: 'var(--color-very-high)', range: '81–100' },
}

export const formatRiskScore = (score: number) => `${Math.round(score)} / 100`

export const formatConfidence = (value: number | null) =>
  value == null ? 'Confidence is unavailable for this assessment.' : `${Math.round(value * 100)}%`

export const formatMetric = (value: number | null) => (value == null ? 'Unavailable' : value.toFixed(3))

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export const formatSourceType = (source: SourceType) =>
  ({ paste: 'Paste text', image: 'Image', document: 'PDF / TXT' })[source]

export const formatIndicatorCategory = (category: IndicatorCategory) =>
  ({
    FINANCIAL_REQUEST: 'Financial requests',
    UNREALISTIC_CLAIM: 'Unrealistic claims',
    URGENCY: 'Urgency',
    SENSITIVE_INFORMATION: 'Sensitive information',
    SUSPICIOUS_COMMUNICATION: 'Suspicious communication',
  })[category]

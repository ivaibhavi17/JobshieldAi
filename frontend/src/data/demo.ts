import type {
  AssessmentReport,
  DashboardData,
  DemoScenarioId,
  HistoryRow,
  ModelPerformanceData,
  SourceType,
} from '../types/api'

export const DEMO_VERY_SUSPICIOUS_TEXT =
  'We are seeking motivated students and freshers for flexible online work. No prior experience is needed and successful applicants can earn high income, no experience. To reserve your interview slot, a refundable registration fee is required. Send your details to our coordinator and pay today to begin. Limited places available. Further company information will be shared after confirmation.'

export const DEMO_LOW_RISK_TEXT =
  'Northline Services is hiring an Operations Coordinator for a full-time role in Manchester. The position includes a structured interview, paid onboarding, and a clear benefits summary. Applicants can review the company website and speak with the hiring team before deciding whether the role is a fit. No payment is required at any stage of the hiring process.'

export const DEMO_SUSPICIOUS_TEXT =
  'BrightPath Careers is seeking an entry-level Customer Support Associate for remote work. A refundable registration fee is required to reserve an interview slot. Please send your details to the coordinator and review the company information before continuing.'

export interface DemoScenario {
  id: DemoScenarioId
  label: string
  level: string
  score: number
  title: string
  company: string
  description: string
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'low',
    label: 'Demo 01 · Lower risk',
    level: 'Lower risk indicators',
    score: 18,
    title: 'Operations Coordinator',
    company: 'Northline Services',
    description: 'Standard hiring process and company details.',
  },
  {
    id: 'suspicious',
    label: 'Demo 02 · High risk',
    level: 'Potentially suspicious',
    score: 72,
    title: 'Customer Support Associate',
    company: 'BrightPath Careers',
    description: 'Registration fee mentioned before an interview.',
  },
  {
    id: 'very-suspicious',
    label: 'Demo 03 · Very high risk',
    level: 'Potentially suspicious',
    score: 87,
    title: 'Customer Support Associate',
    company: 'BrightPath Careers',
    description: 'High income promise paired with urgent payment language.',
  },
]

export const DEMO_REPORT: AssessmentReport = {
  id: 248,
  jobTitle: 'Customer Support Associate',
  companyName: 'BrightPath Careers',
  sourceType: 'paste',
  reviewedText: DEMO_VERY_SUSPICIOUS_TEXT,
  riskScore: 87,
  riskLevel: 'VERY HIGH',
  prediction: 'SUSPICIOUS',
  confidence: null,
  modelName: null,
  indicators: [
    {
      id: 'financial-01',
      category: 'FINANCIAL_REQUEST',
      title: 'Payment requested before an interview',
      matchedPhrase: 'registration fee',
      explanation: 'The posting asks for payment before an interview or employment step.',
      severity: 'VERY HIGH',
    },
    {
      id: 'claim-01',
      category: 'UNREALISTIC_CLAIM',
      title: 'Unusually strong salary promise',
      matchedPhrase: 'high income, no experience',
      explanation: 'The income claim is unusually strong relative to the stated requirements.',
      severity: 'HIGH',
    },
    {
      id: 'urgency-01',
      category: 'URGENCY',
      title: 'Urgent response language',
      matchedPhrase: 'pay today',
      explanation: 'Time pressure can reduce the opportunity to verify an employer independently.',
      severity: 'HIGH',
    },
    {
      id: 'company-01',
      category: 'SUSPICIOUS_COMMUNICATION',
      title: 'Limited company information',
      matchedPhrase: 'company information will be shared after confirmation',
      explanation: 'Important employer details are deferred until after a requested commitment.',
      severity: 'MODERATE',
    },
  ],
  explanation:
    'Several characteristics commonly associated with suspicious job postings were detected. The posting requests payment before employment and contains unusually strong salary claims. Time-pressure language makes independent verification more important.',
  recommendations: [
    { id: 'recommendation-01', text: 'Do not make upfront payments.' },
    { id: 'recommendation-02', text: 'Verify the official website and recruiter independently.' },
    { id: 'recommendation-03', text: 'Do not share OTP, passwords, or banking credentials.' },
    { id: 'recommendation-04', text: 'Compare the role with trusted recruitment platforms.' },
  ],
  demoMode: true,
  status: 'ANALYZED',
  createdAt: '2026-06-24T09:30:00.000Z',
}

export const DEMO_DASHBOARD: DashboardData = {
  demoMode: true,
  totals: { analyzed: 24, low: 6, moderate: 4, high: 8, veryHigh: 6 },
  jobsOverTime: [
    { date: '16 May', count: 2 },
    { date: '23 May', count: 3 },
    { date: '30 May', count: 2 },
    { date: '06 Jun', count: 4 },
    { date: '13 Jun', count: 3 },
    { date: '20 Jun', count: 5 },
  ],
  riskDistribution: [
    { level: 'LOW', count: 6, percentage: 25 },
    { level: 'MODERATE', count: 4, percentage: 17 },
    { level: 'HIGH', count: 8, percentage: 33 },
    { level: 'VERY HIGH', count: 6, percentage: 25 },
  ],
  commonIndicators: [
    { label: 'Financial request', count: 18 },
    { label: 'Urgency language', count: 14 },
    { label: 'Unrealistic claim', count: 11 },
    { label: 'Limited company info', count: 8 },
  ],
  scoreDistribution: [
    { band: '0–10', count: 2, min: 0, max: 10 },
    { band: '11–20', count: 3, min: 11, max: 20 },
    { band: '21–30', count: 1, min: 21, max: 30 },
    { band: '31–40', count: 3, min: 31, max: 40 },
    { band: '41–50', count: 4, min: 41, max: 50 },
    { band: '51–60', count: 3, min: 51, max: 60 },
    { band: '61–70', count: 4, min: 61, max: 70 },
    { band: '71–80', count: 3, min: 71, max: 80 },
    { band: '81–90', count: 1, min: 81, max: 90 },
  ],
}

export const DEMO_HISTORY: HistoryRow[] = [
  {
    id: 248,
    jobTitle: 'Customer Support Associate',
    companyName: 'BrightPath Careers',
    riskScore: 87,
    riskLevel: 'VERY HIGH',
    date: '2026-06-24T09:30:00.000Z',
    status: 'ANALYZED',
    demoMode: true,
    indicators: DEMO_REPORT.indicators.map(({ id, category, title, matchedPhrase }) => ({ id, category, title, matchedPhrase })),
    explanation: DEMO_REPORT.explanation,
  },
  {
    id: 247,
    jobTitle: 'Operations Coordinator',
    companyName: 'Northline Services',
    riskScore: 22,
    riskLevel: 'LOW',
    date: '2026-06-22T09:30:00.000Z',
    status: 'ANALYZED',
    demoMode: true,
    indicators: [],
    explanation: 'No listed warning signs were detected in this posting. This does not verify the employer or guarantee safety.',
  },
  {
    id: 246,
    jobTitle: 'Remote Data Entry',
    companyName: 'Harbor & Field',
    riskScore: 48,
    riskLevel: 'MODERATE',
    date: '2026-06-20T09:30:00.000Z',
    status: 'ANALYZED',
    demoMode: true,
    indicators: [
      { id: 'communication-01', category: 'SUSPICIOUS_COMMUNICATION', title: 'Limited company information', matchedPhrase: 'contact us through our coordinator' },
    ],
    explanation: 'Some details warrant a closer review before you continue.',
  },
  {
    id: 245,
    jobTitle: 'Online Marketing Trainee',
    companyName: 'Demo posting',
    riskScore: 72,
    riskLevel: 'HIGH',
    date: '2026-06-18T09:30:00.000Z',
    status: 'ANALYZED',
    demoMode: true,
    indicators: DEMO_REPORT.indicators.slice(0, 2).map(({ id, category, title, matchedPhrase }) => ({ id, category, title, matchedPhrase })),
    explanation: 'The posting includes a financial request and an unusually strong claim.',
  },
]

export const DEMO_MODEL_PERFORMANCE: ModelPerformanceData = {
  demoMode: true,
  available: false,
  models: [
    { modelName: 'Logistic Regression', accuracy: null, precision: null, recall: null, f1Score: null, status: 'Awaiting evaluation', selected: false },
    { modelName: 'Naive Bayes', accuracy: null, precision: null, recall: null, f1Score: null, status: 'Awaiting evaluation', selected: false },
    { modelName: 'Random Forest', accuracy: null, precision: null, recall: null, f1Score: null, status: 'Selected model · pending validation', selected: true },
  ],
  confusionMatrix: {
    labels: ['Lower risk', 'Suspicious'],
    values: [[null, null], [null, null]],
  },
  selectedModel: 'Random Forest',
  explanation:
    'No actual metrics are shown in Demo Mode. Recall helps us see how often suspicious examples are found; false negatives are postings the model does not flag and still need human verification. The evaluation service should report all measures before a model is presented as selected.',
}

export function getDemoText(id: DemoScenarioId) {
  if (id === 'low') return DEMO_LOW_RISK_TEXT
  if (id === 'suspicious') return DEMO_SUSPICIOUS_TEXT
  return DEMO_VERY_SUSPICIOUS_TEXT
}

export function getDemoSourceType(): SourceType {
  return 'paste'
}

import type { AssessmentReport, Indicator, JobDetails, RiskLevel, SourceType } from '../types/api'

const patterns: Array<{
  id: string
  category: Indicator['category']
  title: string
  regex: RegExp
  severity: RiskLevel
  explanation: string
  weight: number
}> = [
  {
    id: 'financial-request',
    category: 'FINANCIAL_REQUEST',
    title: 'Payment requested before an interview',
    regex: /registration fee|processing fee|security deposit|training fee|payment before (?:the )?interview|pay to get hired|refundable fee/i,
    severity: 'VERY HIGH',
    explanation: 'The posting asks for payment before an interview or employment step.',
    weight: 32,
  },
  {
    id: 'unrealistic-claim',
    category: 'UNREALISTIC_CLAIM',
    title: 'Unusually strong salary promise',
    regex: /high income,?\s*no experience|no experience.*(?:income|salary)|guaranteed (?:income|job)|earn (?:large|big)|high income/i,
    severity: 'HIGH',
    explanation: 'The income claim is unusually strong relative to the stated requirements.',
    weight: 25,
  },
  {
    id: 'urgency',
    category: 'URGENCY',
    title: 'Urgent response language',
    regex: /pay today|act now|limited time|urgent confirmation|immediate payment|immediately to begin|limited places/i,
    severity: 'HIGH',
    explanation: 'Time pressure can reduce the opportunity to verify an employer independently.',
    weight: 20,
  },
  {
    id: 'sensitive-information',
    category: 'SENSITIVE_INFORMATION',
    title: 'Sensitive information requested',
    regex: /bank account|card details|one[- ]time password|\botp\b|password|banking credentials/i,
    severity: 'VERY HIGH',
    explanation: 'The posting asks for information that should not be shared during an initial job search.',
    weight: 24,
  },
  {
    id: 'limited-company-information',
    category: 'SUSPICIOUS_COMMUNICATION',
    title: 'Limited company information',
    regex: /company information.*(?:after|confirmation)|contact us through our coordinator|generic email|gmail\.com|outlook\.com/i,
    severity: 'MODERATE',
    explanation: 'Important employer details are limited or deferred until after a requested commitment.',
    weight: 10,
  },
]

function riskLevelFor(score: number): RiskLevel {
  if (score <= 30) return 'LOW'
  if (score <= 60) return 'MODERATE'
  if (score <= 80) return 'HIGH'
  return 'VERY HIGH'
}

function predictionFor(level: RiskLevel) {
  return level === 'LOW' || level === 'MODERATE' ? 'LOWER_RISK' as const : 'SUSPICIOUS' as const
}

function recommendationsFor(indicators: Indicator[]) {
  const recommendations = new Map<string, string>()
  recommendations.set('verify', 'Verify the official website and recruiter independently.')
  recommendations.set('compare', 'Compare the role with trusted recruitment platforms.')

  if (indicators.some((indicator) => indicator.category === 'FINANCIAL_REQUEST')) {
    recommendations.set('payment', 'Do not make upfront payments.')
  }
  if (indicators.some((indicator) => indicator.category === 'SENSITIVE_INFORMATION')) {
    recommendations.set('credentials', 'Do not share OTP, passwords, or banking credentials.')
  }

  return Array.from(recommendations, ([id, text]) => ({ id: `recommendation-${id}`, text }))
}

function createIndicator(definition: (typeof patterns)[number], text: string): Indicator | null {
  const match = text.match(definition.regex)
  if (!match) return null

  return {
    id: definition.id,
    category: definition.category,
    title: definition.title,
    matchedPhrase: match[0],
    explanation: definition.explanation,
    severity: definition.severity,
    startOffset: match.index ?? null,
    endOffset: match.index == null ? null : match.index + match[0].length,
  }
}

export function createLocalAssessment(details: JobDetails, text: string, sourceType: SourceType): AssessmentReport {
  const indicators = patterns.map((definition) => createIndicator(definition, text)).filter((indicator): indicator is Indicator => indicator !== null)
  const score = Math.min(100, indicators.reduce((total, indicator) => {
    const definition = patterns.find((pattern) => pattern.id === indicator.id)
    return total + (definition?.weight ?? 0)
  }, 0))
  const riskLevel = riskLevelFor(score)
  const names = indicators.map((indicator) => indicator.title.toLowerCase())
  const explanation = indicators.length
    ? `${indicators.length} ${indicators.length === 1 ? 'characteristic' : 'characteristics'} commonly associated with suspicious job postings were detected. ${names.slice(0, 2).join(' and ')}${names.length > 2 ? ' and other signals' : ''} warrant independent verification before you continue.`
    : 'No listed warning signs were detected in this posting. This does not verify the employer or guarantee safety.'

  return {
    id: Date.now(),
    jobTitle: details.jobTitle || 'Untitled job posting',
    companyName: details.companyName || 'Company not provided',
    sourceType,
    reviewedText: text,
    riskScore: score,
    riskLevel,
    prediction: predictionFor(riskLevel),
    confidence: null,
    modelName: null,
    indicators,
    explanation,
    recommendations: recommendationsFor(indicators),
    demoMode: true,
    status: 'ANALYZED',
    createdAt: new Date().toISOString(),
  }
}

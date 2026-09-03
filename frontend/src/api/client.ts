import type {
  AnalysisRequest,
  AssessmentReport,
  AuditCertificate,
  AuthResponse,
  DashboardData,
  DomainVerificationRequest,
  DomainVerificationResult,
  ExtractionResult,
  HistoryRow,
  ModelPerformanceData,
  User,
} from '../types/api'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

const AUTH_TOKEN_KEY = 'jobshield-ai:auth-token'

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY)
export const setAuthToken = (token: string) => window.localStorage.setItem(AUTH_TOKEN_KEY, token)
export const removeAuthToken = () => window.localStorage.removeItem(AUTH_TOKEN_KEY)

export class ApiClientError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
  }
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string; code?: string }
    return new ApiClientError(payload.detail ?? `Request failed with status ${response.status}`, payload.code)
  } catch {
    return new ApiClientError(`Request failed with status ${response.status}`)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string>),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) throw await parseError(response)
  return (await response.json()) as T
}

async function multipart<T>(path: string, file: File): Promise<T> {
  const body = new FormData()
  body.append('file', file)
  return request<T>(path, { method: 'POST', body })
}

export const apiClient = {
  analyze: (payload: AnalysisRequest) => request<AssessmentReport>('/api/analyze', { method: 'POST', body: JSON.stringify(payload) }),
  extractImage: (file: File) => multipart<ExtractionResult>('/api/extract/image', file),
  extractDocument: (file: File) => multipart<ExtractionResult>('/api/extract/document', file),
  getHistory: () => request<{ items: HistoryRow[]; total: number }>('/api/history'),
  getReport: (id: number) => request<AssessmentReport>(`/api/history/${id}`),
  exportReport: (id: number) => fetch(`${API_BASE_URL}/api/history/${id}/export`),
  deleteAnalysis: (id: number) => request<void>(`/api/history/${id}`, { method: 'DELETE' }),
  getDashboard: () => request<DashboardData>('/api/dashboard'),
  getModelPerformance: () => request<ModelPerformanceData>('/api/model-performance'),

  // --- NEW STARTUP & ENTERPRISE METHODS ---
  verifyDomain: (payload: DomainVerificationRequest) =>
    request<DomainVerificationResult>('/api/verify-domain', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload: { email: string; password: string; fullName?: string }) =>
    request<AuthResponse>('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request<User>('/api/auth/me'),
  getAuditCertificate: (id: number) => request<AuditCertificate>(`/api/history/${id}/audit-certificate`),
  downloadAuditCertificate: (id: number) => fetch(`${API_BASE_URL}/api/history/${id}/audit-certificate/download`),
}

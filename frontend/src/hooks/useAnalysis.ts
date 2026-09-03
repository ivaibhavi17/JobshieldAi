import { useCallback, useReducer } from 'react'
import { apiClient } from '../api/client'
import { DEMO_REPORT, getDemoText } from '../data/demo'
import { createLocalAssessment } from '../lib/localAssessment'
import { PIPELINE_STAGES } from '../types/api'
import type { AnalysisRequest, AssessmentReport, DemoScenarioId, JobDetails, PipelineStageResult, SourceType } from '../types/api'

const REPORT_STORAGE_KEY = 'jobshield-ai:latest-report'

const initialDetails: JobDetails = {
  jobTitle: '',
  companyName: '',
  companyWebsite: '',
  recruiterInformation: '',
}

const initialStages: PipelineStageResult[] = PIPELINE_STAGES.map(({ id }) => ({ stage: id, state: 'PENDING' }))

type ExtractionState = 'idle' | 'uploading' | 'extracting' | 'ready' | 'error'

export interface AnalysisState {
  details: JobDetails
  sourceType: SourceType
  text: string
  file: File | null
  extraction: ExtractionState
  stages: PipelineStageResult[]
  report: AssessmentReport | null
  error: string | null
}

type Action =
  | { type: 'SET_DETAIL'; key: keyof JobDetails; value: string }
  | { type: 'SET_SOURCE'; sourceType: SourceType }
  | { type: 'SET_TEXT'; text: string }
  | { type: 'SET_FILE'; file: File | null }
  | { type: 'EXTRACTION_START' }
  | { type: 'EXTRACTION_SUCCESS'; text: string }
  | { type: 'ERROR'; message: string }
  | { type: 'LOAD_DEMO'; scenario: DemoScenarioId; details: JobDetails; text: string }
  | { type: 'ANALYSIS_START' }
  | { type: 'ANALYSIS_SUCCESS'; report: AssessmentReport }
  | { type: 'RESET' }

const initialState: AnalysisState = {
  details: initialDetails,
  sourceType: 'paste',
  text: '',
  file: null,
  extraction: 'idle',
  stages: initialStages,
  report: null,
  error: null,
}

function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case 'SET_DETAIL':
      return { ...state, details: { ...state.details, [action.key]: action.value }, error: null }
    case 'SET_SOURCE':
      return { ...state, sourceType: action.sourceType, file: null, extraction: 'idle', error: null }
    case 'SET_TEXT':
      return { ...state, text: action.text, extraction: action.text ? 'ready' : 'idle', error: null }
    case 'SET_FILE':
      return { ...state, file: action.file, error: null }
    case 'EXTRACTION_START':
      return { ...state, extraction: 'uploading', error: null, stages: initialStages }
    case 'EXTRACTION_SUCCESS':
      return { ...state, text: action.text, extraction: 'ready', error: null, stages: initialStages }
    case 'ERROR':
      return { ...state, extraction: 'error', error: action.message, stages: initialStages }
    case 'LOAD_DEMO':
      return {
        ...state,
        details: action.details,
        text: action.text,
        sourceType: 'paste',
        file: null,
        extraction: 'ready',
        error: null,
        report: action.scenario === 'very-suspicious' ? DEMO_REPORT : null,
        stages: initialStages,
      }
    case 'ANALYSIS_START':
      return {
        ...state,
        error: null,
        stages: PIPELINE_STAGES.map(({ id }, index) => ({ stage: id, state: index === 0 ? 'IN_PROGRESS' : 'PENDING' })),
      }
    case 'ANALYSIS_SUCCESS':
      return {
        ...state,
        report: action.report,
        extraction: 'ready',
        stages: PIPELINE_STAGES.map(({ id }) => ({ stage: id, state: 'COMPLETE' })),
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function persistReport(report: AssessmentReport) {
  window.sessionStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(report))
}

export function getStoredReport() {
  const rawReport = window.sessionStorage.getItem(REPORT_STORAGE_KEY)
  if (!rawReport) return null
  try {
    return JSON.parse(rawReport) as AssessmentReport
  } catch {
    return null
  }
}

export function useAnalysis() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setDetail = useCallback((key: keyof JobDetails, value: string) => {
    dispatch({ type: 'SET_DETAIL', key, value })
  }, [])

  const setSourceType = useCallback((sourceType: SourceType) => {
    dispatch({ type: 'SET_SOURCE', sourceType })
  }, [])

  const setText = useCallback((text: string) => {
    dispatch({ type: 'SET_TEXT', text })
  }, [])

  const selectFile = useCallback((file: File | null) => {
    dispatch({ type: 'SET_FILE', file })
  }, [])

  const extractFile = useCallback(async (file: File) => {
    dispatch({ type: 'SET_FILE', file })
    dispatch({ type: 'EXTRACTION_START' })

    try {
      const isDocument = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.pdf')
      const result = isDocument ? await apiClient.extractDocument(file) : await apiClient.extractImage(file)
      dispatch({ type: 'EXTRACTION_SUCCESS', text: result.text })
    } catch {
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        const text = await file.text()
        dispatch({ type: 'EXTRACTION_SUCCESS', text })
      } else {
        dispatch({ type: 'ERROR', message: 'OCR is not connected in Demo Mode. Try a clearer image or paste the text manually.' })
      }
    }
  }, [])

  const loadDemoScenario = useCallback((scenario: DemoScenarioId) => {
    const detailsByScenario: Record<DemoScenarioId, JobDetails> = {
      low: { jobTitle: 'Operations Coordinator', companyName: 'Northline Services', companyWebsite: 'https://northline.example', recruiterInformation: 'Hiring team · careers@northline.example' },
      suspicious: { jobTitle: 'Customer Support Associate', companyName: 'BrightPath Careers', companyWebsite: '', recruiterInformation: 'Coordinator via messaging app' },
      'very-suspicious': { jobTitle: 'Customer Support Associate', companyName: 'BrightPath Careers', companyWebsite: '', recruiterInformation: 'Coordinator via messaging app' },
    }
    dispatch({ type: 'LOAD_DEMO', scenario, details: detailsByScenario[scenario], text: getDemoText(scenario) })
  }, [])

  const submitAnalysis = useCallback(async (detailsOverride?: JobDetails) => {
    const text = state.text.trim()
    const details = detailsOverride ?? state.details
    if (!text) {
      dispatch({ type: 'ERROR', message: 'Add a job description before starting the assessment.' })
      return null
    }

    dispatch({ type: 'ANALYSIS_START' })
    const payload: AnalysisRequest = { ...details, sourceType: state.sourceType, text }

    try {
      const report = await apiClient.analyze(payload)
      persistReport(report)
      dispatch({ type: 'ANALYSIS_SUCCESS', report })
      return report
    } catch {
      const report = createLocalAssessment(details, text, state.sourceType)
      persistReport(report)
      dispatch({ type: 'ANALYSIS_SUCCESS', report })
      return report
    }
  }, [state.details, state.sourceType, state.text])

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, setDetail, setSourceType, setText, selectFile, extractFile, loadDemoScenario, submitAnalysis, reset }
}

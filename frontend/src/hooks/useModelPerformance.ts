import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { DEMO_MODEL_PERFORMANCE } from '../data/demo'
import type { ModelPerformanceData } from '../types/api'

export function useModelPerformance() {
  const [data, setData] = useState<ModelPerformanceData>(DEMO_MODEL_PERFORMANCE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    apiClient.getModelPerformance()
      .then((payload) => { if (active) setData(payload) })
      .catch(() => { if (active) setError('Live model evaluation is unavailable. Showing clearly labeled Demo Mode.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { data, loading, error }
}

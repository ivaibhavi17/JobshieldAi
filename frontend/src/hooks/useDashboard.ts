import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { DEMO_DASHBOARD } from '../data/demo'
import type { DashboardData } from '../types/api'

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(DEMO_DASHBOARD)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    apiClient.getDashboard()
      .then((payload) => { if (active) setData(payload) })
      .catch(() => { if (active) setError('Live dashboard data is unavailable. Showing clearly labeled Demo Data.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { data, loading, error }
}

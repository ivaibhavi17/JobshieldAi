import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import { DEMO_HISTORY } from '../data/demo'
import type { HistoryRow } from '../types/api'

export function useHistory() {
  const [items, setItems] = useState<HistoryRow[]>(DEMO_HISTORY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    apiClient.getHistory()
      .then((payload) => { if (active) setItems(payload.items) })
      .catch(() => { if (active) setError('Live history is unavailable. Showing clearly labeled Demo Data.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { items, setItems, loading, error }
}

import { useState, useEffect } from 'react'
import { fetchBridges, fetchBridgeById } from './api'
import type { Bridge } from '@bridge-bim-platform/shared'

export function useBridges() {
  const [bridges, setBridges] = useState<Bridge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadBridges() {
      try {
        setLoading(true)
        const data = await fetchBridges()
        setBridges(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    loadBridges()
  }, [])

  return { bridges, loading, error }
}

export function useBridge(id: string) {
  const [bridge, setBridge] = useState<Bridge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadBridge() {
      try {
        setLoading(true)
        const data = await fetchBridgeById(id)
        setBridge(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadBridge()
    }
  }, [id])

  return { bridge, loading, error }
}

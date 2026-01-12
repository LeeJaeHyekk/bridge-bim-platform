import { useState, useEffect } from 'react'
import { bimApi } from './api'
import type { BIMModel, BIMComponent, BIMFilter } from '@bridge-bim-platform/shared'

export function useBIMModel(bridgeId: string | null) {
  const [model, setModel] = useState<BIMModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!bridgeId) {
      setModel(null)
      return
    }

    setLoading(true)
    setError(null)

    bimApi
      .getModelByBridgeId(bridgeId)
      .then(setModel)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [bridgeId])

  return { model, loading, error }
}

export function useBIMComponents(
  modelId: string | null,
  filter?: BIMFilter,
) {
  const [components, setComponents] = useState<BIMComponent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!modelId) {
      setComponents([])
      return
    }

    setLoading(true)
    setError(null)

    bimApi
      .getComponents(modelId, filter)
      .then(setComponents)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [modelId, filter])

  return { components, loading, error }
}

export function useBIMComponent(
  modelId: string | null,
  componentId: string | null,
) {
  const [component, setComponent] = useState<BIMComponent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!modelId || !componentId) {
      setComponent(null)
      return
    }

    setLoading(true)
    setError(null)

    bimApi
      .getComponent(modelId, componentId)
      .then(setComponent)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [modelId, componentId])

  return { component, loading, error }
}

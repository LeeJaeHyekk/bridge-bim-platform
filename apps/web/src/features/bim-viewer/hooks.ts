import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loadBIMModel, loadBIMComponents, loadBIMComponent } from './bimSlice'
import type { BIMModel, BIMComponent, BIMFilter } from '@bridge-bim-platform/shared'

export function useBIMModel(bridgeId: string | null): {
  model: BIMModel | null
  loading: boolean
  error: Error | null
} {
  const dispatch = useAppDispatch()
  const model = useAppSelector((state) =>
    bridgeId ? state.bim.models[bridgeId] ?? null : null,
  )
  const loading = useAppSelector((state) => state.bim.asyncState.loading.model)
  const error = useAppSelector((state) => state.bim.asyncState.error.model)

  useEffect(() => {
    if (bridgeId) {
      dispatch(loadBIMModel(bridgeId))
    }
  }, [dispatch, bridgeId])

  return {
    model: model ?? null,
    loading,
    error: error ? new Error(error) : null,
  }
}

export function useBIMComponents(
  modelId: string | null,
  filter?: BIMFilter,
): {
  components: BIMComponent[]
  loading: boolean
  error: Error | null
} {
  const dispatch = useAppDispatch()
  const components = useAppSelector((state) =>
    modelId ? state.bim.components[modelId] ?? [] : [],
  )
  const loading = useAppSelector((state) => state.bim.asyncState.loading.components)
  const error = useAppSelector((state) => state.bim.asyncState.error.components)

  useEffect(() => {
    if (modelId) {
      dispatch(loadBIMComponents({ modelId, filter }))
    }
  }, [dispatch, modelId, filter])

  return {
    components: components ?? [],
    loading,
    error: error ? new Error(error) : null,
  }
}

export function useBIMComponent(
  modelId: string | null,
  componentId: string | null,
): {
  component: BIMComponent | null
  loading: boolean
  error: Error | null
} {
  const dispatch = useAppDispatch()
  const currentComponentAsync = useAppSelector((state) => state.bim.currentComponent)
  const loading = useAppSelector((state) => state.bim.asyncState.loading.component)
  const error = useAppSelector((state) => state.bim.asyncState.error.component)

  useEffect(() => {
    if (modelId && componentId) {
      dispatch(loadBIMComponent({ modelId, componentId }))
    }
  }, [dispatch, modelId, componentId])

  return {
    component: currentComponentAsync.data ?? null,
    loading,
    error: error ? new Error(error) : null,
  }
}

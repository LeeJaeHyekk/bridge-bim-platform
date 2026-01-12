import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loadBridges, loadBridgeById } from './bridgeSlice'
import { getErrorFromAsyncState } from '@/shared/redux'
import type { Bridge } from '@bridge-bim-platform/shared'

export function useBridges(): {
  bridges: Bridge[]
  loading: boolean
  error: Error | null
} {
  const dispatch = useAppDispatch()
  const bridgesAsync = useAppSelector((state) => state.bridge.bridges)

  useEffect(() => {
    dispatch(loadBridges())
  }, [dispatch])

  return {
    bridges: (bridgesAsync.data || []) as Bridge[],
    loading: bridgesAsync.loading,
    error: getErrorFromAsyncState(bridgesAsync),
  }
}

export function useBridge(id: string): {
  bridge: Bridge | null
  loading: boolean
  error: Error | null
} {
  const dispatch = useAppDispatch()
  const currentBridgeAsync = useAppSelector((state) => state.bridge.currentBridge)

  useEffect(() => {
    if (id) {
      dispatch(loadBridgeById(id))
    }
  }, [dispatch, id])

  return {
    bridge: currentBridgeAsync.data ?? null,
    loading: currentBridgeAsync.loading,
    error: getErrorFromAsyncState(currentBridgeAsync),
  }
}

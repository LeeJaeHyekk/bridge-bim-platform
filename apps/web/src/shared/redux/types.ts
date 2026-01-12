/**
 * 공통 Redux 상태 타입 정의
 */

export interface AsyncState<T = unknown> {
  data: T
  loading: boolean
  error: string | null
}

export interface AsyncStateWithKey<T = unknown> {
  data: Record<string, T>
  loading: boolean
  error: string | null
}

export interface MultiAsyncState {
  loading: Record<string, boolean>
  error: Record<string, string | null>
}

/**
 * Async 상태 초기값 생성 헬퍼
 */
export function createAsyncState<T>(initialData: T): AsyncState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
  }
}

export function createAsyncStateWithKey<T>(): AsyncStateWithKey<T> {
  return {
    data: {},
    loading: false,
    error: null,
  }
}

export function createMultiAsyncState(keys: string[]): MultiAsyncState {
  const loading: Record<string, boolean> = {}
  const error: Record<string, string | null> = {}

  keys.forEach((key) => {
    loading[key] = false
    error[key] = null
  })

  return { loading, error }
}

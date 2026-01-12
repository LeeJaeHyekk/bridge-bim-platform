import type { AsyncState } from './types'

/**
 * Async 상태에서 Error 객체를 생성하는 헬퍼
 */
export function getErrorFromAsyncState<T>(
  asyncState: AsyncState<T>,
): Error | null {
  return asyncState.error ? new Error(asyncState.error) : null
}

/**
 * Async 상태를 Hook 반환 형식으로 변환하는 헬퍼
 */
export function mapAsyncStateToHookReturn<T>(
  asyncState: AsyncState<T>,
  dataKey: keyof AsyncState<T> = 'data',
) {
  return {
    [dataKey]: asyncState.data,
    loading: asyncState.loading,
    error: getErrorFromAsyncState(asyncState),
  }
}

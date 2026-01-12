import type { AsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type { AsyncState, MultiAsyncState } from './types'

/**
 * 공통 Async Reducer 헬퍼
 * pending/fulfilled/rejected 패턴을 자동으로 처리합니다.
 */
export function handleAsyncThunk<TData, TRequest = void, TState = any>(
  builder: ActionReducerMapBuilder<TState>,
  thunk: AsyncThunk<TData, TRequest, { rejectValue: string }>,
  statePath: (state: Draft<TState>) => Draft<AsyncState<TData>>,
) {
  builder
    .addCase(thunk.pending, (state) => {
      const asyncState = statePath(state)
      asyncState.loading = true
      asyncState.error = null
    })
    .addCase(thunk.fulfilled, (state, action: PayloadAction<TData>) => {
      const asyncState = statePath(state)
      asyncState.loading = false
      // Draft 타입은 Immer가 자동으로 처리하므로 원본 데이터를 그대로 할당
      asyncState.data = action.payload as unknown as Draft<AsyncState<TData>>['data']
    })
    .addCase(thunk.rejected, (state, action) => {
      const asyncState = statePath(state)
      asyncState.loading = false
      asyncState.error = action.payload || '알 수 없는 오류가 발생했습니다.'
    })
}

/**
 * Multi Async Reducer 헬퍼 (여러 개의 비동기 작업을 관리)
 */
export function handleMultiAsyncThunk<TData, TRequest = void, TState = any>(
  builder: ActionReducerMapBuilder<TState>,
  thunk: AsyncThunk<TData, TRequest, { rejectValue: string }>,
  key: string,
  statePath: (state: Draft<TState>) => Draft<MultiAsyncState>,
  onFulfilled?: (state: Draft<TState>, action: PayloadAction<TData>) => void,
) {
  builder
    .addCase(thunk.pending, (state) => {
      const asyncState = statePath(state)
      asyncState.loading[key] = true
      asyncState.error[key] = null
    })
    .addCase(thunk.fulfilled, (state, action: PayloadAction<TData>) => {
      const asyncState = statePath(state)
      asyncState.loading[key] = false
      if (onFulfilled) {
        onFulfilled(state, action)
      }
    })
    .addCase(thunk.rejected, (state, action) => {
      const asyncState = statePath(state)
      asyncState.loading[key] = false
      asyncState.error[key] = action.payload || '알 수 없는 오류가 발생했습니다.'
    })
}

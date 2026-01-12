import { createAsyncThunk } from '@reduxjs/toolkit'

/**
 * 공통 Async Thunk 생성 헬퍼
 * 에러 처리를 통일하고 반복 코드를 최소화합니다.
 */
export function createAsyncThunkWithErrorHandling<TRequest, TResponse>(
  typePrefix: string,
  asyncFn: (request: TRequest) => Promise<TResponse>,
  defaultErrorMessage: string,
) {
  return createAsyncThunk<TResponse, TRequest, { rejectValue: string }>(
    typePrefix,
    async (request, { rejectWithValue }) => {
      try {
        return await asyncFn(request)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : defaultErrorMessage
        return rejectWithValue(errorMessage)
      }
    },
  )
}

/**
 * 파라미터 없는 Async Thunk 생성 헬퍼
 */
export function createAsyncThunkWithoutParams<TResponse>(
  typePrefix: string,
  asyncFn: () => Promise<TResponse>,
  defaultErrorMessage: string,
) {
  return createAsyncThunk<TResponse, void, { rejectValue: string }>(
    typePrefix,
    async (_, { rejectWithValue }) => {
      try {
        return await asyncFn()
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : defaultErrorMessage
        return rejectWithValue(errorMessage)
      }
    },
  )
}

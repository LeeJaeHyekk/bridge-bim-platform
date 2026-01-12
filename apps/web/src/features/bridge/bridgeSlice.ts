import { createSlice } from '@reduxjs/toolkit'
import { fetchBridges, fetchBridgeById } from './api'
import type { Bridge } from '@bridge-bim-platform/shared'
import {
  createAsyncThunkWithoutParams,
  createAsyncThunkWithErrorHandling,
  handleAsyncThunk,
  createAsyncState,
} from '@/shared/redux'

// Async Thunks
export const loadBridges = createAsyncThunkWithoutParams<Bridge[]>(
  'bridge/loadBridges',
  fetchBridges,
  '교량 목록을 불러오는데 실패했습니다.',
)

export const loadBridgeById = createAsyncThunkWithErrorHandling<
  string,
  Bridge | null
>('bridge/loadBridgeById', fetchBridgeById, '교량 정보를 불러오는데 실패했습니다.')

interface BridgeState {
  bridges: ReturnType<typeof createAsyncState<Bridge[]>>
  currentBridge: ReturnType<typeof createAsyncState<Bridge | null>>
}

const initialState: BridgeState = {
  bridges: createAsyncState<Bridge[]>([]),
  currentBridge: createAsyncState<Bridge | null>(null),
}

const bridgeSlice = createSlice({
  name: 'bridge',
  initialState,
  reducers: {
    clearCurrentBridge: (state) => {
      state.currentBridge.data = null
      state.currentBridge.error = null
    },
    clearError: (state) => {
      state.bridges.error = null
      state.currentBridge.error = null
    },
  },
  extraReducers: (builder) => {
    // loadBridges
    handleAsyncThunk(builder, loadBridges, (state) => state.bridges)

    // loadBridgeById
    handleAsyncThunk(builder, loadBridgeById, (state) => state.currentBridge)
  },
})

export const { clearCurrentBridge, clearError } = bridgeSlice.actions
export default bridgeSlice.reducer

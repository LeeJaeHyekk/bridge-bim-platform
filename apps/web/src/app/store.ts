import { configureStore } from '@reduxjs/toolkit'
import bridgeReducer from '@/features/bridge/bridgeSlice'
import bimReducer from '@/features/bim-viewer/bimSlice'

export const store = configureStore({
  reducer: {
    bridge: bridgeReducer,
    bim: bimReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

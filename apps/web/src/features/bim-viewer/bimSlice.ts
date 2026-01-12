import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { bimApi } from './api'
import type { BIMModel, BIMComponent, BIMFilter } from '@bridge-bim-platform/shared'
import {
  createAsyncThunkWithErrorHandling,
  handleMultiAsyncThunk,
  createAsyncState,
  createMultiAsyncState,
} from '@/shared/redux'

// Async Thunks
export const loadBIMModel = createAsyncThunkWithErrorHandling<
  string,
  { bridgeId: string; model: BIMModel }
>(
  'bim/loadModel',
  async (bridgeId: string) => {
    const model = await bimApi.getModelByBridgeId(bridgeId)
    return { bridgeId, model }
  },
  'BIM 모델을 불러오는데 실패했습니다.',
)

export const loadBIMComponents = createAsyncThunkWithErrorHandling<
  { modelId: string; filter?: BIMFilter },
  { modelId: string; components: BIMComponent[] }
>(
  'bim/loadComponents',
  async ({ modelId, filter }) => {
    const components = await bimApi.getComponents(modelId, filter)
    return { modelId, components }
  },
  'BIM 부재 목록을 불러오는데 실패했습니다.',
)

export const loadBIMComponent = createAsyncThunkWithErrorHandling<
  { modelId: string; componentId: string },
  BIMComponent
>(
  'bim/loadComponent',
  async ({ modelId, componentId }) => {
    return await bimApi.getComponent(modelId, componentId)
  },
  'BIM 부재 정보를 불러오는데 실패했습니다.',
)

interface BIMState {
  models: Record<string, BIMModel> // bridgeId -> BIMModel
  components: Record<string, BIMComponent[]> // modelId -> BIMComponent[]
  currentComponent: ReturnType<typeof createAsyncState<BIMComponent | null>>
  asyncState: ReturnType<typeof createMultiAsyncState>
}

const initialState: BIMState = {
  models: {},
  components: {},
  currentComponent: createAsyncState<BIMComponent | null>(null),
  asyncState: createMultiAsyncState(['model', 'components', 'component']),
}

const bimSlice = createSlice({
  name: 'bim',
  initialState,
  reducers: {
    clearModel: (state, action: PayloadAction<string>) => {
      const bridgeId = action.payload
      delete state.models[bridgeId]
    },
    clearComponents: (state, action: PayloadAction<string>) => {
      const modelId = action.payload
      delete state.components[modelId]
    },
    clearCurrentComponent: (state) => {
      state.currentComponent.data = null
      state.currentComponent.error = null
    },
    clearError: (state, action: PayloadAction<'model' | 'components' | 'component'>) => {
      state.asyncState.error[action.payload] = null
    },
  },
  extraReducers: (builder) => {
    // loadBIMModel
    handleMultiAsyncThunk(
      builder,
      loadBIMModel,
      'model',
      (state) => state.asyncState,
      (state, action: PayloadAction<{ bridgeId: string; model: BIMModel }>) => {
        state.models[action.payload.bridgeId] = action.payload.model
      },
    )

    // loadBIMComponents
    handleMultiAsyncThunk(
      builder,
      loadBIMComponents,
      'components',
      (state) => state.asyncState,
      (
        state,
        action: PayloadAction<{ modelId: string; components: BIMComponent[] }>,
      ) => {
        state.components[action.payload.modelId] = action.payload.components
      },
    )

    // loadBIMComponent
    handleMultiAsyncThunk(
      builder,
      loadBIMComponent,
      'component',
      (state) => state.asyncState,
      (state, action: PayloadAction<BIMComponent>) => {
        state.currentComponent.data = action.payload
      },
    )
  },
})

export const { clearModel, clearComponents, clearCurrentComponent, clearError } =
  bimSlice.actions
export default bimSlice.reducer

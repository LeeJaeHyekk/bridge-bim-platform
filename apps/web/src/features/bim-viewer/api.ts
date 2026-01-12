import type {
  BIMModel,
  BIMComponent,
  BIMGeometry,
  BIMRelationship,
  BIMFilter,
} from '@bridge-bim-platform/shared'

const API_BASE_URL = '/api/bim'

export const bimApi = {
  async getModelByBridgeId(bridgeId: string): Promise<BIMModel> {
    const response = await fetch(`${API_BASE_URL}/bridges/${bridgeId}/bim`)
    if (!response.ok) {
      throw new Error('BIM 모델을 불러올 수 없습니다.')
    }
    return response.json()
  },

  async getModelById(modelId: string): Promise<BIMModel> {
    const response = await fetch(`${API_BASE_URL}/models/${modelId}`)
    if (!response.ok) {
      throw new Error('BIM 모델을 불러올 수 없습니다.')
    }
    return response.json()
  },

  async getComponents(
    modelId: string,
    filter?: BIMFilter,
  ): Promise<BIMComponent[]> {
    const params = new URLSearchParams()
    if (filter) {
      params.append('filter', JSON.stringify(filter))
    }

    const response = await fetch(
      `${API_BASE_URL}/models/${modelId}/components?${params.toString()}`,
    )
    if (!response.ok) {
      throw new Error('부재 목록을 불러올 수 없습니다.')
    }
    return response.json()
  },

  async getComponent(
    modelId: string,
    componentId: string,
  ): Promise<BIMComponent> {
    const response = await fetch(
      `${API_BASE_URL}/models/${modelId}/components/${componentId}`,
    )
    if (!response.ok) {
      throw new Error('부재 정보를 불러올 수 없습니다.')
    }
    return response.json()
  },

  async getGeometry(
    modelId: string,
    componentId: string,
  ): Promise<BIMGeometry> {
    const response = await fetch(
      `${API_BASE_URL}/models/${modelId}/components/${componentId}/geometry`,
    )
    if (!response.ok) {
      throw new Error('형상 데이터를 불러올 수 없습니다.')
    }
    return response.json()
  },

  async getRelationships(modelId: string): Promise<BIMRelationship[]> {
    const response = await fetch(
      `${API_BASE_URL}/models/${modelId}/relationships`,
    )
    if (!response.ok) {
      throw new Error('관계 정보를 불러올 수 없습니다.')
    }
    return response.json()
  },
}

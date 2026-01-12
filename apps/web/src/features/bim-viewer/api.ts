import type {
  BIMModel,
  BIMComponent,
  BIMGeometry,
  BIMRelationship,
  BIMFilter,
} from '@bridge-bim-platform/shared'

const API_BASE_URL = '/api/bim'

async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`${errorMessage} (404: 리소스를 찾을 수 없습니다)`)
    }
    if (response.status >= 500) {
      throw new Error(`${errorMessage} (서버 오류: ${response.status})`)
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || errorMessage)
  }
  return response.json()
}

export const bimApi = {
  async getModelByBridgeId(bridgeId: string): Promise<BIMModel> {
    try {
      const response = await fetch(`${API_BASE_URL}/bridges/${bridgeId}/bim`)
      return handleResponse<BIMModel>(response, 'BIM 모델을 불러올 수 없습니다.')
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  },

  async getModelById(modelId: string): Promise<BIMModel> {
    try {
      const response = await fetch(`${API_BASE_URL}/models/${modelId}`)
      return handleResponse<BIMModel>(response, 'BIM 모델을 불러올 수 없습니다.')
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  },

  async getComponents(
    modelId: string,
    filter?: BIMFilter,
  ): Promise<BIMComponent[]> {
    try {
      const params = new URLSearchParams()
      if (filter) {
        params.append('filter', JSON.stringify(filter))
      }

      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/components?${params.toString()}`,
      )
      return handleResponse<BIMComponent[]>(response, '부재 목록을 불러올 수 없습니다.')
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  },

  async getComponent(
    modelId: string,
    componentId: string,
  ): Promise<BIMComponent> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/components/${componentId}`,
      )
      return handleResponse<BIMComponent>(response, '부재 정보를 불러올 수 없습니다.')
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  },

  async getGeometry(
    modelId: string,
    componentId: string,
  ): Promise<BIMGeometry> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/components/${componentId}/geometry`,
      )
      return handleResponse<BIMGeometry>(response, '형상 데이터를 불러올 수 없습니다.')
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  },

  async getRelationships(modelId: string): Promise<BIMRelationship[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/models/${modelId}/relationships`,
      )
      return handleResponse<BIMRelationship[]>(response, '관계 정보를 불러올 수 없습니다.')
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  },
}

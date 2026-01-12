import type { Bridge } from '@bridge-bim-platform/shared'

const API_BASE_URL = '/api'

export async function fetchBridges(): Promise<Bridge[]> {
  const response = await fetch(`${API_BASE_URL}/bridges`)
  if (!response.ok) {
    throw new Error('교량 목록을 불러오는데 실패했습니다.')
  }
  return response.json()
}

export async function fetchBridgeById(id: string): Promise<Bridge | null> {
  const response = await fetch(`${API_BASE_URL}/bridges/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('교량 정보를 불러오는데 실패했습니다.')
  }
  return response.json()
}

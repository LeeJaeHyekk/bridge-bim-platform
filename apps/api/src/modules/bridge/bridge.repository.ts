import type { Bridge } from '@bridge-bim-platform/shared'

// Mock 데이터 (실제로는 DB에서 가져옴)
const mockBridges: Bridge[] = [
  {
    id: '1',
    name: '한강대교',
    location: '서울특별시',
    status: 'SAFE',
  },
  {
    id: '2',
    name: '마포대교',
    location: '서울특별시',
    status: 'WARNING',
  },
  {
    id: '3',
    name: '잠실대교',
    location: '서울특별시',
    status: 'SAFE',
  },
]

export const bridgeRepository = {
  async findAll(): Promise<Bridge[]> {
    // 실제로는 DB 쿼리
    return Promise.resolve(mockBridges)
  },

  async findById(id: string): Promise<Bridge | null> {
    // 실제로는 DB 쿼리
    const bridge = mockBridges.find((b) => b.id === id)
    return Promise.resolve(bridge || null)
  },
}

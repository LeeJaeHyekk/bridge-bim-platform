import type {
  BIMModel,
  BIMComponent,
  BIMGeometry,
  BIMRelationship,
  BIMFilter,
} from '@bridge-bim-platform/shared'

// Mock 데이터 (실제로는 DB에서 가져옴)
const mockBIMModels: BIMModel[] = [
  {
    metadata: {
      id: 'bim-1',
      bridgeId: '1',
      name: '해상 사장교 BIM 모델 (Photo Based)',
      version: '1.0.0',
      sourceFormat: 'IFC',
      convertedAt: '2024-01-15T10:00:00Z',
      componentCount: 18,
      geometryFormat: 'glTF',
    },
    components: [
      // 주탑 (1개) - 단일 주탑 사장교
      {
        id: 'pylon-main',
        name: '주탑',
        type: 'Pylon',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 45, unit: 'm' },
          { key: 'width', value: 4, unit: 'm' },
          { key: 'bridgeType', value: 'CableStayed', unit: undefined },
        ],
        status: 'SAFE',
      },
      // 상판 (1개)
      {
        id: 'deck-main',
        name: '상판',
        type: 'Deck',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'length', value: 180, unit: 'm' },
          { key: 'width', value: 14, unit: 'm' },
          { key: 'thickness', value: 1.2, unit: 'm' },
        ],
        status: 'SAFE',
      },
      // 해상 교각 (6개)
      {
        id: 'pier-1',
        name: '해상 교각 1',
        type: 'Column',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 18, unit: 'm' },
          { key: 'width', value: 3, unit: 'm' },
        ],
        status: 'SAFE',
      },
      {
        id: 'pier-2',
        name: '해상 교각 2',
        type: 'Column',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 18, unit: 'm' },
          { key: 'width', value: 3, unit: 'm' },
        ],
        status: 'SAFE',
      },
      {
        id: 'pier-3',
        name: '해상 교각 3',
        type: 'Column',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 18, unit: 'm' },
          { key: 'width', value: 3, unit: 'm' },
        ],
        status: 'SAFE',
      },
      {
        id: 'pier-4',
        name: '해상 교각 4',
        type: 'Column',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 18, unit: 'm' },
          { key: 'width', value: 3, unit: 'm' },
        ],
        status: 'SAFE',
      },
      {
        id: 'pier-5',
        name: '해상 교각 5',
        type: 'Column',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 18, unit: 'm' },
          { key: 'width', value: 3, unit: 'm' },
        ],
        status: 'SAFE',
      },
      {
        id: 'pier-6',
        name: '해상 교각 6',
        type: 'Column',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 18, unit: 'm' },
          { key: 'width', value: 3, unit: 'm' },
        ],
        status: 'SAFE',
      },
      // 사장 케이블 (10개) - 부채꼴 형태
      {
        id: 'cable-1',
        name: '사장 케이블 1',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4200, unit: 'kN' },
        ],
        status: 'WARNING',
      },
      {
        id: 'cable-2',
        name: '사장 케이블 2',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4100, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-3',
        name: '사장 케이블 3',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4000, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-4',
        name: '사장 케이블 4',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 3900, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-5',
        name: '사장 케이블 5',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 3800, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-6',
        name: '사장 케이블 6',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 3800, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-7',
        name: '사장 케이블 7',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 3900, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-8',
        name: '사장 케이블 8',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4000, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-9',
        name: '사장 케이블 9',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4100, unit: 'kN' },
        ],
        status: 'SAFE',
      },
      {
        id: 'cable-10',
        name: '사장 케이블 10',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4200, unit: 'kN' },
        ],
        status: 'SAFE',
      },
    ],
    geometries: [
      // 주탑 (상판 중앙에 위치, X=0 중심)
      {
        componentId: 'pylon-main',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pylon-main.gltf',
        boundingBox: {
          min: [-2, 0, -2],
          max: [2, 45, 2],
        },
      },
      // 상판 (주탑 기준 좌우 대칭, 총 길이 180m)
      {
        componentId: 'deck-main',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/deck-main.gltf',
        boundingBox: {
          min: [-90, 18, -7],
          max: [90, 19.2, 7],
        },
      },
      // 해상 교각 6개 (주탑 기준 좌우 대칭 배치, 30m 간격)
      {
        componentId: 'pier-1',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pier-1.gltf',
        boundingBox: {
          min: [-75.5, 0, -1.5],
          max: [-72.5, 18, 1.5],
        },
      },
      {
        componentId: 'pier-2',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pier-2.gltf',
        boundingBox: {
          min: [-45.5, 0, -1.5],
          max: [-42.5, 18, 1.5],
        },
      },
      {
        componentId: 'pier-3',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pier-3.gltf',
        boundingBox: {
          min: [-15.5, 0, -1.5],
          max: [-12.5, 18, 1.5],
        },
      },
      {
        componentId: 'pier-4',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pier-4.gltf',
        boundingBox: {
          min: [12.5, 0, -1.5],
          max: [15.5, 18, 1.5],
        },
      },
      {
        componentId: 'pier-5',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pier-5.gltf',
        boundingBox: {
          min: [42.5, 0, -1.5],
          max: [45.5, 18, 1.5],
        },
      },
      {
        componentId: 'pier-6',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/pier-6.gltf',
        boundingBox: {
          min: [72.5, 0, -1.5],
          max: [75.5, 18, 1.5],
        },
      },
      // 사장 케이블 10개 (주탑 상단 중앙 [0, 45, 0] → 상판에 일정 간격 15m로 연결)
      // 좌측 5개: -75, -60, -45, -30, -15
      {
        componentId: 'cable-1',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-1.gltf',
        boundingBox: {
          min: [0, 45, 0], // 주탑 상단 중앙 (상판 중앙과 일치)
          max: [-75, 19, 0], // 상판 좌측, 15m 간격
        },
      },
      {
        componentId: 'cable-2',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-2.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [-60, 19, 0],
        },
      },
      {
        componentId: 'cable-3',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-3.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [-45, 19, 0],
        },
      },
      {
        componentId: 'cable-4',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-4.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [-30, 19, 0],
        },
      },
      {
        componentId: 'cable-5',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-5.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [-15, 19, 0],
        },
      },
      // 우측 5개: 15, 30, 45, 60, 75
      {
        componentId: 'cable-6',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-6.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [15, 19, 0],
        },
      },
      {
        componentId: 'cable-7',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-7.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [30, 19, 0],
        },
      },
      {
        componentId: 'cable-8',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-8.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [45, 19, 0],
        },
      },
      {
        componentId: 'cable-9',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-9.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [60, 19, 0],
        },
      },
      {
        componentId: 'cable-10',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/cable-10.gltf',
        boundingBox: {
          min: [0, 45, 0],
          max: [75, 19, 0],
        },
      },
    ],
    relationships: [
      // 주탑 → 케이블 (10개)
      {
        id: 'rel-pylon-cable-1',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-1',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-2',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-2',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-3',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-3',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-4',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-4',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-5',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-5',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-6',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-6',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-7',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-7',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-8',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-8',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-9',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-9',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pylon-cable-10',
        fromComponentId: 'pylon-main',
        toComponentId: 'cable-10',
        type: 'SUPPORTS',
      },
      // 케이블 → 상판 (10개)
      {
        id: 'rel-cable-1-deck',
        fromComponentId: 'cable-1',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-2-deck',
        fromComponentId: 'cable-2',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-3-deck',
        fromComponentId: 'cable-3',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-4-deck',
        fromComponentId: 'cable-4',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-5-deck',
        fromComponentId: 'cable-5',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-6-deck',
        fromComponentId: 'cable-6',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-7-deck',
        fromComponentId: 'cable-7',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-8-deck',
        fromComponentId: 'cable-8',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-9-deck',
        fromComponentId: 'cable-9',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-cable-10-deck',
        fromComponentId: 'cable-10',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      // 교각 → 상판 (6개)
      {
        id: 'rel-pier-1-deck',
        fromComponentId: 'pier-1',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pier-2-deck',
        fromComponentId: 'pier-2',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pier-3-deck',
        fromComponentId: 'pier-3',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pier-4-deck',
        fromComponentId: 'pier-4',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pier-5-deck',
        fromComponentId: 'pier-5',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-pier-6-deck',
        fromComponentId: 'pier-6',
        toComponentId: 'deck-main',
        type: 'SUPPORTS',
      },
    ],
  },
  {
    metadata: {
      id: 'bim-2',
      bridgeId: '2',
      name: '마포대교 BIM 모델',
      version: '1.0.0',
      sourceFormat: 'IFC',
      convertedAt: '2024-01-20T10:00:00Z',
      componentCount: 4,
      geometryFormat: 'glTF',
    },
    components: [
      {
        id: 'comp-4',
        name: '주탑 1',
        type: 'Pylon',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 45, unit: 'm' },
          { key: 'strength', value: 25, unit: 'MPa' },
        ],
        status: 'WARNING',
      },
      {
        id: 'comp-5',
        name: '케이블 세트 1',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.12, unit: 'm' },
          { key: 'tension', value: 4500, unit: 'kN' },
        ],
        parentId: 'comp-4',
        status: 'WARNING',
      },
      {
        id: 'comp-6',
        name: '상판 구간 1',
        type: 'Deck',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'thickness', value: 0.25, unit: 'm' },
          { key: 'width', value: 18, unit: 'm' },
        ],
        status: 'WARNING',
      },
      {
        id: 'comp-7',
        name: '기초 1',
        type: 'Foundation',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'depth', value: 15, unit: 'm' },
          { key: 'width', value: 8, unit: 'm' },
        ],
        status: 'SAFE',
      },
    ],
    geometries: [
      {
        componentId: 'comp-4',
        format: 'glTF',
        url: '/api/bim/models/bim-2/geometry/comp-4.gltf',
        boundingBox: {
          min: [0, 0, 0],
          max: [4, 45, 4],
        },
        vertexCount: 800,
        fileSize: 400000,
      },
      {
        componentId: 'comp-5',
        format: 'glTF',
        url: '/api/bim/models/bim-2/geometry/comp-5.gltf',
        boundingBox: {
          min: [2, 22, 2],
          max: [6, 40, 6],
        },
        vertexCount: 400,
        fileSize: 200000,
      },
      {
        componentId: 'comp-6',
        format: 'glTF',
        url: '/api/bim/models/bim-2/geometry/comp-6.gltf',
        boundingBox: {
          min: [-9, 35, -1.5],
          max: [9, 37, 1.5],
        },
        vertexCount: 600,
        fileSize: 300000,
      },
      {
        componentId: 'comp-7',
        format: 'glTF',
        url: '/api/bim/models/bim-2/geometry/comp-7.gltf',
        boundingBox: {
          min: [-4, -15, -4],
          max: [4, 0, 4],
        },
        vertexCount: 700,
        fileSize: 350000,
      },
    ],
    relationships: [
      {
        id: 'rel-3',
        fromComponentId: 'comp-7',
        toComponentId: 'comp-4',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-4',
        fromComponentId: 'comp-4',
        toComponentId: 'comp-5',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-5',
        fromComponentId: 'comp-5',
        toComponentId: 'comp-6',
        type: 'SUPPORTS',
      },
    ],
  },
]

export const bimRepository = {
  async findByBridgeId(bridgeId: string): Promise<BIMModel | null> {
    const model = mockBIMModels.find((m) => m.metadata.bridgeId === bridgeId)
    return Promise.resolve(model || null)
  },

  async findModelById(modelId: string): Promise<BIMModel | null> {
    const model = mockBIMModels.find((m) => m.metadata.id === modelId)
    return Promise.resolve(model || null)
  },

  async findComponentsByModelId(
    modelId: string,
    filter?: BIMFilter,
  ): Promise<BIMComponent[]> {
    const model = mockBIMModels.find((m) => m.metadata.id === modelId)
    if (!model) return Promise.resolve([])

    let components = [...model.components]

    // 필터 적용
    if (filter) {
      if (filter.componentType && filter.componentType.length > 0) {
        components = components.filter((c) =>
          filter.componentType!.includes(c.type),
        )
      }

      if (filter.status && filter.status.length > 0) {
        components = components.filter(
          (c) => c.status && filter.status!.includes(c.status),
        )
      }

      if (filter.propertyFilters) {
        components = components.filter((component) => {
          return filter.propertyFilters!.every((pf) => {
            const prop = component.properties.find((p) => p.key === pf.key)
            if (!prop) return false

            switch (pf.operator) {
              case 'equals':
                return prop.value === pf.value
              case 'contains':
                return String(prop.value).includes(String(pf.value))
              case 'greaterThan':
                return Number(prop.value) > Number(pf.value)
              case 'lessThan':
                return Number(prop.value) < Number(pf.value)
              default:
                return false
            }
          })
        })
      }
    }

    return Promise.resolve(components)
  },

  async findComponentById(
    modelId: string,
    componentId: string,
  ): Promise<BIMComponent | null> {
    const model = mockBIMModels.find((m) => m.metadata.id === modelId)
    if (!model) return Promise.resolve(null)

    const component = model.components.find((c) => c.id === componentId)
    return Promise.resolve(component || null)
  },

  async findGeometryByComponentId(
    modelId: string,
    componentId: string,
  ): Promise<BIMGeometry | null> {
    const model = mockBIMModels.find((m) => m.metadata.id === modelId)
    if (!model) return Promise.resolve(null)

    const geometry = model.geometries.find((g) => g.componentId === componentId)
    return Promise.resolve(geometry || null)
  },

  async findRelationshipsByModelId(
    modelId: string,
  ): Promise<BIMRelationship[]> {
    const model = mockBIMModels.find((m) => m.metadata.id === modelId)
    if (!model) return Promise.resolve([])

    return Promise.resolve(model.relationships)
  },
}

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
      name: '한강대교 BIM 모델',
      version: '1.0.0',
      sourceFormat: 'IFC',
      convertedAt: '2024-01-15T10:00:00Z',
      componentCount: 5,
      geometryFormat: 'glTF',
    },
    components: [
      {
        id: 'comp-1',
        name: '주탑 1',
        type: 'Pylon',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'height', value: 50, unit: 'm' },
          { key: 'strength', value: 27, unit: 'MPa' },
        ],
        status: 'SAFE',
      },
      {
        id: 'comp-2',
        name: '케이블 세트 1',
        type: 'Cable',
        properties: [
          { key: 'material', value: 'Steel', unit: undefined },
          { key: 'diameter', value: 0.15, unit: 'm' },
          { key: 'tension', value: 5000, unit: 'kN' },
        ],
        parentId: 'comp-1',
        status: 'SAFE',
      },
      {
        id: 'comp-3',
        name: '상판 구간 1',
        type: 'Deck',
        properties: [
          { key: 'material', value: 'Concrete', unit: undefined },
          { key: 'thickness', value: 0.3, unit: 'm' },
          { key: 'width', value: 20, unit: 'm' },
        ],
        status: 'WARNING',
      },
    ],
    geometries: [
      {
        componentId: 'comp-1',
        format: 'glTF',
        url: '/api/bim/models/bim-1/geometry/comp-1.gltf',
        boundingBox: {
          min: [0, 0, 0],
          max: [5, 50, 5],
        },
        vertexCount: 1000,
        fileSize: 500000,
      },
    ],
    relationships: [
      {
        id: 'rel-1',
        fromComponentId: 'comp-1',
        toComponentId: 'comp-2',
        type: 'SUPPORTS',
      },
      {
        id: 'rel-2',
        fromComponentId: 'comp-2',
        toComponentId: 'comp-3',
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

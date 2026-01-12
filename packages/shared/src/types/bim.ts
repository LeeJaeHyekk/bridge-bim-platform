// BIM 관련 타입 정의

/**
 * BIM 부재 타입
 */
export type BIMComponentType =
  | 'Pylon' // 주탑
  | 'Cable' // 케이블
  | 'Deck' // 상판
  | 'Foundation' // 기초
  | 'Beam' // 보
  | 'Column' // 기둥
  | 'Wall' // 벽
  | 'Other' // 기타

/**
 * BIM 부재 속성
 */
export interface BIMComponentProperty {
  key: string
  value: string | number | boolean
  unit?: string
}

/**
 * BIM 부재 (Component/Element)
 */
export interface BIMComponent {
  id: string
  name: string
  type: BIMComponentType
  properties: BIMComponentProperty[]
  parentId?: string // 상위 부재 ID (계층 구조)
  childrenIds?: string[] // 하위 부재 ID 목록
  status?: 'SAFE' | 'WARNING' | 'DANGER'
  createdAt?: string
  updatedAt?: string
}

/**
 * BIM 형상 데이터 (경량화된 3D 모델)
 */
export interface BIMGeometry {
  componentId: string
  format: 'glTF' | 'OBJ' | 'IFC' // 형식
  url: string // 파일 경로 또는 URL
  boundingBox: {
    min: [number, number, number]
    max: [number, number, number]
  }
  vertexCount?: number
  fileSize?: number // 바이트 단위
}

/**
 * BIM 모델 관계 정보
 */
export interface BIMRelationship {
  id: string
  fromComponentId: string
  toComponentId: string
  type: 'CONTAINS' | 'CONNECTS' | 'SUPPORTS' | 'RELATED'
  properties?: BIMComponentProperty[]
}

/**
 * BIM 모델 메타데이터
 */
export interface BIMModelMetadata {
  id: string
  bridgeId: string
  name: string
  version: string
  sourceFormat: 'IFC' | 'Revit' | 'Other'
  sourceFileUrl?: string
  convertedAt: string
  componentCount: number
  geometryFormat: 'glTF' | 'OBJ' | 'IFC'
}

/**
 * BIM 모델 전체 정보
 */
export interface BIMModel {
  metadata: BIMModelMetadata
  components: BIMComponent[]
  geometries: BIMGeometry[]
  relationships: BIMRelationship[]
}

/**
 * BIM 필터 조건
 */
export interface BIMFilter {
  componentType?: BIMComponentType[]
  status?: ('SAFE' | 'WARNING' | 'DANGER')[]
  propertyFilters?: {
    key: string
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan'
    value: string | number
  }[]
}

/**
 * BIM 검색 결과
 */
export interface BIMSearchResult {
  components: BIMComponent[]
  total: number
  page: number
  pageSize: number
}

import { bimRepository } from './bim.repository'
import type {
  BIMModel,
  BIMComponent,
  BIMGeometry,
  BIMRelationship,
  BIMFilter,
} from '@bridge-bim-platform/shared'

export const bimService = {
  async getModelByBridgeId(bridgeId: string): Promise<BIMModel | null> {
    return bimRepository.findByBridgeId(bridgeId)
  },

  async getModelById(modelId: string): Promise<BIMModel | null> {
    return bimRepository.findModelById(modelId)
  },

  async getComponents(
    modelId: string,
    filter?: BIMFilter,
  ): Promise<BIMComponent[]> {
    return bimRepository.findComponentsByModelId(modelId, filter)
  },

  async getComponent(
    modelId: string,
    componentId: string,
  ): Promise<BIMComponent | null> {
    return bimRepository.findComponentById(modelId, componentId)
  },

  async getGeometry(
    modelId: string,
    componentId: string,
  ): Promise<BIMGeometry | null> {
    return bimRepository.findGeometryByComponentId(modelId, componentId)
  },

  async getRelationships(modelId: string): Promise<BIMRelationship[]> {
    return bimRepository.findRelationshipsByModelId(modelId)
  },

  // 향후 구현: BIM 파일 업로드 및 변환
  async uploadAndConvert(_file: File): Promise<BIMModel> {
    // TODO: IFC/Revit 파일을 파싱하고 웹용 포맷으로 변환
    // 1. 파일 파싱 (IFC.js 또는 다른 라이브러리 사용)
    // 2. 형상 데이터 경량화 (glTF 변환)
    // 3. 속성 데이터 추출 및 저장
    // 4. 관계 정보 추출
    throw new Error('Not implemented yet')
  },
}

import { Router } from 'express'
import { bimController } from './bim.controller'

export const bimRoute = Router()

// 교량 ID로 BIM 모델 조회
bimRoute.get('/bridges/:bridgeId/bim', bimController.getModelByBridgeId)

// BIM 모델 ID로 상세 조회
bimRoute.get('/models/:modelId', bimController.getModelById)

// 부재 목록 조회 (필터 지원)
bimRoute.get('/models/:modelId/components', bimController.getComponents)

// 특정 부재 조회
bimRoute.get(
  '/models/:modelId/components/:componentId',
  bimController.getComponent,
)

// 부재 형상 데이터 조회
bimRoute.get(
  '/models/:modelId/components/:componentId/geometry',
  bimController.getGeometry,
)

// 관계 정보 조회
bimRoute.get('/models/:modelId/relationships', bimController.getRelationships)

// 향후 구현: BIM 파일 업로드
// bimRoute.post('/upload', upload.single('file'), bimController.uploadModel)

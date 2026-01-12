import { Request, Response, NextFunction } from 'express'
import { bimService } from './bim.service'
import type { BIMFilter } from '@bridge-bim-platform/shared'

export const bimController = {
  async getModelByBridgeId(req: Request, res: Response, next: NextFunction) {
    try {
      const { bridgeId } = req.params
      const model = await bimService.getModelByBridgeId(bridgeId)
      if (!model) {
        res.status(404).json({ message: 'BIM 모델을 찾을 수 없습니다.' })
        return
      }
      res.json(model)
    } catch (error) {
      next(error)
    }
  },

  async getModelById(req: Request, res: Response, next: NextFunction) {
    try {
      const { modelId } = req.params
      const model = await bimService.getModelById(modelId)
      if (!model) {
        res.status(404).json({ message: 'BIM 모델을 찾을 수 없습니다.' })
        return
      }
      res.json(model)
    } catch (error) {
      next(error)
    }
  },

  async getComponents(req: Request, res: Response, next: NextFunction) {
    try {
      const { modelId } = req.params
      const filter: BIMFilter | undefined = req.query.filter
        ? JSON.parse(req.query.filter as string)
        : undefined

      const components = await bimService.getComponents(modelId, filter)
      res.json(components)
    } catch (error) {
      next(error)
    }
  },

  async getComponent(req: Request, res: Response, next: NextFunction) {
    try {
      const { modelId, componentId } = req.params
      const component = await bimService.getComponent(modelId, componentId)
      if (!component) {
        res.status(404).json({ message: '부재를 찾을 수 없습니다.' })
        return
      }
      res.json(component)
    } catch (error) {
      next(error)
    }
  },

  async getGeometry(req: Request, res: Response, next: NextFunction) {
    try {
      const { modelId, componentId } = req.params
      const geometry = await bimService.getGeometry(modelId, componentId)
      if (!geometry) {
        res.status(404).json({ message: '형상 데이터를 찾을 수 없습니다.' })
        return
      }
      res.json(geometry)
    } catch (error) {
      next(error)
    }
  },

  async getRelationships(req: Request, res: Response, next: NextFunction) {
    try {
      const { modelId } = req.params
      const relationships = await bimService.getRelationships(modelId)
      res.json(relationships)
    } catch (error) {
      next(error)
    }
  },

  // 향후 구현: 파일 업로드
  async uploadModel(_req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: multer 미들웨어로 파일 업로드 처리
      res.status(501).json({ message: '아직 구현되지 않았습니다.' })
    } catch (error) {
      next(error)
    }
  },
}

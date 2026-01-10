import { Request, Response, NextFunction } from 'express'
import { bridgeService } from './bridge.service'

export const bridgeController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const bridges = await bridgeService.findAll()
      res.json(bridges)
    } catch (error) {
      next(error)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const bridge = await bridgeService.findById(id)
      if (!bridge) {
        res.status(404).json({ message: '교량을 찾을 수 없습니다.' })
        return
      }
      res.json(bridge)
    } catch (error) {
      next(error)
    }
  },
}

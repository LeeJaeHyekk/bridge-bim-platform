import { Router } from 'express'
import { bridgeController } from './bridge.controller'

export const bridgeRoute = Router()

bridgeRoute.get('/', bridgeController.getAll)
bridgeRoute.get('/:id', bridgeController.getById)

import { bridgeRepository } from './bridge.repository'
import type { Bridge } from '@bridge-bim-platform/shared'

export const bridgeService = {
  async findAll(): Promise<Bridge[]> {
    return bridgeRepository.findAll()
  },

  async findById(id: string): Promise<Bridge | null> {
    return bridgeRepository.findById(id)
  },
}

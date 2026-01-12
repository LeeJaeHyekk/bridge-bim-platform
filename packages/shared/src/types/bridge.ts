import type { BridgeStatus } from '../enums/bridge-status'

export interface Bridge {
  id: string
  name: string
  location: string
  status: BridgeStatus
}

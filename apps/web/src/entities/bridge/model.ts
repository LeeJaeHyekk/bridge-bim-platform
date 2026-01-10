import type { Bridge } from '@bridge-bim-platform/shared'

export class BridgeModel {
  constructor(private bridge: Bridge) {}

  get id() {
    return this.bridge.id
  }

  get name() {
    return this.bridge.name
  }

  get location() {
    return this.bridge.location
  }

  get status() {
    return this.bridge.status
  }

  isSafe() {
    return this.bridge.status === 'SAFE'
  }

  isWarning() {
    return this.bridge.status === 'WARNING'
  }

  isDanger() {
    return this.bridge.status === 'DANGER'
  }
}

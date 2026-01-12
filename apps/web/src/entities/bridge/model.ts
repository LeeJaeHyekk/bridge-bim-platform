import type { Bridge } from '@bridge-bim-platform/shared'

interface BridgeModelState {
  bridge: Bridge
}

function createBridgeModel(bridge: Bridge) {
  const state: BridgeModelState = {
    bridge,
  }

  function getId() {
    return state.bridge.id
  }

  function getName() {
    return state.bridge.name
  }

  function getLocation() {
    return state.bridge.location
  }

  function getStatus() {
    return state.bridge.status
  }

  function isSafe() {
    return state.bridge.status === 'SAFE'
  }

  function isWarning() {
    return state.bridge.status === 'WARNING'
  }

  function isDanger() {
    return state.bridge.status === 'DANGER'
  }

  return {
    get id() {
      return getId()
    },
    get name() {
      return getName()
    },
    get location() {
      return getLocation()
    },
    get status() {
      return getStatus()
    },
    isSafe,
    isWarning,
    isDanger,
  }
}

export type BridgeModel = ReturnType<typeof createBridgeModel>

export function createBridgeModelInstance(bridge: Bridge) {
  return createBridgeModel(bridge)
}

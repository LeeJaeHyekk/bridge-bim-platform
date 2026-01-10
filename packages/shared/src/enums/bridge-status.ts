export const BridgeStatus = {
  SAFE: 'SAFE',
  WARNING: 'WARNING',
  DANGER: 'DANGER',
} as const

export type BridgeStatus = (typeof BridgeStatus)[keyof typeof BridgeStatus]

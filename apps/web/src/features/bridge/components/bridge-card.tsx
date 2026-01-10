import type { Bridge } from '@bridge-bim-platform/shared'

interface BridgeCardProps {
  bridge: Bridge
}

export function BridgeCard({ bridge }: BridgeCardProps) {
  return (
    <div>
      <h3>{bridge.name}</h3>
      <p>위치: {bridge.location}</p>
      <p>상태: {bridge.status}</p>
    </div>
  )
}

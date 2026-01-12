import type { Bridge } from '@bridge-bim-platform/shared'
import styles from '@/shared/styles/bridge-card.module.css'
import { clsx } from 'clsx'

interface BridgeCardProps {
  bridge: Bridge
}

export function BridgeCard({ bridge }: BridgeCardProps) {
  const statusConfig = {
    SAFE: {
      className: styles.statusSafe,
      label: '안전',
    },
    WARNING: {
      className: styles.statusWarning,
      label: '주의',
    },
    DANGER: {
      className: styles.statusDanger,
      label: '위험',
    },
  }

  const config = statusConfig[bridge.status]

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{bridge.name}</h3>
        <span className={clsx(styles.statusBadge, config.className)}>
          {config.label}
        </span>
      </div>
      <div className={styles.footer}>
        <p className={styles.location}>
          <span className={styles.locationIcon}>📍</span>
          {bridge.location}
        </p>
      </div>
    </div>
  )
}

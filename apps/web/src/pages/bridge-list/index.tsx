import { Link } from 'react-router-dom'
import { useBridges } from '@/features/bridge/hooks'
import { BridgeCard } from '@/features/bridge/components'
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'
import styles from './bridge-list.module.css'

export function BridgeListPage() {
  const { bridges, loading, error } = useBridges()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingText}>
              <LoadingSpinner size="lg" />
              <p className={styles.loadingMessage}>교량 목록을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.contentWrapper}>
          <ErrorMessage message={`교량 목록을 불러올 수 없습니다: ${error.message}`} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <Link
            to="/"
            className={styles.backLink}
          >
            <span className={styles.backIcon}>←</span>
            대시보드로 돌아가기
          </Link>
          <div className={styles.headerCard}>
            <h1 className={styles.title}>
              교량 목록
            </h1>
            <p className={styles.description}>
              총 <span className={styles.bridgeCount}>{bridges.length}</span>개의 교량이 등록되어 있습니다.
            </p>
          </div>
        </div>

        {bridges.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🌉</div>
            <p className={styles.emptyTitle}>등록된 교량이 없습니다.</p>
            <p className={styles.emptySubtitle}>새로운 교량을 등록해보세요.</p>
          </div>
        ) : (
          <div className={styles.bridgeGrid}>
            {bridges.map((bridge) => (
              <Link
                key={bridge.id}
                to={`/bridges/${bridge.id}`}
                className={styles.bridgeLink}
              >
                <BridgeCard bridge={bridge} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

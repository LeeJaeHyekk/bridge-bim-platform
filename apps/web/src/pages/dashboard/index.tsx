import { Link } from 'react-router-dom'
import { useBridges } from '@/features/bridge/hooks'
import { BridgeCard } from '@/features/bridge/components'
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'
import type { Bridge } from '@bridge-bim-platform/shared'
import styles from './dashboard.module.css'
import { clsx } from 'clsx'

export function DashboardPage() {
  const { bridges, loading, error } = useBridges()

  // 통계 계산
  const stats = {
    total: bridges.length,
    safe: bridges.filter((b) => b.status === 'SAFE').length,
    warning: bridges.filter((b) => b.status === 'WARNING').length,
    danger: bridges.filter((b) => b.status === 'DANGER').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-500">데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage message={`데이터를 불러올 수 없습니다: ${error.message}`} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>대시보드</h1>
          <p className={styles.subtitle}>교량 정보와 BIM 모델을 통합 관리하는 플랫폼</p>
        </div>

        {/* 통계 카드 */}
        <div className={styles.statsGrid}>
          <div className={clsx(styles.statCard, styles.statCardBlue)}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>전체 교량</p>
                <p className={clsx(styles.statValue, styles.statValueBlue)}>{stats.total}</p>
              </div>
              <div className={clsx(styles.statIcon, styles.statIconBlue)}>
                <span>🌉</span>
              </div>
            </div>
          </div>

          <div className={clsx(styles.statCard, styles.statCardGreen)}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>안전</p>
                <p className={clsx(styles.statValue, styles.statValueGreen)}>{stats.safe}</p>
              </div>
              <div className={clsx(styles.statIcon, styles.statIconGreen)}>
                <span>✓</span>
              </div>
            </div>
          </div>

          <div className={clsx(styles.statCard, styles.statCardYellow)}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>주의</p>
                <p className={clsx(styles.statValue, styles.statValueYellow)}>{stats.warning}</p>
              </div>
              <div className={clsx(styles.statIcon, styles.statIconYellow)}>
                <span>⚠</span>
              </div>
            </div>
          </div>

          <div className={clsx(styles.statCard, styles.statCardRed)}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>위험</p>
                <p className={clsx(styles.statValue, styles.statValueRed)}>{stats.danger}</p>
              </div>
              <div className={clsx(styles.statIcon, styles.statIconRed)}>
                <span>!</span>
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 구분선 */}
        <hr className={styles.sectionDivider} />

        {/* 교량 목록 */}
        <div className={styles.bridgeListCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>교량 목록</h2>
              <p className={styles.sectionSubtitle}>최근 등록된 교량</p>
            </div>
            <Link to="/bridges" className={styles.sectionLink}>
              전체 보기
              <span>→</span>
            </Link>
          </div>
          <div className={styles.sectionContent}>
            {bridges.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🌉</div>
                <p className={styles.emptyStateTitle}>등록된 교량이 없습니다.</p>
                <p className={styles.emptyStateSubtitle}>새로운 교량을 등록해보세요.</p>
              </div>
            ) : (
              <div className={styles.bridgeGrid}>
                {bridges.slice(0, 6).map((bridge: Bridge) => (
                  <Link
                    key={bridge.id}
                    to={`/bridges/${bridge.id}`}
                    className={styles.bridgeCardLink}
                  >
                    <BridgeCard bridge={bridge} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 섹션 구분선 */}
        <hr className={styles.sectionDivider} />

        {/* 빠른 액션 */}
        <div className={styles.actionCard}>
          <h2 className={styles.actionTitle}>빠른 액션</h2>
          <div className={styles.actionButtons}>
            <Link
              to="/bridges"
              className={clsx(styles.actionButton, styles.actionButtonPrimary)}
            >
              📋 교량 목록 보기
            </Link>
            {bridges.length > 0 && (
              <Link
                to={`/bridges/${bridges[0].id}`}
                className={clsx(styles.actionButton, styles.actionButtonSuccess)}
              >
                🎯 BIM 뷰어 열기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

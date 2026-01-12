import { useBIMModel } from '../hooks'
import type { BIMComponent } from '@bridge-bim-platform/shared'
import { ThreeViewer } from './three-viewer'
import styles from '@/shared/styles/bim-viewer.module.css'
import { clsx } from 'clsx'

interface BIMViewerProps {
  bridgeId: string
  selectedComponent?: BIMComponent | null
  onComponentSelect?: (component: BIMComponent) => void
}

export function BIMViewer({
  bridgeId,
  selectedComponent,
  onComponentSelect,
}: BIMViewerProps) {
  const { model, loading, error } = useBIMModel(bridgeId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">BIM 모델을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-center p-6">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-red-700 font-medium">오류가 발생했습니다</p>
          <p className="text-red-600 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-6">
          <span className="text-4xl mb-4 block">📦</span>
          <p className="text-gray-700 font-medium">BIM 모델이 없습니다</p>
          <p className="text-gray-500 text-sm mt-2">이 교량에 대한 BIM 모델이 등록되지 않았습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.viewer}>
      <div className={styles.header}>
        <h2 className={styles.title}>{model.metadata.name}</h2>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>📦</span>
            버전 {model.metadata.version}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>🔧</span>
            부재 {model.metadata.componentCount}개
          </span>
        </div>
      </div>

      {/* 3D 뷰어 영역 */}
      <div className={styles.viewport}>
        <ThreeViewer />
      </div>

      {/* 부재 목록 */}
      <div className={styles.componentList}>
        <h3 className={styles.componentListTitle}>
          <span className={styles.componentListIcon}>📋</span>
          부재 목록
        </h3>
        <div>
          {model.components.map((component) => {
            const isSelected = selectedComponent?.id === component.id
            const statusClass =
              component.status === 'SAFE'
                ? styles.componentStatusSafe
                : component.status === 'WARNING'
                  ? styles.componentStatusWarning
                  : styles.componentStatusDanger

            return (
              <button
                key={component.id}
                onClick={() => onComponentSelect?.(component)}
                className={clsx(
                  styles.componentItem,
                  isSelected ? styles.componentItemSelected : styles.componentItemDefault,
                )}
              >
                <div className={styles.componentItemContent}>
                  <span className={styles.componentName}>{component.name}</span>
                  <span className={clsx(styles.componentStatus, statusClass)}>
                    {component.status || 'UNKNOWN'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

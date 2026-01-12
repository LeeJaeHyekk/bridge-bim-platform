import type { BIMComponent } from '@bridge-bim-platform/shared'
import styles from '@/shared/styles/bim-properties.module.css'
import { clsx } from 'clsx'

interface BIMPropertiesProps {
  component: BIMComponent | null
}

export function BIMProperties({ component }: BIMPropertiesProps) {
  if (!component) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <div className={styles.emptyStateIcon}>👆</div>
          <p className={styles.emptyStateTitle}>부재를 선택하세요</p>
          <p className={styles.emptyStateSubtitle}>좌측 목록에서 부재를 클릭하면</p>
          <p className={styles.emptyStateSubtitle}>상세 정보가 표시됩니다</p>
        </div>
      </div>
    )
  }

  const statusBadgeClass =
    component.status === 'SAFE'
      ? styles.badgeSafe
      : component.status === 'WARNING'
        ? styles.badgeWarning
        : styles.badgeDanger

  return (
    <div className={styles.properties}>
      <div className={styles.content}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h3 className={styles.componentName}>{component.name}</h3>
          <div className={styles.badges}>
            <span className={clsx(styles.badge, styles.badgeType)}>{component.type}</span>
            {component.status && (
              <span className={clsx(styles.badge, statusBadgeClass)}>
                {component.status === 'SAFE'
                  ? '안전'
                  : component.status === 'WARNING'
                    ? '주의'
                    : '위험'}
              </span>
            )}
          </div>
        </div>

        {/* 속성 정보 */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📊</span>
            속성 정보
          </h4>
          <div className={styles.propertyList}>
            {component.properties.length === 0 ? (
              <p className={styles.emptyStateSubtitle}>속성 정보가 없습니다.</p>
            ) : (
              component.properties.map((prop, index) => (
                <div key={index} className={styles.propertyItem}>
                  <span className={styles.propertyKey}>{prop.key}</span>
                  <span className={styles.propertyValue}>
                    {prop.value}
                    {prop.unit && (
                      <span className={styles.propertyUnit}>{prop.unit}</span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 관계 정보 */}
        {(component.parentId || (component.childrenIds && component.childrenIds.length > 0)) && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🔗</span>
              관계 정보
            </h4>
            <div>
              {component.parentId && (
                <div className={clsx(styles.relationshipCard, styles.relationshipCardParent)}>
                  <p className={clsx(styles.relationshipLabel, styles.relationshipLabelParent)}>
                    상위 부재
                  </p>
                  <p className={styles.relationshipId}>{component.parentId}</p>
                </div>
              )}
              {component.childrenIds && component.childrenIds.length > 0 && (
                <div className={clsx(styles.relationshipCard, styles.relationshipCardChildren)}>
                  <p className={clsx(styles.relationshipLabel, styles.relationshipLabelChildren)}>
                    하위 부재 ({component.childrenIds.length}개)
                  </p>
                  <div className={styles.relationshipList}>
                    {component.childrenIds.map((childId) => (
                      <p key={childId} className={styles.relationshipId}>
                        {childId}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

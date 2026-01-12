import { useParams, Link } from 'react-router-dom'
import { useBridge } from '@/features/bridge/hooks'
import { BIMViewer, BIMProperties } from '@/features/bim-viewer'
import { useState, useMemo } from 'react'
import { useBIMModel } from '@/features/bim-viewer/hooks'
import type { BridgeStatus } from '@bridge-bim-platform/shared'
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'
import styles from './bridge-detail.module.css'
import { clsx } from 'clsx'

export function BridgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { bridge, loading, error } = useBridge(id || '')
  
  // selectionState: 선택 상태는 string | null만 사용 (객체 금지)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  
  // dataState: BIM 모델 데이터 (불변)
  const { model } = useBIMModel(id || '')
  
  // 선택된 부재 객체는 computed (dataState + selectionState 결합)
  const selectedComponent = useMemo(() => {
    if (!model || !selectedComponentId) return null
    return model.components.find(c => c.id === selectedComponentId) ?? null
  }, [model, selectedComponentId])

  // 부재 선택 핸들러: componentId (string)만 받음
  const handleComponentSelect = (componentId: string) => {
    // 엄격한 검증: componentId가 유효한 string인지 확인
    if (typeof componentId !== 'string' || componentId.length === 0) {
      console.warn('[BridgeDetailPage] ⚠️ 잘못된 componentId가 전달되었습니다:', {
        componentId,
        componentIdType: typeof componentId,
      })
      return
    }
    
    const prevId = selectedComponentId
    console.log('[BridgeDetailPage] ✅ 부재 선택 핸들러 호출:', {
      componentId,
      prevId,
      componentName: selectedComponent?.name,
    })
    
    try {
      setSelectedComponentId(componentId)
      console.log('[BridgeDetailPage] ✅ selectionState 업데이트 완료:', componentId)
    } catch (error) {
      console.error('[BridgeDetailPage] ❌ 상태 업데이트 중 오류:', error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingText}>
              <LoadingSpinner size="lg" />
              <p className={styles.loadingMessage}>교량 정보를 불러오는 중...</p>
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
          <ErrorMessage message={`교량 정보를 불러올 수 없습니다: ${error.message}`} />
        </div>
      </div>
    )
  }

  if (!bridge) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.notFoundAlert}>
            <p className={styles.notFoundMessage}>교량을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig: Record<BridgeStatus, { className: string; label: string }> = {
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

  const config = statusConfig[bridge.status as BridgeStatus]

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            to="/bridges"
            className={styles.backLink}
          >
            <span className={styles.backIcon}>←</span>
            교량 목록으로 돌아가기
          </Link>
          <div className={styles.headerMain}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>{bridge.name}</h1>
              <p className={styles.location}>
                <span className={styles.locationIcon}>📍</span>
                {bridge.location}
              </p>
            </div>
            <span className={clsx(styles.statusBadge, config.className)}>
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* BIM Viewer */}
          <div>
            <div className={styles.viewerContainer}>
              {id && (
                <BIMViewer
                  bridgeId={id}
                  selectedComponentId={selectedComponentId}
                  onComponentSelect={handleComponentSelect}
                />
              )}
            </div>
          </div>

          {/* 속성 패널 */}
          <div>
            <div className={styles.propertiesContainer}>
              <BIMProperties component={selectedComponent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

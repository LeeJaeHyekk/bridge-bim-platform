import { useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { useBIMModel } from '../hooks'
import type { BIMComponent } from '@bridge-bim-platform/shared'
import { ThreeViewer } from './three-viewer/index'
import styles from '@/shared/styles/bim-viewer.module.css'
import loadingStyles from './bim-viewer-loading.module.css'
import { clsx } from 'clsx'

// 개발 환경에서만 로그 출력
const isDev = import.meta.env.DEV
const debugLog = (...args: unknown[]) => {
  if (isDev) console.log(...args)
}

// selectionState: 선택 상태 (null | string만 사용, 객체 금지)
export type SelectionState = {
  selectedComponentId: string | null // null = 전체 보기, string = 특정 부재 선택
}

export interface BIMViewerProps {
  bridgeId: string
  // selectionState: 선택 상태는 string | null만 사용 (객체 금지)
  selectedComponentId?: string | null
  // onComponentSelect: componentId (string)만 전달
  onComponentSelect?: (componentId: string) => void
}

export const BIMViewer = memo(function BIMViewer({
  bridgeId,
  selectedComponentId: propSelectedComponentId,
  onComponentSelect,
}: BIMViewerProps) {
  // dataState: BIM 모델 데이터 (불변)
  const { model, loading, error } = useBIMModel(bridgeId)

  // selectionState: null | string로 명확히 처리 (undefined 제거)
  const selectedComponentId = propSelectedComponentId ?? null

  // 선택된 부재 객체는 computed (dataState + selectionState 결합)
  const selectedComponent = useMemo(() => {
    if (!model || !selectedComponentId) return null
    return model.components.find(c => c.id === selectedComponentId) ?? null
  }, [model, selectedComponentId])

  // useEffect로 selectionState 변경 추적 (개발 환경에서만)
  // 실제로 값이 변경되었을 때만 로그 출력 (초기 렌더링 제외)
  const prevSelectedComponentIdRef = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    const prevId = prevSelectedComponentIdRef.current ?? null
    const currentId = selectedComponentId ?? null
    
    // 실제로 ID가 변경되었을 때만 로그 출력
    if (prevId !== currentId) {
      debugLog('[BIMViewer] ✅ selectionState 변경됨:', {
        prevId,
        currentId,
        selectedComponentId,
        selectedComponentName: selectedComponent?.name,
        mode: currentId === null ? 'ALL (전체 보기)' : `COMPONENT (${currentId})`,
      })
    }
    
    // 이전 값 업데이트
    prevSelectedComponentIdRef.current = selectedComponentId
  }, [selectedComponentId, selectedComponent?.name])

  // 3D 뷰어 클릭 핸들러: componentId (string)를 그대로 전달
  // ThreeViewer는 상태를 "해석"만 하고, 상태 "결정"은 상위 컴포넌트에서 수행
  const handleComponentClick = useCallback((componentId: string) => {
    // 엄격한 타입 검증
    if (typeof componentId !== 'string' || componentId.length === 0) {
      console.warn('[BIMViewer] ⚠️ 잘못된 componentId가 전달되었습니다:', {
        componentId,
        componentIdType: typeof componentId,
        isEmpty: componentId === '',
      })
      return
    }
    
    debugLog('[BIMViewer] ✅ 3D 뷰어에서 부재 클릭:', {
      componentId,
      componentIdType: typeof componentId,
      modelId: model?.metadata.id,
      componentCount: model?.components.length,
    })
    
    // selectionState 업데이트: componentId (string)만 전달
    if (onComponentSelect) {
      debugLog('[BIMViewer] ✅ selectionState 업데이트 콜백 호출:', componentId)
      try {
        onComponentSelect(componentId)
        debugLog('[BIMViewer] ✅ selectionState 업데이트 완료:', componentId)
      } catch (error) {
        console.error('[BIMViewer] ❌ selectionState 업데이트 중 오류:', error)
      }
    } else {
      console.warn('[BIMViewer] ⚠️ onComponentSelect 콜백이 없습니다')
    }
  }, [model, onComponentSelect])

  // 부재 목록 메모이제이션 (조건부 return 이전에 Hook 호출)
  const componentListItems = useMemo(() => {
    if (!model) return []
    debugLog('[BIMViewer] 부재 목록 렌더링 시작:', {
      componentCount: model.components.length,
    })
    return model.components.map((component: BIMComponent) => {
      const isSelected = selectedComponentId === component.id
      const statusClass =
        component.status === 'SAFE'
          ? styles.componentStatusSafe
          : component.status === 'WARNING'
            ? styles.componentStatusWarning
            : styles.componentStatusDanger

      return (
        <ComponentListItem
          key={component.id}
          component={component}
          isSelected={isSelected}
          statusClass={statusClass}
          onSelect={(c: BIMComponent) => {
            // 부재 목록 클릭 시에도 componentId (string)만 전달
            if (onComponentSelect && c.id) {
              onComponentSelect(c.id)
            }
          }}
        />
      )
    })
  }, [model, selectedComponentId, onComponentSelect])

  // 디버깅: props 변경 추적 (개발 환경에서만)
  // 🔥 수정: model이 있을 때만 상세 로그 출력, 없으면 간단한 로그만
  if (model) {
    debugLog('[BIMViewer] 렌더링:', {
      bridgeId,
      selectionState: { selectedComponentId },
      selectedComponentName: selectedComponent?.name,
      dataState: {
        modelId: model.metadata.id,
        componentCount: model.components.length,
      },
      hasOnComponentSelect: !!onComponentSelect,
    })
  } else if (loading) {
    debugLog('[BIMViewer] 렌더링 (로딩 중):', {
      bridgeId,
      loading: true,
      hasModel: false,
    })
  } else {
    debugLog('[BIMViewer] 렌더링 (모델 없음):', {
      bridgeId,
      loading: false,
      hasModel: false,
      error: error?.message,
    })
  }

  if (loading) {
    return (
      <div className={loadingStyles.loadingContainer}>
        <div className={loadingStyles.loadingContent}>
          <div className={loadingStyles.loadingSpinner} />
          <p className={loadingStyles.loadingMessage}>BIM 모델을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={loadingStyles.errorContainer}>
        <div className={loadingStyles.errorContent}>
          <span className={loadingStyles.errorIcon}>⚠️</span>
          <p className={loadingStyles.errorTitle}>오류가 발생했습니다</p>
          <p className={loadingStyles.errorMessage}>{error.message}</p>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className={loadingStyles.emptyContainer}>
        <div className={loadingStyles.emptyContent}>
          <span className={loadingStyles.emptyIcon}>📦</span>
          <p className={loadingStyles.emptyTitle}>BIM 모델이 없습니다</p>
          <p className={loadingStyles.emptySubtitle}>이 교량에 대한 BIM 모델이 등록되지 않았습니다.</p>
        </div>
      </div>
    )
  }

  // dataState 검증: modelId가 있을 때만 ThreeViewer 렌더링
  // 이렇게 하면 초기 렌더링 시 빈 상태로 초기화되는 것을 방지
  const modelId = model?.metadata.id

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
      {/* 핵심: modelId가 있을 때만 ThreeViewer 렌더링 (초기 빈 상태 초기화 방지) */}
      <div className={styles.viewport}>
        {modelId ? (
          <ThreeViewer
            model={model}
            selectedComponentId={selectedComponentId}
            onComponentClick={handleComponentClick}
          />
        ) : (
          <div className={loadingStyles.loadingContainer}>
            <div className={loadingStyles.loadingContent}>
              <div className={loadingStyles.loadingSpinner} />
              <p className={loadingStyles.loadingMessage}>BIM 모델을 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 부재 목록 */}
      <div className={styles.componentList}>
        <h3 className={styles.componentListTitle}>
          <span className={styles.componentListIcon}>📋</span>
          부재 목록
        </h3>
        <div>
          {componentListItems}
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수: bridgeId와 selectedComponentId만 비교
  // selectionState는 string | null만 사용하므로 단순 비교 가능
  const prevId = prevProps.selectedComponentId ?? null
  const nextId = nextProps.selectedComponentId ?? null
  const isEqual = (
    prevProps.bridgeId === nextProps.bridgeId &&
    prevId === nextId
  )
  
  if (!isEqual) {
    debugLog('[BIMViewer] Props 변경 감지:', {
      bridgeId: { prev: prevProps.bridgeId, next: nextProps.bridgeId },
      selectionState: {
        prev: prevId,
        next: nextId,
      },
    })
  }
  
  return isEqual
})

// 부재 목록 아이템 컴포넌트 (메모이제이션)
const ComponentListItem = memo(function ComponentListItem({
  component,
  isSelected,
  statusClass,
  onSelect,
}: {
  component: BIMComponent
  isSelected: boolean
  statusClass: string
  onSelect?: (component: BIMComponent) => void
}) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    debugLog('[BIMViewer] 부재 목록에서 부재 클릭:', {
      id: component.id,
      name: component.name,
      type: component.type,
      status: component.status,
      isSelected,
      hasCallback: !!onSelect,
    })
    if (onSelect) {
      debugLog('[BIMViewer] onComponentSelect 콜백 호출 시작')
      try {
        onSelect(component)
        debugLog('[BIMViewer] onComponentSelect 콜백 호출 완료')
      } catch (error) {
        console.error('[BIMViewer] onComponentSelect 콜백 호출 중 오류:', error)
      }
    } else {
      console.warn('[BIMViewer] onComponentSelect 콜백이 없습니다!')
    }
  }, [component, isSelected, onSelect])

  return (
    <button
      type="button"
      onClick={handleClick}
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
}, (prevProps, nextProps) => {
  return (
    prevProps.component.id === nextProps.component.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.statusClass === nextProps.statusClass &&
    prevProps.onSelect === nextProps.onSelect
  )
})

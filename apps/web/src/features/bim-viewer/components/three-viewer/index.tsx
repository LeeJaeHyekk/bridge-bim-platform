import { useRef, memo, useMemo, useEffect, useLayoutEffect, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { ThreeViewerProps } from './types'
import { debugLog } from './utils'
import { useThreeEngine } from './hooks/use-three-engine'
import styles from './three-viewer.module.css'
// TODO: 점진적으로 제거 예정 - ModelManager, InteractionManager로 이동
import { useModelLoader, useHighlight, useCameraFocus } from './hooks'

export const ThreeViewer = memo(function ThreeViewer({
  model,
  selectedComponentId,
  onComponentClick,
}: ThreeViewerProps) {
  // 🔥 핵심 수정: props의 width/height 완전히 제거, containerSize만 사용
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 🔥 containerSize를 먼저 계산 (렌더 기준 통일)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  
  useLayoutEffect(() => {
    if (!containerRef.current) return
    
    const updateSize = () => {
      const rect = containerRef.current!.getBoundingClientRect()
      // 🔥 props 참조 완전히 제거, containerRef에서만 가져오기
      const newWidth = rect.width || containerRef.current!.clientWidth || 800
      const newHeight = rect.height || containerRef.current!.clientHeight || 600
      
      setContainerSize({ width: newWidth, height: newHeight })
      
      debugLog('[ThreeViewer:Progress] 📐 컨테이너 사이즈 업데이트', {
        width: newWidth,
        height: newHeight,
        rectWidth: rect.width,
        rectHeight: rect.height,
        clientWidth: containerRef.current!.clientWidth,
        clientHeight: containerRef.current!.clientHeight,
      })
    }
    
    updateSize()
    
    // ResizeObserver로 크기 변경 감지
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.current)
    
    return () => {
      resizeObserver.disconnect()
    }
  }, []) // 🔥 props 의존성 제거
  
  // 🔥 렌더 기준 통일: containerSize만 사용
  const { width, height } = containerSize
  
  // 🔥 React Hooks 규칙: 모든 hooks를 early return 전에 호출해야 함
  // 디버깅: props 수신 확인 (실제로 변경되었을 때만 로그 출력)
  const prevSelectedComponentIdRef = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    const prevId = prevSelectedComponentIdRef.current
    const currentId = selectedComponentId ?? null
    
    // 실제로 값이 변경되었을 때만 로그 출력
    if (prevId !== currentId) {
      debugLog('[ThreeViewer:Progress] 🔄 selectedComponentId prop 변경:', {
        prevId,
        currentId,
        selectedComponentId,
        type: typeof selectedComponentId,
        isNull: selectedComponentId === null,
        isString: typeof selectedComponentId === 'string',
        hasValue: selectedComponentId !== null && selectedComponentId !== undefined,
      })
    }
    
    // 이전 값 업데이트
    prevSelectedComponentIdRef.current = selectedComponentId
  }, [selectedComponentId])
  
  // 🔥 ThreeEngine 사용 (새로운 구조)
  const { engine, isInitialized: engineInitialized } = useThreeEngine(containerRef, containerSize)

  // TODO: 점진적으로 제거 예정 - ModelManager로 이동
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const modelLoadingRef = useRef<string | null>(null)
  const loadingAbortRef = useRef<boolean>(false)
  const meshesReadyRef = useRef<boolean>(false)
  
  // Engine에서 가져온 refs (임시 - 향후 Manager로 완전 분리)
  // 초기값은 null이고, useEffect에서 업데이트됨
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  // 모델 ID 메모이제이션
  const modelId = useMemo(() => {
    const id = model?.metadata.id ?? null
    debugLog('[ThreeViewer:Progress] 📝 modelId 메모이제이션', { modelId: id, hasModel: !!model })
    return id
  }, [model?.metadata.id])
  
  // onComponentClick 참조 업데이트 (Scene 재생성 방지)
  const onComponentClickRef = useRef(onComponentClick)
  
  // 🔥 문제 ④ 해결: selectedComponentId 정규화 - null/undefined 명확히 분리
  // string = 특정 부재 선택, null/undefined = 전체 보기
  const normalizedSelectedComponentId = useMemo((): string | null => {
    // 타입이 string인 경우만 선택된 것으로 간주
    if (typeof selectedComponentId === 'string' && selectedComponentId.length > 0) {
      debugLog('[ThreeViewer:Progress] 🔄 normalizedSelectedComponentId 계산 (부재 선택)', {
        original: selectedComponentId,
        normalized: selectedComponentId,
        type: typeof selectedComponentId,
      })
      return selectedComponentId
    }
    
    // null, undefined, 빈 문자열 모두 전체 보기로 처리
    debugLog('[ThreeViewer:Progress] 🔄 normalizedSelectedComponentId 계산 (전체 보기)', {
      original: selectedComponentId,
      normalized: null,
      type: typeof selectedComponentId,
      isNull: selectedComponentId === null,
      isUndefined: selectedComponentId === undefined,
    })
    return null
  }, [selectedComponentId])
  
  // 🔥 React Hooks 규칙: 모든 hooks를 early return 전에 호출해야 함
  // ref 상태 추적 effect (Engine 기반으로 업데이트)
  useEffect(() => {
    debugLog('[ThreeViewer:Progress] 📊 Ref 상태 체크', {
      hasContainer: !!containerRef.current,
      hasScene: !!sceneRef.current,
      hasCamera: !!cameraRef.current,
      hasControls: !!controlsRef.current,
      hasEngine: !!engine,
      engineInitialized: engine?.isInitialized() ?? false,
      engineInitializedState: engineInitialized,
      meshCount: meshesRef.current.size,
      modelLoading: modelLoadingRef.current,
      loadingAbort: loadingAbortRef.current,
      meshesReady: meshesReadyRef.current,
    })
  })

  // onComponentClick 참조 업데이트 effect
  useEffect(() => {
    debugLog('[ThreeViewer:Progress] 🔄 onComponentClick 참조 업데이트', {
      hasCallback: typeof onComponentClick === 'function',
    })
    onComponentClickRef.current = onComponentClick
  }, [onComponentClick])

  // 디버깅: normalizedSelectedComponentId 변경 추적 (실제로 변경되었을 때만 로그 출력)
  const prevNormalizedIdRef = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    const prevId = prevNormalizedIdRef.current
    const currentId = normalizedSelectedComponentId
    
    // 실제로 값이 변경되었을 때만 로그 출력
    if (prevId !== currentId) {
      debugLog('[ThreeViewer:Progress] 🔄 normalizedSelectedComponentId 변경됨:', {
        prevId,
        currentId,
        selectedComponentId,
        normalizedSelectedComponentId,
        type: typeof normalizedSelectedComponentId,
        isNull: normalizedSelectedComponentId === null,
        isString: typeof normalizedSelectedComponentId === 'string',
      })
    }
    
    // 이전 값 업데이트
    prevNormalizedIdRef.current = normalizedSelectedComponentId
  }, [selectedComponentId, normalizedSelectedComponentId])

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    debugLog('[ThreeViewer:Progress] ✅ 컴포넌트 마운트 완료', {
      modelId,
      selectedComponentId: normalizedSelectedComponentId,
      containerSize: { width, height },
    })

    return () => {
      debugLog('[ThreeViewer:Progress] 🛑 컴포넌트 언마운트 시작', {
        modelId,
        meshCount: meshesRef.current.size,
        meshesReady: meshesReadyRef.current,
        engineInitialized: engine?.isInitialized() ?? false,
      })
    }
  }, [])

  // 진행 상황 요약 로그 (주기적으로 상태 체크)
  useEffect(() => {
    const summary = {
      modelId,
      selectedComponentId: normalizedSelectedComponentId,
      meshCount: meshesRef.current.size,
      meshesReady: meshesReadyRef.current,
      modelLoading: modelLoadingRef.current,
      loadingAbort: loadingAbortRef.current,
      hasEngine: !!engine,
      engineInitialized: engine?.isInitialized() ?? false,
      engineInitializedState: engineInitialized,
      hasScene: !!sceneRef.current,
      hasCamera: !!cameraRef.current,
      hasControls: !!controlsRef.current,
      cameraPosition: cameraRef.current?.position
        ? {
            x: cameraRef.current.position.x.toFixed(2),
            y: cameraRef.current.position.y.toFixed(2),
            z: cameraRef.current.position.z.toFixed(2),
          }
        : null,
      controlsTarget: controlsRef.current?.target
        ? {
            x: controlsRef.current.target.x.toFixed(2),
            y: controlsRef.current.target.y.toFixed(2),
            z: controlsRef.current.target.z.toFixed(2),
          }
        : null,
    }

    debugLog('[ThreeViewer:Progress] 📊 진행 상황 요약', summary)
  })

  // 🔥 ThreeEngine은 useThreeEngine Hook 내부에서 자동 초기화됨
  // React는 "언제"만 결정하고, Engine이 "어떻게"를 수행
  // Engine의 refs를 React refs에 동기화 (기존 hooks 호환성 유지)
  // 🔥 핵심 수정: engineInitialized 상태 변화에 즉시 반응하여 ref 동기화
  // ref 동기화 완료를 추적하는 state 추가 (useModelLoader가 감지할 수 있도록)
  const [refsReady, setRefsReady] = useState(false)
  
  useEffect(() => {
    if (engine && engine.isInitialized() && engineInitialized) {
      sceneRef.current = engine.getScene()
      cameraRef.current = engine.getCamera()
      controlsRef.current = engine.getControls()
      
      // ref 동기화 완료 플래그 설정 (useModelLoader가 감지할 수 있도록)
      setRefsReady(true)
      
      debugLog('[ThreeViewer:Progress] ✅ ThreeEngine 준비 완료', {
        hasEngine: !!engine,
        hasScene: !!sceneRef.current,
        hasCamera: !!cameraRef.current,
        hasControls: !!controlsRef.current,
        initialized: engine.isInitialized(),
        engineInitialized,
        refsReady: true,
      })
    } else {
      setRefsReady(false)
    }
  }, [engine, engineInitialized])

  // BIM 모델 로딩 및 렌더링 (Scene 초기화 후 실행)
  debugLog('[ThreeViewer:Progress] 🎬 useModelLoader 호출 시작', {
    modelId,
    hasModel: !!model,
    modelLoading: modelLoadingRef.current,
    meshesReady: meshesReadyRef.current,
    meshCount: meshesRef.current.size,
    selectedComponentId: normalizedSelectedComponentId,
  })
  useModelLoader({
    model: model ?? null,
    sceneRef,
    cameraRef,
    controlsRef,
    meshesRef,
    modelLoadingRef,
    loadingAbortRef,
    meshesReadyRef,
    selectedComponentId: normalizedSelectedComponentId,
    refsReady, // 🔥 추가: refs 동기화 완료 상태 전달
  })
  debugLog('[ThreeViewer:Progress] ✅ useModelLoader 호출 완료', {
    modelId,
    modelLoading: modelLoadingRef.current,
    meshesReady: meshesReadyRef.current,
    meshCount: meshesRef.current.size,
  })

  // 선택된 컴포넌트 하이라이트 (모델 로딩 후 실행)
  debugLog('[ThreeViewer:Progress] 🎬 useHighlight 호출 시작', {
    selectedComponentId: normalizedSelectedComponentId,
    meshCount: meshesRef.current.size,
    meshesReady: meshesReadyRef.current,
    hasScene: !!sceneRef.current,
  })
  useHighlight({
    selectedComponentId: normalizedSelectedComponentId,
    meshesRef,
    sceneRef,
    meshesReadyRef,
  })
  debugLog('[ThreeViewer:Progress] ✅ useHighlight 호출 완료', {
    selectedComponentId: normalizedSelectedComponentId,
    meshCount: meshesRef.current.size,
  })

  // 카메라 포커스 관리 (초기 전체 포커스 + 부재 선택 포커스)
  debugLog('[ThreeViewer:Progress] 🎬 useCameraFocus 호출 시작', {
    modelId,
    selectedComponentId: normalizedSelectedComponentId,
    meshCount: meshesRef.current.size,
    expectedComponentCount: model?.components.length ?? 0,
    hasCamera: !!cameraRef.current,
    hasControls: !!controlsRef.current,
  })
  useCameraFocus({
    model: model ?? null,
    meshesRef,
    selectedComponentId: normalizedSelectedComponentId,
    cameraRef,
    controlsRef,
  })
  debugLog('[ThreeViewer:Progress] ✅ useCameraFocus 호출 완료', {
    modelId,
    selectedComponentId: normalizedSelectedComponentId,
  })
  
  // 🔥 렌더 가드: containerSize 기준으로 통일 (모든 hooks 호출 후)
  debugLog('[ThreeViewer:Progress] 🚀 컴포넌트 렌더링 시작', {
    width,
    height,
    containerSize,
    modelId: model?.metadata.id ?? null,
    selectedComponentId,
    hasModel: !!model,
  })
  
  // 🔥 렌더 가드: containerSize 기준으로 통일 (모든 hooks 호출 후)
  if (!width || !height) {
    debugLog('[ThreeViewer:Progress] ⏸️ 컨테이너 사이즈 준비 안됨 - 초기 렌더만', {
      width,
      height,
    })
    return (
      <div 
        ref={containerRef} 
        className={styles.container}
      />
    )
  }

  // 디버깅: props 변경 추적 (개발 환경에서만) - 마지막에 실행
  debugLog('[ThreeViewer:Progress] 🎨 렌더링 완료', {
    modelId,
    selectedComponentId,
    normalizedSelectedComponentId,
    meshCount: meshesRef.current.size,
    meshesReady: meshesReadyRef.current,
    hasScene: !!sceneRef.current,
    hasCamera: !!cameraRef.current,
    hasControls: !!controlsRef.current,
    hasEngine: !!engine,
    engineInitialized: engine?.isInitialized() ?? false,
    modelLoading: modelLoadingRef.current,
    loadingAbort: loadingAbortRef.current,
  })

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
    />
  )
}, (prevProps, nextProps) => {
  // 🔥 커스텀 비교 함수: width/height props 제거, modelId와 selectedComponentId만 비교
  // onComponentClick은 ref로 관리되므로 비교에서 제외
  // width/height는 containerSize로 관리되므로 props 비교에서 제외
  const isEqual = (
    prevProps.model?.metadata.id === nextProps.model?.metadata.id &&
    prevProps.selectedComponentId === nextProps.selectedComponentId
  )
  
  if (!isEqual) {
    debugLog('[ThreeViewer:Progress] 🔄 Props 변경 감지 (리렌더링 필요)', {
      modelId: { 
        prev: prevProps.model?.metadata.id, 
        next: nextProps.model?.metadata.id,
        changed: prevProps.model?.metadata.id !== nextProps.model?.metadata.id,
      },
      selectedComponentId: { 
        prev: prevProps.selectedComponentId, 
        next: nextProps.selectedComponentId,
        changed: prevProps.selectedComponentId !== nextProps.selectedComponentId,
      },
    })
  } else {
    debugLog('[ThreeViewer:Progress] ⏭️ Props 변경 없음 (리렌더링 스킵)', {
      modelId: prevProps.model?.metadata.id,
      selectedComponentId: prevProps.selectedComponentId,
    })
  }
  
  return isEqual
})

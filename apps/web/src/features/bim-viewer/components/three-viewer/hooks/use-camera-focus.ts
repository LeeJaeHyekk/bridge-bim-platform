import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { BIMModel } from '@bridge-bim-platform/shared'
import { debugLog } from '../utils/debug'
import { focusCameraToScene } from '../utils/camera-focus'

interface UseCameraFocusOptions {
  // dataState
  model: BIMModel | null
  meshesRef: React.MutableRefObject<Map<string, THREE.Mesh>>
  
  // selectionState
  selectedComponentId: string | null
  
  // Three.js refs
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
  controlsRef: React.RefObject<OrbitControls | null>
}

/**
 * 카메라 포커스 관리 Hook
 * 
 * 🔥 구조 정리: Polling 제거, meshesReady를 파생 상태로 계산
 * 
 * 1. 초기 모델 로딩 후 전체 포커스 (meshesReady 기반)
 * 2. 부재 선택 시 개별 포커스 (selectedComponentId 기반)
 */
export function useCameraFocus(options: UseCameraFocusOptions) {
  const {
    model,
    meshesRef,
    selectedComponentId,
    cameraRef,
    controlsRef,
  } = options

  // 초기 전체 포커스 실행 여부 추적 (modelId별로 관리)
  const initialFocusDoneRef = useRef<string | null>(null)
  // 이전 선택된 부재 ID 추적 (중복 포커스 방지)
  const prevSelectedComponentIdRef = useRef<string | null | undefined>(undefined)

  // modelId 추출
  const modelId = model?.metadata.id ?? null

  // 🔥 문제 ② 해결: meshesReady를 파생 상태로 계산
  // meshesReady = meshesRef.current.size === expectedComponentCount
  const expectedComponentCount = model?.components.length ?? 0
  
  // ref 변경을 추적하기 위해 state 사용 (하지만 계산 로직은 파생 상태 원칙)
  const [meshCountState, setMeshCountState] = useState(0)
  
  // meshCount 변경 추적 (ref는 리렌더를 트리거하지 않으므로 state로 추적)
  useEffect(() => {
    if (!model || !modelId) {
      setMeshCountState(0)
      return
    }
    
    // 즉시 체크
    const currentCount = meshesRef.current.size
    setMeshCountState(currentCount)
    
    // 메시가 아직 준비되지 않았으면 짧은 간격으로 체크 (메시 로딩 중)
    if (currentCount < expectedComponentCount && expectedComponentCount > 0) {
      const interval = setInterval(() => {
        const newCount = meshesRef.current.size
        setMeshCountState(newCount)
        
        // 준비 완료되면 중지
        if (newCount >= expectedComponentCount) {
          clearInterval(interval)
        }
      }, 50) // 50ms 간격
      
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId, expectedComponentCount])
  
  // 🔥 파생 상태: meshesReady = meshCount === expectedComponentCount
  const meshesReady = expectedComponentCount > 0 && meshCountState > 0 && meshCountState === expectedComponentCount
  
  debugLog('[CameraFocus:Derived] 📊 meshesReady 파생 상태', {
    modelId,
    meshCount: meshCountState,
    expectedComponentCount,
    meshesReady,
  })

  // 🔥 문제 ③ 해결: Polling 제거 - meshesReady가 true일 때만 실행
  // 1️⃣ 초기 모델 로딩 후 전체 포커스 (meshesReady 기반)
  useEffect(() => {
    const meshCount = meshesRef.current.size
    
    debugLog('[CameraFocus:Initial] 🔄 초기 포커스 effect 실행', {
      modelId,
      hasModel: !!model,
      meshesReady,
      meshCount,
      expectedComponentCount,
      initialFocusDone: initialFocusDoneRef.current,
    })

    if (!model || !modelId) {
      // 모델이 없으면 초기화 플래그 리셋
      if (!modelId) {
        debugLog('[CameraFocus:Initial] 🔄 모델 없음 - 초기화 플래그 리셋', {
          prevInitialFocusDone: initialFocusDoneRef.current,
        })
        initialFocusDoneRef.current = null
      }
      return
    }

    // 이미 이 모델에 대해 포커스를 완료했으면 스킵
    if (initialFocusDoneRef.current === modelId) {
      debugLog('[CameraFocus:Initial] ⏭️ 이미 포커스 완료 - 스킵', {
        modelId,
        initialFocusDone: initialFocusDoneRef.current,
      })
      return
    }

    // 🔥 meshesReady가 false면 스킵 (다음 렌더에서 재시도)
    if (!meshesReady || meshCount === 0) {
      debugLog('[CameraFocus:Initial] ⏸️ 메시 준비 안됨 - 스킵', {
        modelId,
        meshesReady,
        meshCount,
        expectedComponentCount,
      })
      return
    }

    if (!cameraRef.current || !controlsRef.current) {
      debugLog('[CameraFocus:Initial] ⚠️ 카메라/컨트롤 없음 - 스킵', {
        hasCamera: !!cameraRef.current,
        hasControls: !!controlsRef.current,
        modelId,
      })
      return
    }

    const prevCameraPosition = {
      x: cameraRef.current.position.x,
      y: cameraRef.current.position.y,
      z: cameraRef.current.position.z,
    }
    const prevControlsTarget = {
      x: controlsRef.current.target.x,
      y: controlsRef.current.target.y,
      z: controlsRef.current.target.z,
    }

    debugLog('[CameraFocus:Initial] 🎯 초기 전체 모델 카메라 포커스 시작', {
      modelId,
      meshCount,
      meshesReady,
      prevCameraPosition: {
        x: prevCameraPosition.x.toFixed(2),
        y: prevCameraPosition.y.toFixed(2),
        z: prevCameraPosition.z.toFixed(2),
      },
      prevControlsTarget: {
        x: prevControlsTarget.x.toFixed(2),
        y: prevControlsTarget.y.toFixed(2),
        z: prevControlsTarget.z.toFixed(2),
      },
    })
    
    focusCameraToScene(cameraRef.current, controlsRef.current, model)
    initialFocusDoneRef.current = modelId
    
    const newCameraPosition = {
      x: cameraRef.current.position.x,
      y: cameraRef.current.position.y,
      z: cameraRef.current.position.z,
    }
    const newControlsTarget = {
      x: controlsRef.current.target.x,
      y: controlsRef.current.target.y,
      z: controlsRef.current.target.z,
    }

    debugLog('[CameraFocus:Initial] ✅ 초기 전체 모델 카메라 포커스 완료', {
      modelId,
      newCameraPosition: {
        x: newCameraPosition.x.toFixed(2),
        y: newCameraPosition.y.toFixed(2),
        z: newCameraPosition.z.toFixed(2),
      },
      newControlsTarget: {
        x: newControlsTarget.x.toFixed(2),
        y: newControlsTarget.y.toFixed(2),
        z: newControlsTarget.z.toFixed(2),
      },
      cameraMoved: {
        x: Math.abs(newCameraPosition.x - prevCameraPosition.x).toFixed(2),
        y: Math.abs(newCameraPosition.y - prevCameraPosition.y).toFixed(2),
        z: Math.abs(newCameraPosition.z - prevCameraPosition.z).toFixed(2),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, modelId, meshesReady]) // cameraRef, controlsRef는 ref이므로 의존성에서 제외

  // 2️⃣ 부재 선택 시 개별 포커스 (selectedComponentId 기반)
  useEffect(() => {
    const meshCount = meshesRef.current.size
    
    debugLog('[CameraFocus:Component] 🔄 부재 포커스 effect 실행', {
      selectedComponentId,
      prevSelectedComponentId: prevSelectedComponentIdRef.current,
      meshesReady,
      meshCount,
    })

    // 전체 보기 모드면 스킵 (null 또는 undefined)
    if (!selectedComponentId) {
      debugLog('[CameraFocus:Component] 🔄 전체 보기 모드 - 이전 선택 리셋', {
        prevSelectedComponentId: prevSelectedComponentIdRef.current,
      })
      prevSelectedComponentIdRef.current = null
      return
    }

    // 메시가 준비되지 않았으면 스킵
    if (!meshesReady || meshCount === 0) {
      debugLog('[CameraFocus:Component] ⏸️ 메시 준비 안됨 - 스킵', {
        selectedComponentId,
        meshesReady,
        meshCount,
        availableMeshIds: Array.from(meshesRef.current.keys()),
      })
      return
    }

    // 중복 포커스 방지
    if (prevSelectedComponentIdRef.current === selectedComponentId) {
      debugLog('[CameraFocus:Component] ⏭️ 중복 포커스 방지 - 스킵', {
        selectedComponentId,
        prevSelectedComponentId: prevSelectedComponentIdRef.current,
      })
      return
    }

    if (!cameraRef.current || !controlsRef.current) {
      debugLog('[CameraFocus:Component] ⚠️ 카메라/컨트롤 없음 - 스킵', {
        hasCamera: !!cameraRef.current,
        hasControls: !!controlsRef.current,
        selectedComponentId,
      })
      return
    }

    // 선택된 부재의 메시 찾기
    const mesh = meshesRef.current.get(selectedComponentId)
    if (!mesh) {
      console.warn('[CameraFocus:Component] ⚠️ 선택된 부재의 메시를 찾을 수 없습니다:', {
        selectedComponentId,
        availableMeshIds: Array.from(meshesRef.current.keys()),
        meshCount,
        meshesRefSize: meshesRef.current.size,
      })
      return
    }

    const prevCameraPosition = {
      x: cameraRef.current.position.x,
      y: cameraRef.current.position.y,
      z: cameraRef.current.position.z,
    }
    const prevControlsTarget = {
      x: controlsRef.current.target.x,
      y: controlsRef.current.target.y,
      z: controlsRef.current.target.z,
    }

    debugLog('[CameraFocus:Component] 🎯 부재 카메라 포커스 시작', {
      selectedComponentId,
      componentName: mesh.userData.component?.name,
      componentType: mesh.userData.component?.type,
      meshCount,
      prevCameraPosition: {
        x: prevCameraPosition.x.toFixed(2),
        y: prevCameraPosition.y.toFixed(2),
        z: prevCameraPosition.z.toFixed(2),
      },
      prevControlsTarget: {
        x: prevControlsTarget.x.toFixed(2),
        y: prevControlsTarget.y.toFixed(2),
        z: prevControlsTarget.z.toFixed(2),
      },
    })

    // 🔥 개선: 부드러운 애니메이션을 위한 초기 위치 저장
    const startPosition = cameraRef.current.position.clone()
    const startTarget = controlsRef.current.target.clone()
    
    // 목표 위치 계산 (화면 기준 거리 계산)
    const box = new THREE.Box3().setFromObject(mesh)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = new THREE.Vector3()
    box.getSize(size)
    
    // 🔥 개선: 화면 기준 거리 계산 (FOV + 화면 비율 고려)
    // 기존 방식: 객체의 절대 크기(maxSize) 기준 → 수평으로 긴 객체에서 과도하게 멀어짐
    // 개선 방식: 현재 카메라 시야(FOV) + 화면 비율 기준으로 "화면 안에 자연스럽게 들어오는 거리" 산정
    
    const camera = cameraRef.current!
    const fov = camera.fov * (Math.PI / 180) // FOV를 라디안으로 변환 (기본값: 75도)
    const aspect = camera.aspect // 화면 비율 (width / height)
    
    // 바운딩 박스의 크기 (카메라 방향에 따른 투영 고려)
    // 카메라가 45도 각도에서 보므로, 수평/수직 크기를 모두 고려
    const horizontalSize = Math.max(size.x, size.z) // 수평면에서의 최대 크기
    const verticalSize = size.y // 수직 크기
    
    // 화면에서 보이는 범위 계산 (world units)
    // 수직 시야 높이 = 2 * distance * tan(FOV / 2)
    // 수평 시야 너비 = 수직 시야 높이 * aspect
    
    // 바운딩 박스가 화면의 80% 정도를 차지하도록 거리 계산
    // 화면 비율을 고려하여 수평/수직 중 더 큰 쪽을 기준으로 함
    const screenFillRatio = 0.8 // 화면의 80%를 차지
    
    // 수직 기준 거리 계산
    const verticalDistance = (verticalSize / 2) / (Math.tan(fov / 2) * screenFillRatio)
    
    // 수평 기준 거리 계산
    const horizontalDistance = (horizontalSize / 2) / (Math.tan(fov / 2) * aspect * screenFillRatio)
    
    // 더 큰 쪽을 기준으로 거리 결정 (모든 부분이 화면에 들어오도록)
    const baseDistance = Math.max(verticalDistance, horizontalDistance)
    
    // 최소 거리 보장 (너무 가까이 가지 않도록)
    const minDistance = Math.max(size.x, size.y, size.z) * 0.5
    const distance = Math.max(baseDistance, minDistance)
    
    // 카메라 각도 (45도 isometric view)
    const angle = Math.PI / 4
    
    // 높이 오프셋: 객체 위에서 약간 내려다보는 시점
    // 거리에 비례하여 조정 (거리가 멀수록 높이 오프셋도 증가)
    const heightOffset = distance * 0.3
    
    const endPosition = new THREE.Vector3(
      center.x + distance * Math.cos(angle),
      center.y + heightOffset,
      center.z + distance * Math.sin(angle),
    )
    
    debugLog('[CameraFocus:Component] 📐 화면 기준 거리 계산', {
      selectedComponentId,
      componentName: mesh.userData.component?.name,
      boundingBoxSize: {
        x: size.x.toFixed(2),
        y: size.y.toFixed(2),
        z: size.z.toFixed(2),
      },
      horizontalSize: horizontalSize.toFixed(2),
      verticalSize: verticalSize.toFixed(2),
      cameraFov: camera.fov,
      cameraAspect: aspect.toFixed(2),
      verticalDistance: verticalDistance.toFixed(2),
      horizontalDistance: horizontalDistance.toFixed(2),
      baseDistance: baseDistance.toFixed(2),
      finalDistance: distance.toFixed(2),
      screenFillRatio,
    })
    
    // 🔥 개선: 부드러운 애니메이션 적용 (ease-in-out)
    const duration = 1200 // 1.2초
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing 함수 (ease-in-out cubic)
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
      // 카메라 위치 보간
      cameraRef.current!.position.lerpVectors(startPosition, endPosition, ease)
      
      // 타겟 보간
      controlsRef.current!.target.lerpVectors(startTarget, center, ease)
      controlsRef.current!.update()
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // 애니메이션 완료 후 정확한 위치로 설정
        cameraRef.current!.position.copy(endPosition)
        controlsRef.current!.target.copy(center)
        controlsRef.current!.update()
        
        debugLog('[CameraFocus:Component] ✅ 애니메이션 완료', {
          selectedComponentId,
          finalPosition: {
            x: endPosition.x.toFixed(2),
            y: endPosition.y.toFixed(2),
            z: endPosition.z.toFixed(2),
          },
        })
      }
    }
    
    // 애니메이션 시작
    requestAnimationFrame(animate)

    prevSelectedComponentIdRef.current = selectedComponentId
    
    const newCameraPosition = {
      x: cameraRef.current.position.x,
      y: cameraRef.current.position.y,
      z: cameraRef.current.position.z,
    }
    const newControlsTarget = {
      x: controlsRef.current.target.x,
      y: controlsRef.current.target.y,
      z: controlsRef.current.target.z,
    }

    debugLog('[CameraFocus:Component] ✅ 부재 카메라 포커스 완료', {
      selectedComponentId,
      componentName: mesh.userData.component?.name,
      newCameraPosition: {
        x: newCameraPosition.x.toFixed(2),
        y: newCameraPosition.y.toFixed(2),
        z: newCameraPosition.z.toFixed(2),
      },
      newControlsTarget: {
        x: newControlsTarget.x.toFixed(2),
        y: newControlsTarget.y.toFixed(2),
        z: newControlsTarget.z.toFixed(2),
      },
      cameraMoved: {
        x: Math.abs(newCameraPosition.x - prevCameraPosition.x).toFixed(2),
        y: Math.abs(newCameraPosition.y - prevCameraPosition.y).toFixed(2),
        z: Math.abs(newCameraPosition.z - prevCameraPosition.z).toFixed(2),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId, meshesReady]) // meshesRef, cameraRef, controlsRef는 ref이므로 의존성에서 제외
}

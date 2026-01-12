import { useEffect } from 'react'
import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { BIMModel } from '@bridge-bim-platform/shared'
import { debugLog } from '../utils/debug'
import { createDefaultGeometry } from '../utils'

interface UseModelLoaderOptions {
  model: BIMModel | null
  sceneRef: React.RefObject<THREE.Scene | null>
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
  controlsRef: React.RefObject<OrbitControls | null>
  meshesRef: React.MutableRefObject<Map<string, THREE.Mesh>>
  modelLoadingRef: React.MutableRefObject<string | null>
  loadingAbortRef: React.MutableRefObject<boolean>
  meshesReadyRef: React.MutableRefObject<boolean>
  selectedComponentId?: string | null
}

export function useModelLoader(options: UseModelLoaderOptions) {
  const {
    model,
    sceneRef,
    cameraRef,
    controlsRef,
    meshesRef,
    modelLoadingRef,
    loadingAbortRef,
    meshesReadyRef,
    selectedComponentId,
  } = options

  useEffect(() => {
    if (!model || !sceneRef.current || !cameraRef.current || !controlsRef.current) {
      debugLog('[ThreeViewer] 모델 로딩 스킵: 필수 참조가 없음', {
        hasModel: !!model,
        hasScene: !!sceneRef.current,
        hasCamera: !!cameraRef.current,
        hasControls: !!controlsRef.current,
      })
      return
    }

    const modelId = model.metadata.id

    if (!meshesRef.current) return

    // 이미 메시가 로딩되어 있고 같은 모델이면 스킵 (React StrictMode 대응)
    if (meshesRef.current.size > 0 && meshesRef.current.size === model.components.length) {
      const firstMesh = meshesRef.current.values().next().value
      if (firstMesh && firstMesh.userData.modelId === modelId) {
        debugLog(`[ThreeViewer] 모델 ${modelId}는 이미 렌더링 완료되었습니다. 스킵합니다.`, {
          meshCount: meshesRef.current.size,
          expectedCount: model.components.length,
        })
        meshesReadyRef.current = true
        modelLoadingRef.current = modelId
        return
      }
    }

    // 중복 로딩 방지: 같은 모델이 이미 로딩 중이면 스킵
    // 하지만 메시가 이미 있으면 로딩 완료로 간주하고 meshesReady 설정
    if (modelLoadingRef.current === modelId) {
      if (meshesRef.current.size > 0) {
        // 메시가 있으면 준비 상태로 설정 (개수가 맞지 않아도 일단 준비된 것으로 간주)
        if (!meshesReadyRef.current) {
          meshesReadyRef.current = true
          debugLog(`[ThreeViewer] 모델 ${modelId}는 이미 로딩 중이지만 메시가 있습니다. 준비 상태로 설정합니다.`, {
            meshCount: meshesRef.current.size,
            expectedCount: model.components.length,
          })
        } else {
          debugLog(`[ThreeViewer] 모델 ${modelId}는 이미 로딩 중입니다. 스킵합니다.`, {
            meshCount: meshesRef.current.size,
            expectedCount: model.components.length,
            meshesReady: meshesReadyRef.current,
          })
        }
      } else {
        debugLog(`[ThreeViewer] 모델 ${modelId}는 이미 로딩 중입니다. 스킵합니다.`, {
          meshCount: meshesRef.current.size,
          expectedCount: model.components.length,
        })
      }
      return
    }
    
    // Scene이 없으면 스킵 (초기화가 완료되지 않음)
    if (!sceneRef.current) {
      debugLog('[ThreeViewer] Scene이 아직 초기화되지 않았습니다. 스킵합니다.')
      return
    }

    debugLog(`[ThreeViewer] 모델 로딩 시작: ${modelId}`, {
      previousModelId: modelLoadingRef.current,
      componentCount: model.components.length,
      currentMeshesCount: meshesRef.current.size,
    })

    // 이전 로딩 취소 플래그 해제
    loadingAbortRef.current = false

    // 로딩 시작 표시
    const previousModelId = modelLoadingRef.current
    modelLoadingRef.current = modelId
    meshesReadyRef.current = false

    const scene = sceneRef.current

    // 기존 메시 제거 (이전 모델이 다른 경우에만)
    if (previousModelId !== modelId) {
      debugLog(`[ThreeViewer] 이전 모델(${previousModelId})의 메시 제거 시작`)
      meshesRef.current.forEach((mesh) => {
        scene.remove(mesh)
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose())
        } else {
          mesh.material.dispose()
        }
      })
      meshesRef.current.clear()
      debugLog(`[ThreeViewer] 이전 모델의 메시 제거 완료`)
    } else {
      debugLog(`[ThreeViewer] 동일한 모델이므로 메시 제거 스킵`)
    }

    // 각 컴포넌트별로 3D 모델 생성
    debugLog(`[ThreeViewer] 렌더링 시작: 총 ${model.components.length}개 부재 (모델 ID: ${modelId})`)
    
    const loadPromises = model.components.map(async (component, index) => {
      try {
        debugLog(`[ThreeViewer] 부재 로딩 시작: ${component.name} (${component.id}) [${index + 1}/${model.components.length}]`)
        
        // 로딩이 취소되었는지 확인
        if (loadingAbortRef.current) {
          debugLog(`[ThreeViewer] 부재 ${component.id} 로딩 취소됨`)
          return Promise.resolve()
        }

        // 해당 컴포넌트의 형상 데이터 찾기
        const geometry = model.geometries.find((g) => g.componentId === component.id)

        if (!geometry) {
          console.warn(`[ThreeViewer] ${component.name} (${component.id})에 대한 geometry를 찾을 수 없습니다.`)
        }

        // 기본 형상 생성 (항상 표시)
        const defaultMesh = createDefaultGeometry(component, geometry?.boundingBox, index)
        
        // 이미 메시가 존재하는지 확인 (중복 방지)
        if (meshesRef.current.has(component.id)) {
          debugLog(`[ThreeViewer] 부재 ${component.id}는 이미 존재합니다. 스킵합니다.`)
          return Promise.resolve()
        }

        // 모델 ID를 메시에 저장
        defaultMesh.userData.modelId = modelId
        
        // 로딩이 취소되지 않았을 때만 추가
        if (!loadingAbortRef.current && sceneRef.current) {
          meshesRef.current.set(component.id, defaultMesh)
          sceneRef.current.add(defaultMesh)
          
          debugLog(`[ThreeViewer] 부재 추가: ${component.name} (${component.type}) - 위치: [${defaultMesh.position.x.toFixed(1)}, ${defaultMesh.position.y.toFixed(1)}, ${defaultMesh.position.z.toFixed(1)}]`, {
            componentId: component.id,
            meshId: defaultMesh.uuid,
            meshesRefSize: meshesRef.current.size,
          })
        } else {
          debugLog(`[ThreeViewer] 부재 추가 스킵 (로딩 취소됨 또는 Scene 없음):`, {
            componentId: component.id,
            componentName: component.name,
            loadingAborted: loadingAbortRef.current,
            sceneExists: !!sceneRef.current,
          })
        }
        
        // 명시적으로 Promise 반환
        return Promise.resolve()
      } catch (error) {
        console.error(`[ThreeViewer] 부재 ${component.id} 로딩 중 오류:`, error)
        return Promise.reject(error)
      }
    })

    debugLog(`[ThreeViewer] Promise.all 시작: ${loadPromises.length}개 Promise 대기 중`, {
      promisesLength: loadPromises.length,
      componentsLength: model.components.length,
    })
    
    Promise.all(loadPromises)
      .then(() => {
        debugLog(`[ThreeViewer] Promise.all 완료: 모든 부재 로딩 완료`)
      })
      .then(() => {
      debugLog(`[ThreeViewer] Promise.all 후 처리 시작`)
      
      // 모델이 변경되었으면 스킵 (로딩 취소는 이미 완료된 작업이므로 무시)
      if (modelLoadingRef.current !== modelId) {
        debugLog(`[ThreeViewer] 후 처리 스킵: 모델 변경됨`, {
          currentModelId: modelLoadingRef.current,
          expectedModelId: modelId,
        })
        return
      }
      
      // 로딩 취소 플래그는 체크하되, 이미 메시가 추가된 경우에는 계속 진행
      if (loadingAbortRef.current && meshesRef.current.size === 0) {
        debugLog(`[ThreeViewer] 후 처리 스킵: 로딩 취소됨 (메시 없음)`, {
          loadingAborted: loadingAbortRef.current,
          meshCount: meshesRef.current.size,
        })
        return
      }
      
      if (loadingAbortRef.current) {
        debugLog(`[ThreeViewer] 로딩 취소 플래그가 설정되었지만 메시가 이미 추가되어 후 처리를 계속합니다.`, {
          loadingAborted: loadingAbortRef.current,
          meshCount: meshesRef.current.size,
        })
      }

      if (!sceneRef.current || !cameraRef.current || !controlsRef.current) {
        debugLog(`[ThreeViewer] 후 처리 스킵: 필수 객체가 없음`, {
          hasScene: !!sceneRef.current,
          hasCamera: !!cameraRef.current,
          hasControls: !!controlsRef.current,
        })
        return
      }
      
      debugLog(`[ThreeViewer] 후 처리 계속: 모든 조건 충족`)

      debugLog(`[ThreeViewer] 모든 부재 렌더링 완료: 총 ${meshesRef.current.size}개 메시`, {
        modelId,
        meshesRefSize: meshesRef.current.size,
        sceneChildrenCount: sceneRef.current?.children.length || 0,
        hasScene: !!sceneRef.current,
        hasCamera: !!cameraRef.current,
        hasControls: !!controlsRef.current,
      })
      
      // 메시가 실제로 scene에 추가되었는지 확인
      const sceneMeshes: THREE.Mesh[] = []
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh && object.userData.componentId) {
          sceneMeshes.push(object)
        }
      })
      debugLog(`[ThreeViewer] Scene에 실제로 추가된 메시 수: ${sceneMeshes.length}`, {
        meshesRefSize: meshesRef.current.size,
        sceneMeshesCount: sceneMeshes.length,
        sceneChildrenCount: sceneRef.current.children.length,
        meshIds: sceneMeshes.map(m => m.userData.componentId),
      })
      
      // 메시 로딩 완료 플래그 설정 (Scene 확인 후)
      meshesReadyRef.current = true
      debugLog(`[ThreeViewer] meshesReady 플래그를 true로 설정했습니다.`, {
        meshCount: meshesRef.current.size,
        sceneMeshCount: sceneMeshes.length,
      })
      
      // 카메라 포커스는 useCameraFocus hook에서 별도로 처리
      debugLog(`[ThreeViewer] 모델 로딩 완료: 카메라 포커스는 useCameraFocus에서 처리됩니다.`, {
        meshCount: meshesRef.current.size,
        meshesReady: meshesReadyRef.current,
      })
    }).catch((error) => {
      debugLog(`[ThreeViewer] Promise.all 오류 발생:`, error)
      if (!loadingAbortRef.current) {
        console.error('[ThreeViewer] 렌더링 중 오류 발생:', error)
        console.error('[ThreeViewer] 오류 스택:', error instanceof Error ? error.stack : 'No stack trace')
      }
      // 오류 발생 시에도 로딩 플래그 해제
      if (modelLoadingRef.current === modelId) {
        modelLoadingRef.current = null
      }
    })
    
    debugLog(`[ThreeViewer] Promise.all 호출 완료 (비동기 처리 시작)`)

    // Cleanup 함수: 모델이 변경될 때만 실행 (언마운트 시에는 Scene cleanup에서 처리)
    return () => {
      // 모델이 실제로 변경된 경우에만 로딩 취소 플래그 설정
      // 같은 모델이면 플래그를 설정하지 않음 (React StrictMode 대응)
      if (modelLoadingRef.current !== modelId) {
        debugLog(`[ThreeViewer] 모델 변경으로 인한 cleanup: ${modelId} → ${modelLoadingRef.current}`)
        loadingAbortRef.current = true
      } else {
        debugLog(`[ThreeViewer] 같은 모델이므로 cleanup에서 로딩 취소 플래그를 설정하지 않습니다.`, {
          modelId,
          currentModelId: modelLoadingRef.current,
        })
      }
    }
  }, [model?.metadata.id, selectedComponentId])
}

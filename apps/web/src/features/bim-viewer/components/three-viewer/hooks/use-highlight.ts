import { useEffect } from 'react'
import * as THREE from 'three'
import { debugLog } from '../utils/debug'

interface UseHighlightOptions {
  selectedComponentId: string | null // null = 전체 보기, string = 특정 부재 선택
  meshesRef: React.MutableRefObject<Map<string, THREE.Mesh>>
  sceneRef: React.RefObject<THREE.Scene | null>
  meshesReadyRef: React.MutableRefObject<boolean>
}

export function useHighlight(options: UseHighlightOptions) {
  const { selectedComponentId, meshesRef, sceneRef, meshesReadyRef } = options

  useEffect(() => {
    debugLog('[ThreeViewer] useHighlight useEffect 실행:', {
      selectedComponentId,
      selectedComponentIdType: typeof selectedComponentId,
      isNull: selectedComponentId === null,
      isString: typeof selectedComponentId === 'string',
      meshCount: meshesRef.current?.size ?? 0,
      meshesReady: meshesReadyRef.current,
      hasScene: !!sceneRef.current,
    })
    
    if (!meshesRef.current) {
      debugLog('[ThreeViewer] 하이라이트 스킵: meshesRef.current가 null')
      return
    }
    
    // 메시가 준비되지 않았으면 스킵 (메시 로딩 완료 후 재실행됨)
    // 하지만 메시가 이미 있으면 준비된 것으로 간주
    const hasMeshes = meshesRef.current.size > 0
    const isReady = meshesReadyRef.current || hasMeshes
    
    if (!isReady || meshesRef.current.size === 0) {
      debugLog('[ThreeViewer] 하이라이트 효과 스킵: 메시가 아직 준비되지 않음', {
        selectedComponentId,
        meshesReady: meshesReadyRef.current,
        meshCount: meshesRef.current.size,
        hasMeshes,
        isReady,
      })
      // 메시가 있으면 준비 상태로 설정
      if (hasMeshes && !meshesReadyRef.current) {
        meshesReadyRef.current = true
        debugLog('[ThreeViewer] 메시가 있으므로 준비 상태로 설정')
      }
      return
    }

    debugLog('[ThreeViewer] 선택된 컴포넌트 하이라이트 효과 시작:', {
      selectedComponentId,
      selectedComponentIdType: typeof selectedComponentId,
      sceneExists: !!sceneRef.current,
      meshCount: meshesRef.current.size,
      availableMeshIds: Array.from(meshesRef.current.keys()),
      mode: selectedComponentId === null ? 'ALL' : 'COMPONENT',
    })

    if (!sceneRef.current) {
      console.warn('[ThreeViewer] Scene이 없어서 하이라이트 효과를 적용할 수 없습니다.')
      return
    }

    let selectedMeshFound = false
    let processedCount = 0

    // 핵심 로직: null = 전체 보기 (모든 하이라이트 제거), string = 특정 부재 선택
    meshesRef.current.forEach((mesh, componentId) => {
      // null이면 전체 보기 모드 (모든 하이라이트 제거)
      // string이면 특정 부재만 선택
      const isSelected = selectedComponentId !== null && componentId === selectedComponentId
      processedCount++

      // 상세 로그는 선택된 부재에 대해서만 출력
      if (isSelected) {
        debugLog(`[ThreeViewer] 부재 ${processedCount}/${meshesRef.current.size} 처리 (선택됨):`, {
          componentId,
          selectedComponentId,
          componentName: mesh.userData.component?.name,
          isSelected,
          hasMaterial: mesh.material instanceof THREE.MeshStandardMaterial,
          originalColor: mesh.userData.originalColor,
          originalEmissive: mesh.userData.originalEmissive,
          comparison: `${componentId} === ${selectedComponentId} = ${componentId === selectedComponentId}`,
        })
      }

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        if (isSelected) {
          // 선택된 부재: 하이라이트 적용
          selectedMeshFound = true
          const originalEmissive = mesh.userData.originalEmissive || 0x666666
          const originalColor = mesh.userData.originalColor || 0x3b82f6
          
          debugLog('[ThreeViewer] 부재 선택 - 하이라이트 적용:', {
            componentId,
            componentName: mesh.userData.component?.name,
            originalColor: `0x${originalColor.toString(16)}`,
            originalEmissive: `0x${originalEmissive.toString(16)}`,
          })

          mesh.material.emissive.setHex(originalEmissive)
          mesh.material.emissiveIntensity = 0.8
          mesh.material.color.setHex(originalColor)
          mesh.material.color.multiplyScalar(1.3)
        } else {
          // 선택되지 않은 부재: 원본 색상으로 복원 (전체 보기 모드)
          const originalColor = mesh.userData.originalColor || 0x3b82f6
          const originalEmissive = mesh.userData.originalEmissive || 0x1e3a8a
          const originalEmissiveIntensity = mesh.userData.originalEmissiveIntensity || 0.2
          
          mesh.material.color.setHex(originalColor)
          mesh.material.emissive.setHex(originalEmissive)
          mesh.material.emissiveIntensity = originalEmissiveIntensity
        }
      } else {
        console.warn('[ThreeViewer] MeshStandardMaterial이 아닌 부재:', {
          componentId,
          materialType: mesh.material?.constructor?.name,
        })
      }
    })

    debugLog('[ThreeViewer] 선택된 컴포넌트 하이라이트 효과 완료:', {
      selectedComponentId,
      mode: selectedComponentId === null ? 'ALL (전체 보기)' : `COMPONENT (${selectedComponentId})`,
      selectedMeshFound,
      processedCount,
      totalMeshes: meshesRef.current.size,
    })

    // 선택된 부재를 찾지 못한 경우 경고 (null이 아닌 경우에만)
    if (selectedComponentId !== null && !selectedMeshFound) {
      console.warn('[ThreeViewer] ⚠️ 선택된 부재를 메시 맵에서 찾을 수 없습니다!', {
        selectedComponentId,
        selectedComponentIdType: typeof selectedComponentId,
        availableMeshIds: Array.from(meshesRef.current.keys()),
        meshCount: meshesRef.current.size,
        comparisonResults: Array.from(meshesRef.current.keys()).map(id => ({
          id,
          matches: id === selectedComponentId,
          type: typeof id,
        })),
      })
    }
  }, [selectedComponentId]) // selectedComponentId 변경 시에만 실행
}

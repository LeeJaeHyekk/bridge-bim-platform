import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { BIMModel } from '@bridge-bim-platform/shared'
import { calculateBoundingBox } from './bounding-box'
import { debugLog } from './debug'

/**
 * 화면 기준 거리 계산 (공통 함수)
 * 카메라 FOV와 화면 비율을 고려하여 객체가 화면에 적절한 크기로 보이도록 거리 계산
 */
function calculateScreenBasedDistance(
  camera: THREE.PerspectiveCamera,
  size: THREE.Vector3,
  screenFillRatio: number = 0.8,
): number {
  const fov = camera.fov * (Math.PI / 180) // FOV를 라디안으로 변환
  const aspect = camera.aspect // 화면 비율 (width / height)
  
  // 바운딩 박스의 크기 (카메라 방향에 따른 투영 고려)
  const horizontalSize = Math.max(size.x, size.z) // 수평면에서의 최대 크기
  const verticalSize = size.y // 수직 크기
  
  // 수직 기준 거리 계산
  const verticalDistance = (verticalSize / 2) / (Math.tan(fov / 2) * screenFillRatio)
  
  // 수평 기준 거리 계산
  const horizontalDistance = (horizontalSize / 2) / (Math.tan(fov / 2) * aspect * screenFillRatio)
  
  // 더 큰 쪽을 기준으로 거리 결정 (모든 부분이 화면에 들어오도록)
  const baseDistance = Math.max(verticalDistance, horizontalDistance)
  
  // 최소 거리 보장 (너무 가까이 가지 않도록)
  const maxSize = Math.max(size.x, size.y, size.z)
  const minDistance = maxSize * 0.5
  
  return Math.max(baseDistance, minDistance)
}

/**
 * 카메라 위치 계산 (공통 함수)
 * 거리와 중심점을 기반으로 카메라 위치와 높이 오프셋 계산
 */
function calculateCameraPosition(
  center: THREE.Vector3,
  distance: number,
  angle: number = Math.PI / 4,
  heightOffsetRatio: number = 0.3,
): THREE.Vector3 {
  const heightOffset = distance * heightOffsetRatio
  
  return new THREE.Vector3(
    center.x + distance * Math.cos(angle),
    center.y + heightOffset,
    center.z + distance * Math.sin(angle),
  )
}

/**
 * 전체 모델의 바운딩 박스를 기준으로 카메라 포커스
 */
export function focusCameraToScene(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  model: BIMModel,
): void {
  debugLog('[CameraFocus:Scene] 🎬 focusCameraToScene 함수 호출', {
    modelId: model.metadata.id,
    geometriesCount: model.geometries.length,
    currentCameraPosition: {
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2),
    },
    currentControlsTarget: {
      x: controls.target.x.toFixed(2),
      y: controls.target.y.toFixed(2),
      z: controls.target.z.toFixed(2),
    },
  })

  if (!model.geometries.length) {
    debugLog('[CameraFocus:Scene] ⚠️ geometries가 없어서 전체 모델 포커스를 스킵합니다.', {
      modelId: model.metadata.id,
    })
    return
  }

  const bbox = calculateBoundingBox(model.geometries)
  debugLog(`[CameraFocus:Scene] 📦 전체 모델 바운딩 박스 계산 완료`, {
    min: bbox.min,
    max: bbox.max,
    modelId: model.metadata.id,
  })

  const center = new THREE.Vector3(
    (bbox.min[0] + bbox.max[0]) / 2,
    (bbox.min[1] + bbox.max[1]) / 2,
    (bbox.min[2] + bbox.max[2]) / 2,
  )

  // 바운딩 박스의 크기 계산
  const size = new THREE.Vector3(
    bbox.max[0] - bbox.min[0],
    bbox.max[1] - bbox.min[1],
    bbox.max[2] - bbox.min[2],
  )

  // 🔥 개선: 화면 기준 거리 계산 (공통 함수 사용)
  const screenFillRatio = 0.8 // 화면의 80%를 차지
  const distance = calculateScreenBasedDistance(camera, size, screenFillRatio)
  
  // 카메라 각도 (45도 isometric view)
  const angle = Math.PI / 4
  
  // 카메라 위치 계산 (공통 함수 사용)
  const newCameraPosition = calculateCameraPosition(center, distance, angle)

  debugLog(`[CameraFocus:Scene] 📐 카메라 포커스 계산 (화면 기준)`, {
    center: {
      x: center.x.toFixed(1),
      y: center.y.toFixed(1),
      z: center.z.toFixed(1),
    },
    size: {
      x: size.x.toFixed(1),
      y: size.y.toFixed(1),
      z: size.z.toFixed(1),
    },
    cameraFov: camera.fov,
    cameraAspect: camera.aspect.toFixed(2),
    finalDistance: distance.toFixed(1),
    screenFillRatio,
    newPosition: {
      x: newCameraPosition.x.toFixed(1),
      y: newCameraPosition.y.toFixed(1),
      z: newCameraPosition.z.toFixed(1),
    },
    modelId: model.metadata.id,
  })

  // 카메라 위치 설정
  camera.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z)
  controls.target.copy(center)
  controls.update()

  debugLog(`[CameraFocus:Scene] ✅ 전체 모델 카메라 포커스 완료`, {
    modelId: model.metadata.id,
    finalCameraPosition: {
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2),
    },
    finalControlsTarget: {
      x: controls.target.x.toFixed(2),
      y: controls.target.y.toFixed(2),
      z: controls.target.z.toFixed(2),
    },
  })
}

/**
 * 특정 부재의 바운딩 박스를 기준으로 카메라 포커스
 */
export function focusCameraToComponent(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  mesh: THREE.Mesh,
  componentName?: string,
): void {
  const componentId = mesh.userData.componentId
  const name = componentName || mesh.userData.component?.name

  debugLog(`[CameraFocus:ComponentFunc] 🎬 focusCameraToComponent 함수 호출`, {
    componentId,
    componentName: name,
    componentType: mesh.userData.component?.type,
    currentCameraPosition: {
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2),
    },
    currentControlsTarget: {
      x: controls.target.x.toFixed(2),
      y: controls.target.y.toFixed(2),
      z: controls.target.z.toFixed(2),
    },
  })

  // 메시의 바운딩 박스 계산
  const box = new THREE.Box3().setFromObject(mesh)
  const center = new THREE.Vector3()
  box.getCenter(center)

  const size = new THREE.Vector3()
  box.getSize(size)
  
  // 🔥 개선: 화면 기준 거리 계산 (공통 함수 사용)
  const screenFillRatio = 0.8 // 화면의 80%를 차지
  const distance = calculateScreenBasedDistance(camera, size, screenFillRatio)
  
  // 카메라 각도 (45도 isometric view)
  const angle = Math.PI / 4
  
  // 카메라 위치 계산 (공통 함수 사용)
  const newCameraPosition = calculateCameraPosition(center, distance, angle)

  debugLog(`[CameraFocus:ComponentFunc] 📐 부재 카메라 포커스 계산 (화면 기준)`, {
    componentId,
    componentName: name,
    center: {
      x: center.x.toFixed(1),
      y: center.y.toFixed(1),
      z: center.z.toFixed(1),
    },
    size: {
      x: size.x.toFixed(1),
      y: size.y.toFixed(1),
      z: size.z.toFixed(1),
    },
    cameraFov: camera.fov,
    cameraAspect: camera.aspect.toFixed(2),
    finalDistance: distance.toFixed(1),
    screenFillRatio,
    newPosition: {
      x: newCameraPosition.x.toFixed(1),
      y: newCameraPosition.y.toFixed(1),
      z: newCameraPosition.z.toFixed(1),
    },
  })

  // 카메라 위치 및 타겟 설정
  // 🔥 참고: 애니메이션은 use-camera-focus.ts에서 처리하므로 여기서는 즉시 설정
  camera.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z)
  controls.target.copy(center)
  controls.update()

  debugLog(`[CameraFocus:ComponentFunc] ✅ 부재 카메라 포커스 완료`, {
    componentId,
    componentName: name,
    finalCameraPosition: {
      x: camera.position.x.toFixed(2),
      y: camera.position.y.toFixed(2),
      z: camera.position.z.toFixed(2),
    },
    finalControlsTarget: {
      x: controls.target.x.toFixed(2),
      y: controls.target.y.toFixed(2),
      z: controls.target.z.toFixed(2),
    },
  })
}

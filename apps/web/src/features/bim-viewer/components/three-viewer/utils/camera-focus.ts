import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { BIMModel } from '@bridge-bim-platform/shared'
import { calculateBoundingBox } from './bounding-box'
import { debugLog } from './debug'

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

  // 🔥 개선: 화면 기준 거리 계산 (FOV + 화면 비율 고려)
  // 기존 방식: 객체의 절대 크기(maxSize) 기준 → 수평으로 긴 객체에서 과도하게 멀어짐
  // 개선 방식: 현재 카메라 시야(FOV) + 화면 비율 기준으로 "화면 안에 자연스럽게 들어오는 거리" 산정
  
  const fov = camera.fov * (Math.PI / 180) // FOV를 라디안으로 변환
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
  const maxSize = Math.max(size.x, size.y, size.z)
  const minDistance = maxSize * 0.5
  const distance = Math.max(baseDistance, minDistance)
  
  // 카메라 각도 (45도 isometric view)
  const angle = Math.PI / 4
  
  // 높이 오프셋: 객체 위에서 약간 내려다보는 시점
  // 거리에 비례하여 조정 (거리가 멀수록 높이 오프셋도 증가)
  const heightOffset = distance * 0.3
  
  const newCameraPosition = {
    x: center.x + distance * Math.cos(angle),
    y: center.y + heightOffset,
    z: center.z + distance * Math.sin(angle),
  }

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
    horizontalSize: horizontalSize.toFixed(1),
    verticalSize: verticalSize.toFixed(1),
    cameraFov: camera.fov,
    cameraAspect: aspect.toFixed(2),
    verticalDistance: verticalDistance.toFixed(1),
    horizontalDistance: horizontalDistance.toFixed(1),
    baseDistance: baseDistance.toFixed(1),
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
  
  // 🔥 개선: 화면 기준 거리 계산 (FOV + 화면 비율 고려)
  // 기존 방식: 객체의 절대 크기(maxSize) 기준 → 수평으로 긴 객체에서 과도하게 멀어짐
  // 개선 방식: 현재 카메라 시야(FOV) + 화면 비율 기준으로 "화면 안에 자연스럽게 들어오는 거리" 산정
  
  const fov = camera.fov * (Math.PI / 180) // FOV를 라디안으로 변환
  const aspect = camera.aspect // 화면 비율 (width / height)
  
  // 바운딩 박스의 크기 (카메라 방향에 따른 투영 고려)
  const horizontalSize = Math.max(size.x, size.z) // 수평면에서의 최대 크기
  const verticalSize = size.y // 수직 크기
  
  // 바운딩 박스가 화면의 80% 정도를 차지하도록 거리 계산
  const screenFillRatio = 0.8 // 화면의 80%를 차지
  
  // 수직 기준 거리 계산
  const verticalDistance = (verticalSize / 2) / (Math.tan(fov / 2) * screenFillRatio)
  
  // 수평 기준 거리 계산
  const horizontalDistance = (horizontalSize / 2) / (Math.tan(fov / 2) * aspect * screenFillRatio)
  
  // 더 큰 쪽을 기준으로 거리 결정 (모든 부분이 화면에 들어오도록)
  const baseDistance = Math.max(verticalDistance, horizontalDistance)
  
  // 최소 거리 보장 (너무 가까이 가지 않도록)
  const maxSize = Math.max(size.x, size.y, size.z)
  const minDistance = maxSize * 0.5
  const distance = Math.max(baseDistance, minDistance)
  
  // 카메라 각도 (45도 isometric view)
  const angle = Math.PI / 4
  
  // 높이 오프셋: 객체 위에서 약간 내려다보는 시점
  const heightOffset = distance * 0.3
  
  const newCameraPosition = {
    x: center.x + distance * Math.cos(angle),
    y: center.y + heightOffset,
    z: center.z + distance * Math.sin(angle),
  }

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
    horizontalSize: horizontalSize.toFixed(1),
    verticalSize: verticalSize.toFixed(1),
    cameraFov: camera.fov,
    cameraAspect: aspect.toFixed(2),
    verticalDistance: verticalDistance.toFixed(1),
    horizontalDistance: horizontalDistance.toFixed(1),
    baseDistance: baseDistance.toFixed(1),
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

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

  const size = Math.max(
    bbox.max[0] - bbox.min[0],
    bbox.max[1] - bbox.min[1],
    bbox.max[2] - bbox.min[2],
  )

  const distance = size * 2
  const newCameraPosition = {
    x: center.x + distance * 0.7,
    y: center.y + distance * 0.5,
    z: center.z + distance * 0.7,
  }

  debugLog(`[CameraFocus:Scene] 📐 카메라 포커스 계산`, {
    center: {
      x: center.x.toFixed(1),
      y: center.y.toFixed(1),
      z: center.z.toFixed(1),
    },
    size: size.toFixed(1),
    distance: distance.toFixed(1),
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
  const maxSize = Math.max(size.x, size.y, size.z)

  // 부재 주변에 여유 공간을 두고 포커스
  const distance = maxSize * 3
  const newCameraPosition = {
    x: center.x + distance * 0.7,
    y: center.y + distance * 0.5,
    z: center.z + distance * 0.7,
  }

  debugLog(`[CameraFocus:ComponentFunc] 📐 부재 카메라 포커스 계산`, {
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
    maxSize: maxSize.toFixed(1),
    distance: distance.toFixed(1),
    newPosition: {
      x: newCameraPosition.x.toFixed(1),
      y: newCameraPosition.y.toFixed(1),
      z: newCameraPosition.z.toFixed(1),
    },
  })

  // 카메라 위치 설정
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

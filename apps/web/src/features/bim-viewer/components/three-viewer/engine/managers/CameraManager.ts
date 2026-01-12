import * as THREE from 'three'
import type { Size } from '../types'
import { debugLog } from '../../utils/debug'

/**
 * Camera 생명주기 관리
 * 단일 책임: Camera 생성, 리사이즈, 포커스
 */

interface CameraManagerState {
  camera: THREE.PerspectiveCamera | null
}

function createCameraManager() {
  const state: CameraManagerState = {
    camera: null,
  }

  function init(size: Size): THREE.PerspectiveCamera {
    if (state.camera) {
      debugLog('[CameraManager] 기존 Camera 재사용')
      resize(size)
      return state.camera
    }

    debugLog('[CameraManager] Camera 생성 시작', { size })
    
    state.camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      10000,
    )
    state.camera.position.set(0, 10, 20)

    debugLog('[CameraManager] Camera 생성 완료', {
      position: {
        x: state.camera.position.x.toFixed(2),
        y: state.camera.position.y.toFixed(2),
        z: state.camera.position.z.toFixed(2),
      },
      aspect: state.camera.aspect.toFixed(2),
    })

    return state.camera
  }

  function getCamera(): THREE.PerspectiveCamera | null {
    return state.camera
  }

  function resize(size: Size): void {
    if (!state.camera) return

    state.camera.aspect = size.width / size.height
    state.camera.updateProjectionMatrix()

    debugLog('[CameraManager] Camera 리사이즈', {
      width: size.width,
      height: size.height,
      aspect: state.camera.aspect.toFixed(2),
    })
  }

  function dispose(): void {
    if (!state.camera) return

    debugLog('[CameraManager] Camera 정리')
    state.camera = null
  }

  return {
    init,
    getCamera,
    resize,
    dispose,
  }
}

export type CameraManager = ReturnType<typeof createCameraManager>

export function createCameraManagerInstance() {
  return createCameraManager()
}

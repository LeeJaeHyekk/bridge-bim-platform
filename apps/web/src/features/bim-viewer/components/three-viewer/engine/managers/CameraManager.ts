import * as THREE from 'three'
import type { Size } from '../types'
import { debugLog } from '../../utils/debug'

/**
 * Camera 생명주기 관리
 * 단일 책임: Camera 생성, 리사이즈, 포커스
 */
export class CameraManager {
  private camera: THREE.PerspectiveCamera | null = null

  init(size: Size): THREE.PerspectiveCamera {
    if (this.camera) {
      debugLog('[CameraManager] 기존 Camera 재사용')
      this.resize(size)
      return this.camera
    }

    debugLog('[CameraManager] Camera 생성 시작', { size })
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      10000,
    )
    this.camera.position.set(0, 10, 20)

    debugLog('[CameraManager] Camera 생성 완료', {
      position: {
        x: this.camera.position.x.toFixed(2),
        y: this.camera.position.y.toFixed(2),
        z: this.camera.position.z.toFixed(2),
      },
      aspect: this.camera.aspect.toFixed(2),
    })

    return this.camera
  }

  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera
  }

  resize(size: Size): void {
    if (!this.camera) return

    this.camera.aspect = size.width / size.height
    this.camera.updateProjectionMatrix()

    debugLog('[CameraManager] Camera 리사이즈', {
      width: size.width,
      height: size.height,
      aspect: this.camera.aspect.toFixed(2),
    })
  }

  dispose(): void {
    if (!this.camera) return

    debugLog('[CameraManager] Camera 정리')
    this.camera = null
  }
}

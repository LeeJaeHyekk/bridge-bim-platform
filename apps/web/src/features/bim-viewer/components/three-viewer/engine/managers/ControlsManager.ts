import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { debugLog } from '../../utils/debug'

/**
 * OrbitControls 생명주기 관리
 * 단일 책임: Controls 생성 및 설정
 */
export class ControlsManager {
  private controls: OrbitControls | null = null

  init(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ): OrbitControls {
    if (this.controls) {
      debugLog('[ControlsManager] 기존 Controls 재사용')
      return this.controls
    }

    debugLog('[ControlsManager] Controls 생성 시작')

    this.controls = new OrbitControls(camera, renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.enableZoom = true
    this.controls.enablePan = true

    debugLog('[ControlsManager] Controls 생성 완료')

    return this.controls
  }

  getControls(): OrbitControls | null {
    return this.controls
  }

  update(): void {
    if (this.controls) {
      this.controls.update()
    }
  }

  dispose(): void {
    if (!this.controls) return

    debugLog('[ControlsManager] Controls 정리')
    this.controls.dispose()
    this.controls = null
  }
}

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { debugLog } from '../../utils/debug'

/**
 * OrbitControls 생명주기 관리
 * 단일 책임: Controls 생성 및 설정
 */

interface ControlsManagerState {
  controls: OrbitControls | null
}

function createControlsManager() {
  const state: ControlsManagerState = {
    controls: null,
  }

  function init(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ): OrbitControls {
    if (state.controls) {
      debugLog('[ControlsManager] 기존 Controls 재사용')
      return state.controls
    }

    debugLog('[ControlsManager] Controls 생성 시작')

    state.controls = new OrbitControls(camera, renderer.domElement)
    state.controls.enableDamping = true
    state.controls.dampingFactor = 0.05
    state.controls.enableZoom = true
    state.controls.enablePan = true

    debugLog('[ControlsManager] Controls 생성 완료')

    return state.controls
  }

  function getControls(): OrbitControls | null {
    return state.controls
  }

  function update(): void {
    if (state.controls) {
      state.controls.update()
    }
  }

  function dispose(): void {
    if (!state.controls) return

    debugLog('[ControlsManager] Controls 정리')
    state.controls.dispose()
    state.controls = null
  }

  return {
    init,
    getControls,
    update,
    dispose,
  }
}

export type ControlsManager = ReturnType<typeof createControlsManager>

export function createControlsManagerInstance() {
  return createControlsManager()
}

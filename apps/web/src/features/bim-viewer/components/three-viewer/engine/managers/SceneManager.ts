import * as THREE from 'three'
import { debugLog } from '../../utils/debug'

/**
 * Scene 생명주기 관리
 * 단일 책임: Scene 생성, 조명/헬퍼 추가
 */

interface SceneManagerState {
  scene: THREE.Scene | null
}

function createSceneManager() {
  const state: SceneManagerState = {
    scene: null,
  }

  function addLights() {
    if (!state.scene) return

    const hasLights = state.scene.children.some(child => child instanceof THREE.Light)
    if (hasLights) {
      debugLog('[SceneManager] 조명이 이미 존재합니다.')
      return
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    state.scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight1.position.set(10, 10, 10)
    state.scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight2.position.set(-10, 5, -10)
    state.scene.add(directionalLight2)

    const topLight = new THREE.DirectionalLight(0xffffff, 0.6)
    topLight.position.set(0, 20, 0)
    state.scene.add(topLight)

    debugLog('[SceneManager] 조명 추가 완료')
  }

  function addHelpers() {
    if (!state.scene) return

    const hasGridHelper = state.scene.children.some(child => child instanceof THREE.GridHelper)
    if (!hasGridHelper) {
      const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222)
      state.scene.add(gridHelper)
    }

    const hasAxesHelper = state.scene.children.some(child => child instanceof THREE.AxesHelper)
    if (!hasAxesHelper) {
      const axesHelper = new THREE.AxesHelper(10)
      state.scene.add(axesHelper)
    }

    debugLog('[SceneManager] 헬퍼 추가 완료')
  }

  function init(): THREE.Scene {
    if (state.scene) {
      debugLog('[SceneManager] 기존 Scene 재사용')
      return state.scene
    }

    debugLog('[SceneManager] Scene 생성 시작')
    state.scene = new THREE.Scene()
    state.scene.background = new THREE.Color(0x1a1a1a)

    // 조명 추가
    addLights()
    
    // 헬퍼 추가
    addHelpers()

    debugLog('[SceneManager] Scene 생성 완료', {
      childrenCount: state.scene.children.length,
    })

    return state.scene
  }

  function getScene(): THREE.Scene | null {
    return state.scene
  }

  function dispose(): void {
    if (!state.scene) return

    debugLog('[SceneManager] Scene 정리 시작')
    
    state.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    state.scene = null
    debugLog('[SceneManager] Scene 정리 완료')
  }

  return {
    init,
    getScene,
    dispose,
  }
}

export type SceneManager = ReturnType<typeof createSceneManager>

export function createSceneManagerInstance() {
  return createSceneManager()
}

import type { Size } from './types'
import { createSceneManagerInstance, type SceneManager } from './managers/SceneManager'
import { createCameraManagerInstance, type CameraManager } from './managers/CameraManager'
import { createRendererManagerInstance, type RendererManager } from './managers/RendererManager'
import { createControlsManagerInstance, type ControlsManager } from './managers/ControlsManager'
import { createAnimationManagerInstance, type AnimationManager } from './managers/AnimationManager'
import { debugLog } from '../utils/debug'

/**
 * Three.js 엔진 Facade
 * React에서 Three.js로 가는 유일한 관문
 * 
 * 역할:
 * - React: 언제(init / load / focus)를 결정
 * - ThreeEngine: 어떻게(render / resize / animate)를 수행
 */

interface ThreeEngineState {
  sceneManager: SceneManager
  cameraManager: CameraManager
  rendererManager: RendererManager
  controlsManager: ControlsManager
  animationManager: AnimationManager
  initialized: boolean
}

function createThreeEngine() {
  const state: ThreeEngineState = {
    sceneManager: createSceneManagerInstance(),
    cameraManager: createCameraManagerInstance(),
    rendererManager: createRendererManagerInstance(),
    controlsManager: createControlsManagerInstance(),
    animationManager: createAnimationManagerInstance(),
    initialized: false,
  }

  /**
   * 엔진 초기화 (한 번만 실행)
   */
  function init(container: HTMLElement, size: Size): void {
    if (state.initialized) {
      debugLog('[ThreeEngine] 이미 초기화되었습니다. 스킵합니다.')
      return
    }

    debugLog('[ThreeEngine] 엔진 초기화 시작', { size })

    // 1. Scene 초기화
    const scene = state.sceneManager.init()

    // 2. Camera 초기화
    const camera = state.cameraManager.init(size)

    // 3. Renderer 초기화
    const renderer = state.rendererManager.init(container, size)

    // 4. Controls 초기화
    const controls = state.controlsManager.init(camera, renderer)

    // 5. 애니메이션 루프 시작
    state.animationManager.start(scene, camera, renderer, controls)

    state.initialized = true

    debugLog('[ThreeEngine] 엔진 초기화 완료', {
      hasScene: !!scene,
      hasCamera: !!camera,
      hasRenderer: !!renderer,
      hasControls: !!controls,
    })
  }

  /**
   * 리사이즈 처리
   */
  function resize(size: Size): void {
    if (!state.initialized) {
      debugLog('[ThreeEngine] 아직 초기화되지 않았습니다. resize 스킵')
      return
    }

    debugLog('[ThreeEngine] 리사이즈', { size })
    state.cameraManager.resize(size)
    state.rendererManager.resize(size)
  }

  /**
   * 엔진 정리
   */
  function destroy(): void {
    if (!state.initialized) {
      debugLog('[ThreeEngine] 아직 초기화되지 않았습니다. destroy 스킵')
      return
    }

    debugLog('[ThreeEngine] 엔진 정리 시작')

    state.animationManager.stop()
    state.controlsManager.dispose()
    state.rendererManager.dispose()
    state.cameraManager.dispose()
    // Scene은 메시가 있을 수 있으므로 선택적으로 정리
    // state.sceneManager.dispose()

    state.initialized = false

    debugLog('[ThreeEngine] 엔진 정리 완료')
  }

  // Getters for managers (향후 확장용)
  function getScene() {
    return state.sceneManager.getScene()
  }

  function getCamera() {
    return state.cameraManager.getCamera()
  }

  function getRenderer() {
    return state.rendererManager.getRenderer()
  }

  function getControls() {
    return state.controlsManager.getControls()
  }

  function isInitialized(): boolean {
    return state.initialized
  }

  return {
    init,
    resize,
    destroy,
    getScene,
    getCamera,
    getRenderer,
    getControls,
    isInitialized,
  }
}

export type ThreeEngine = ReturnType<typeof createThreeEngine>

export function createThreeEngineInstance() {
  return createThreeEngine()
}

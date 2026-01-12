import type { Size } from './types'
import { SceneManager } from './managers/SceneManager'
import { CameraManager } from './managers/CameraManager'
import { RendererManager } from './managers/RendererManager'
import { ControlsManager } from './managers/ControlsManager'
import { AnimationManager } from './managers/AnimationManager'
import { debugLog } from '../utils/debug'

/**
 * Three.js 엔진 Facade
 * React에서 Three.js로 가는 유일한 관문
 * 
 * 역할:
 * - React: 언제(init / load / focus)를 결정
 * - ThreeEngine: 어떻게(render / resize / animate)를 수행
 */
export class ThreeEngine {
  private sceneManager: SceneManager
  private cameraManager: CameraManager
  private rendererManager: RendererManager
  private controlsManager: ControlsManager
  private animationManager: AnimationManager

  private initialized = false

  constructor() {
    this.sceneManager = new SceneManager()
    this.cameraManager = new CameraManager()
    this.rendererManager = new RendererManager()
    this.controlsManager = new ControlsManager()
    this.animationManager = new AnimationManager()
  }

  /**
   * 엔진 초기화 (한 번만 실행)
   */
  init(container: HTMLElement, size: Size): void {
    if (this.initialized) {
      debugLog('[ThreeEngine] 이미 초기화되었습니다. 스킵합니다.')
      return
    }

    debugLog('[ThreeEngine] 엔진 초기화 시작', { size })

    // 1. Scene 초기화
    const scene = this.sceneManager.init()

    // 2. Camera 초기화
    const camera = this.cameraManager.init(size)

    // 3. Renderer 초기화
    const renderer = this.rendererManager.init(container, size)

    // 4. Controls 초기화
    const controls = this.controlsManager.init(camera, renderer)

    // 5. 애니메이션 루프 시작
    this.animationManager.start(scene, camera, renderer, controls)

    this.initialized = true

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
  resize(size: Size): void {
    if (!this.initialized) {
      debugLog('[ThreeEngine] 아직 초기화되지 않았습니다. resize 스킵')
      return
    }

    debugLog('[ThreeEngine] 리사이즈', { size })
    this.cameraManager.resize(size)
    this.rendererManager.resize(size)
  }

  /**
   * 엔진 정리
   */
  destroy(): void {
    if (!this.initialized) {
      debugLog('[ThreeEngine] 아직 초기화되지 않았습니다. destroy 스킵')
      return
    }

    debugLog('[ThreeEngine] 엔진 정리 시작')

    this.animationManager.stop()
    this.controlsManager.dispose()
    this.rendererManager.dispose()
    this.cameraManager.dispose()
    // Scene은 메시가 있을 수 있으므로 선택적으로 정리
    // this.sceneManager.dispose()

    this.initialized = false

    debugLog('[ThreeEngine] 엔진 정리 완료')
  }

  // Getters for managers (향후 확장용)
  getScene() {
    return this.sceneManager.getScene()
  }

  getCamera() {
    return this.cameraManager.getCamera()
  }

  getRenderer() {
    return this.rendererManager.getRenderer()
  }

  getControls() {
    return this.controlsManager.getControls()
  }

  isInitialized(): boolean {
    return this.initialized
  }
}

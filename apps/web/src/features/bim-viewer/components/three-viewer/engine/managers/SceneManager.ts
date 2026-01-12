import * as THREE from 'three'
import { debugLog } from '../../utils/debug'

/**
 * Scene 생명주기 관리
 * 단일 책임: Scene 생성, 조명/헬퍼 추가
 */
export class SceneManager {
  private scene: THREE.Scene | null = null

  init(): THREE.Scene {
    if (this.scene) {
      debugLog('[SceneManager] 기존 Scene 재사용')
      return this.scene
    }

    debugLog('[SceneManager] Scene 생성 시작')
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x1a1a1a)

    // 조명 추가
    this.addLights()
    
    // 헬퍼 추가
    this.addHelpers()

    debugLog('[SceneManager] Scene 생성 완료', {
      childrenCount: this.scene.children.length,
    })

    return this.scene
  }

  getScene(): THREE.Scene | null {
    return this.scene
  }

  private addLights(): void {
    if (!this.scene) return

    const hasLights = this.scene.children.some(child => child instanceof THREE.Light)
    if (hasLights) {
      debugLog('[SceneManager] 조명이 이미 존재합니다.')
      return
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    this.scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight1.position.set(10, 10, 10)
    this.scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight2.position.set(-10, 5, -10)
    this.scene.add(directionalLight2)

    const topLight = new THREE.DirectionalLight(0xffffff, 0.6)
    topLight.position.set(0, 20, 0)
    this.scene.add(topLight)

    debugLog('[SceneManager] 조명 추가 완료')
  }

  private addHelpers(): void {
    if (!this.scene) return

    const hasGridHelper = this.scene.children.some(child => child instanceof THREE.GridHelper)
    if (!hasGridHelper) {
      const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222)
      this.scene.add(gridHelper)
    }

    const hasAxesHelper = this.scene.children.some(child => child instanceof THREE.AxesHelper)
    if (!hasAxesHelper) {
      const axesHelper = new THREE.AxesHelper(10)
      this.scene.add(axesHelper)
    }

    debugLog('[SceneManager] 헬퍼 추가 완료')
  }

  dispose(): void {
    if (!this.scene) return

    debugLog('[SceneManager] Scene 정리 시작')
    
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    this.scene = null
    debugLog('[SceneManager] Scene 정리 완료')
  }
}

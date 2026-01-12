import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { debugLog } from '../../utils/debug'

/**
 * 애니메이션 루프 관리
 * 단일 책임: requestAnimationFrame 루프 시작/중지
 */
export class AnimationManager {
  private animationFrameId: number | null = null
  private isRunning = false

  start(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls,
  ): void {
    if (this.isRunning) {
      debugLog('[AnimationManager] 애니메이션 루프는 이미 실행 중입니다.')
      return
    }

    debugLog('[AnimationManager] 애니메이션 루프 시작')
    this.isRunning = true

    let frameCount = 0
    const animate = () => {
      if (!this.isRunning) {
        debugLog('[AnimationManager] 애니메이션 루프 중단')
        return
      }

      this.animationFrameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)

      // 처음 몇 프레임만 로그 출력
      if (frameCount < 5) {
        debugLog(`[AnimationManager] 프레임 ${frameCount}: 렌더링 완료`, {
          cameraPosition: {
            x: camera.position.x.toFixed(1),
            y: camera.position.y.toFixed(1),
            z: camera.position.z.toFixed(1),
          },
          sceneChildrenCount: scene.children.length,
        })
      }
      frameCount++
    }

    animate()
  }

  stop(): void {
    if (!this.isRunning) return

    debugLog('[AnimationManager] 애니메이션 루프 중지')
    this.isRunning = false

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  isActive(): boolean {
    return this.isRunning
  }
}

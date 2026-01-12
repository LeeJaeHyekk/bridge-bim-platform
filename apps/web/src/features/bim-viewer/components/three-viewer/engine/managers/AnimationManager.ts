import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { debugLog } from '../../utils/debug'

/**
 * 애니메이션 루프 관리
 * 단일 책임: requestAnimationFrame 루프 시작/중지
 */

interface AnimationManagerState {
  animationFrameId: number | null
  isRunning: boolean
}

function createAnimationManager() {
  const state: AnimationManagerState = {
    animationFrameId: null,
    isRunning: false,
  }

  function start(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls,
  ): void {
    if (state.isRunning) {
      debugLog('[AnimationManager] 애니메이션 루프는 이미 실행 중입니다.')
      return
    }

    debugLog('[AnimationManager] 애니메이션 루프 시작')
    state.isRunning = true

    let frameCount = 0
    const animate = () => {
      if (!state.isRunning) {
        debugLog('[AnimationManager] 애니메이션 루프 중단')
        return
      }

      state.animationFrameId = requestAnimationFrame(animate)
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

  function stop(): void {
    if (!state.isRunning) return

    debugLog('[AnimationManager] 애니메이션 루프 중지')
    state.isRunning = false

    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId)
      state.animationFrameId = null
    }
  }

  function isActive(): boolean {
    return state.isRunning
  }

  return {
    start,
    stop,
    isActive,
  }
}

export type AnimationManager = ReturnType<typeof createAnimationManager>

export function createAnimationManagerInstance() {
  return createAnimationManager()
}

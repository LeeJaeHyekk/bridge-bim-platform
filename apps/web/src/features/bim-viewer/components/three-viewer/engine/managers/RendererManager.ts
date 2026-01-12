import * as THREE from 'three'
import type { Size } from '../types'
import { debugLog } from '../../utils/debug'

/**
 * Renderer 생명주기 관리
 * 단일 책임: Renderer 생성, 리사이즈, DOM 연결
 */

interface RendererManagerState {
  renderer: THREE.WebGLRenderer | null
  container: HTMLElement | null
}

function createRendererManager() {
  const state: RendererManagerState = {
    renderer: null,
    container: null,
  }

  function init(container: HTMLElement, size: Size): THREE.WebGLRenderer {
    if (state.renderer && state.container === container) {
      debugLog('[RendererManager] 기존 Renderer 재사용')
      resize(size)
      return state.renderer
    }

    debugLog('[RendererManager] Renderer 생성 시작', { size })

    state.renderer = new THREE.WebGLRenderer({ antialias: true })
    state.renderer.setSize(size.width, size.height)
    state.renderer.setPixelRatio(window.devicePixelRatio)
    
    state.container = container
    container.appendChild(state.renderer.domElement)

    debugLog('[RendererManager] Renderer 생성 완료', {
      width: size.width,
      height: size.height,
      pixelRatio: window.devicePixelRatio,
    })

    return state.renderer
  }

  function getRenderer(): THREE.WebGLRenderer | null {
    return state.renderer
  }

  function resize(size: Size): void {
    if (!state.renderer) return

    state.renderer.setSize(size.width, size.height)

    debugLog('[RendererManager] Renderer 리사이즈', {
      width: size.width,
      height: size.height,
    })
  }

  function dispose(): void {
    if (!state.renderer || !state.container) return

    debugLog('[RendererManager] Renderer 정리 시작')

    try {
      state.container.removeChild(state.renderer.domElement)
    } catch (error) {
      debugLog('[RendererManager] DOM 요소 제거 실패 (이미 제거됨)', { error })
    }

    state.renderer.dispose()
    state.renderer = null
    state.container = null

    debugLog('[RendererManager] Renderer 정리 완료')
  }

  return {
    init,
    getRenderer,
    resize,
    dispose,
  }
}

export type RendererManager = ReturnType<typeof createRendererManager>

export function createRendererManagerInstance() {
  return createRendererManager()
}

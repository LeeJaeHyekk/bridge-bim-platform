import * as THREE from 'three'
import type { Size } from '../types'
import { debugLog } from '../../utils/debug'

/**
 * Renderer 생명주기 관리
 * 단일 책임: Renderer 생성, 리사이즈, DOM 연결
 */
export class RendererManager {
  private renderer: THREE.WebGLRenderer | null = null
  private container: HTMLElement | null = null

  init(container: HTMLElement, size: Size): THREE.WebGLRenderer {
    if (this.renderer && this.container === container) {
      debugLog('[RendererManager] 기존 Renderer 재사용')
      this.resize(size)
      return this.renderer
    }

    debugLog('[RendererManager] Renderer 생성 시작', { size })

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(size.width, size.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    
    this.container = container
    container.appendChild(this.renderer.domElement)

    debugLog('[RendererManager] Renderer 생성 완료', {
      width: size.width,
      height: size.height,
      pixelRatio: window.devicePixelRatio,
    })

    return this.renderer
  }

  getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer
  }

  resize(size: Size): void {
    if (!this.renderer) return

    this.renderer.setSize(size.width, size.height)

    debugLog('[RendererManager] Renderer 리사이즈', {
      width: size.width,
      height: size.height,
    })
  }

  dispose(): void {
    if (!this.renderer || !this.container) return

    debugLog('[RendererManager] Renderer 정리 시작')

    try {
      this.container.removeChild(this.renderer.domElement)
    } catch (error) {
      debugLog('[RendererManager] DOM 요소 제거 실패 (이미 제거됨)', { error })
    }

    this.renderer.dispose()
    this.renderer = null
    this.container = null

    debugLog('[RendererManager] Renderer 정리 완료')
  }
}

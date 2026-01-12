import * as THREE from 'three'

export function createResizeHandler(
  container: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  width?: number,
  height?: number,
) {
  return () => {
    if (!camera || !renderer || !container) return

    const rect = container.getBoundingClientRect()
    const newWidth = width || rect.width || container.clientWidth || 800
    const newHeight = height || rect.height || container.clientHeight || 600

    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  }
}

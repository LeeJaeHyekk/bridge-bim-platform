import * as THREE from 'three'
import { debugLog } from '../utils/debug'

export function createClickHandler(
  container: HTMLDivElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  meshes: Map<string, THREE.Mesh>,
  onComponentClick?: (componentId: string) => void,
) {
  return (event: MouseEvent) => {
    if (!renderer || !camera || !scene) {
      debugLog('[ThreeViewer] 클릭 이벤트 스킵: renderer, camera 또는 scene이 없음')
      return
    }

    const mouse = new THREE.Vector2()
    const rect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    // scene에서 직접 메시를 가져옴 (클로저 문제 해결)
    const meshesArray: THREE.Mesh[] = []
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData.componentId) {
        meshesArray.push(object)
      }
    })

    debugLog('[ThreeViewer] 클릭 이벤트:', {
      mousePosition: { x: mouse.x, y: mouse.y },
      availableMeshes: meshesArray.length,
      meshIds: meshesArray.map(m => m.userData.componentId),
      meshesRefSize: meshes.size,
    })

    const intersects = raycaster.intersectObjects(meshesArray)

    debugLog('[ThreeViewer] 레이캐스팅 결과:', {
      intersectCount: intersects.length,
      intersects: intersects.map(i => ({
        componentId: (i.object as THREE.Mesh).userData.componentId,
        componentName: (i.object as THREE.Mesh).userData.component?.name,
        distance: i.distance,
      })),
    })

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh
      const componentId = clickedMesh.userData.componentId
      const component = clickedMesh.userData.component
      
      debugLog('[ThreeViewer] 클릭된 부재:', {
        componentId,
        componentIdType: typeof componentId,
        componentName: component?.name,
        componentType: component?.type,
        isString: typeof componentId === 'string',
        hasComponentId: !!componentId,
      })
      
      // 핵심: componentId가 string 타입인지 엄격히 검증
      if (typeof componentId === 'string' && componentId.length > 0 && onComponentClick) {
        debugLog('[ThreeViewer] ✅ onComponentClick 콜백 호출 (유효한 componentId):', {
          componentId,
          componentIdType: typeof componentId,
          componentName: component?.name,
        })
        onComponentClick(componentId)
      } else {
        console.warn('[ThreeViewer] ⚠️ 클릭 이벤트 스킵: componentId가 유효하지 않음', {
          componentId,
          componentIdType: typeof componentId,
          isString: typeof componentId === 'string',
          isEmpty: componentId === '',
          hasCallback: !!onComponentClick,
          userData: clickedMesh.userData,
        })
      }
    } else {
      debugLog('[ThreeViewer] 클릭된 부재가 없음 (빈 공간 클릭)')
    }
  }
}

import * as THREE from 'three'
import type { BIMComponent } from '@bridge-bim-platform/shared'
import { debugLog } from './debug'

// 컴포넌트 타입별 기본 형상 생성
export function createDefaultGeometry(
  component: BIMComponent,
  boundingBox?: { min: [number, number, number]; max: [number, number, number] },
  index: number = 0,
): THREE.Mesh {
  let geometry: THREE.BufferGeometry
  let position: [number, number, number] = [0, 0, 0]
  
  const size = boundingBox
    ? {
        x: Math.max(boundingBox.max[0] - boundingBox.min[0], 0.5),
        y: Math.max(boundingBox.max[1] - boundingBox.min[1], 0.5),
        z: Math.max(boundingBox.max[2] - boundingBox.min[2], 0.5),
      }
    : { x: 2, y: 2, z: 2 } // 기본 크기

  // 바운딩 박스가 있으면 위치 계산
  if (boundingBox) {
    position = [
      (boundingBox.min[0] + boundingBox.max[0]) / 2,
      (boundingBox.min[1] + boundingBox.max[1]) / 2,
      (boundingBox.min[2] + boundingBox.max[2]) / 2,
    ]
  } else {
    // 바운딩 박스가 없으면 인덱스 기반으로 배치
    position = [index * 5, 0, 0]
  }

  // 컴포넌트 타입에 따라 다른 형상 생성
  let needsRotation = false

  switch (component.type) {
    case 'Pylon':
    case 'Column':
      // 원기둥 (주탑, 기둥)
      geometry = new THREE.CylinderGeometry(
        Math.max(size.x, size.z) / 2,
        Math.max(size.x, size.z) / 2,
        size.y,
        32,
      )
      break
    case 'Cable':
      // 케이블: Quaternion을 사용한 정확한 방향 계산
      if (boundingBox) {
        // Y 좌표가 높은 쪽을 시작점(주탑 상단)으로 간주
        const startY = Math.max(boundingBox.min[1], boundingBox.max[1])
        const endY = Math.min(boundingBox.min[1], boundingBox.max[1])
        
        // 시작점과 끝점 결정 (Y가 높은 쪽이 시작점)
        const isMinStart = boundingBox.min[1] > boundingBox.max[1]
        const startX = isMinStart ? boundingBox.min[0] : boundingBox.max[0]
        const startZ = isMinStart ? boundingBox.min[2] : boundingBox.max[2]
        const endX = isMinStart ? boundingBox.max[0] : boundingBox.min[0]
        const endZ = isMinStart ? boundingBox.max[2] : boundingBox.min[2]
        
        // 시작점과 끝점을 Vector3로 생성
        const start = new THREE.Vector3(startX, startY, startZ)
        const end = new THREE.Vector3(endX, endY, endZ)
        
        // 방향 벡터 계산
        const direction = new THREE.Vector3().subVectors(end, start)
        const length = direction.length()
        
        // 원기둥 생성 (케이블) - 높이는 케이블 길이
        geometry = new THREE.CylinderGeometry(0.1, 0.1, Math.max(length, 0.1), 16)
        
        // 중점 계산
        const midpoint = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
        position = [midpoint.x, midpoint.y, midpoint.z]
        
        // Quaternion 회전을 위해 방향 벡터와 시작/끝점 저장
        needsRotation = true
        // userData에 저장하여 나중에 Quaternion 계산에 사용
        ;(geometry as any).userData = {
          start,
          end,
          direction: direction.normalize(),
        }
      } else {
        geometry = new THREE.CylinderGeometry(0.1, 0.1, size.y, 16)
      }
      break
    case 'Deck':
    case 'Beam':
      // 박스 (상판, 보)
      geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
      break
    case 'Foundation':
      // 박스 (기초)
      geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
      break
    default:
      // 기본 박스
      geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
  }

  // 상태에 따른 색상 설정 (더 밝고 선명한 색상)
  let color = 0x3b82f6 // 기본 파란색 (더 밝게)
  let emissiveColor = 0x1e3a8a // 기본 emissive (어두운 파란색)
  
  if (component.status === 'SAFE') {
    color = 0x22c55e // 초록색 (더 밝게)
    emissiveColor = 0x15803d // 어두운 초록색
  } else if (component.status === 'WARNING') {
    color = 0xeab308 // 노란색 (더 밝게)
    emissiveColor = 0xca8a04 // 어두운 노란색
  } else if (component.status === 'DANGER') {
    color = 0xef4444 // 빨간색 (더 밝게)
    emissiveColor = 0xdc2626 // 어두운 빨간색
  }

  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: emissiveColor,
    emissiveIntensity: 0.2, // 부재가 스스로 빛을 내도록 설정
    metalness: 0.2, // 0.3 -> 0.2 (더 반사적)
    roughness: 0.5, // 0.7 -> 0.5 (더 반짝임)
  })

  const mesh = new THREE.Mesh(geometry, material)
  
  // 위치 설정
  mesh.position.set(position[0], position[1], position[2])
  
  // 원본 색상 정보를 userData에 저장 (선택 해제 시 복원용)
  mesh.userData.originalColor = color
  mesh.userData.originalEmissive = emissiveColor
  mesh.userData.originalEmissiveIntensity = 0.2
  
  // 케이블 회전 적용 (Quaternion 방식)
  if (component.type === 'Cable' && needsRotation && boundingBox) {
    // Geometry의 userData에서 저장된 방향 정보 가져오기
    const geometryData = (geometry as any).userData
    if (geometryData && geometryData.direction) {
      const direction = geometryData.direction.clone()
      
      // CylinderGeometry의 기본 방향은 Y축 (0, 1, 0)
      const up = new THREE.Vector3(0, 1, 0)
      
      // 방향 벡터가 0이 아닌 경우에만 회전 적용
      if (direction.length() > 0.001) {
        // Quaternion을 사용하여 Y축(기본 방향)에서 케이블 방향으로 회전
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
        mesh.quaternion.copy(quaternion)
        
        // 디버깅용 로그 (Quaternion을 Euler로 변환하여 출력)
        const euler = new THREE.Euler().setFromQuaternion(quaternion)
        debugLog(
          `[ThreeViewer] 케이블 ${component.name} 회전 (Quaternion): ` +
          `X=${(euler.x * 180 / Math.PI).toFixed(1)}°, ` +
          `Y=${(euler.y * 180 / Math.PI).toFixed(1)}°, ` +
          `Z=${(euler.z * 180 / Math.PI).toFixed(1)}°`
        )
      } else {
        console.warn(`[ThreeViewer] 케이블 ${component.name}: 방향 벡터가 유효하지 않습니다.`)
      }
    }
  }

  // 사용자 데이터에 컴포넌트 ID 저장 (클릭 이벤트용)
  // modelId는 메시 생성 후 별도로 설정됨
  mesh.userData.componentId = component.id
  mesh.userData.component = component

  return mesh
}

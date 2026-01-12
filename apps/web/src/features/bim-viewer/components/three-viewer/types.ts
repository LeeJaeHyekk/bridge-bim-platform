import type { BIMModel } from '@bridge-bim-platform/shared'

export interface ThreeViewerProps {
  // 🔥 width/height props 제거: containerSize로 자동 관리
  // 크기는 containerRef.getBoundingClientRect()로 자동 계산됨
  model?: BIMModel | null
  // null = 전체 보기, string = 특정 부재 선택
  // undefined는 절대 사용하지 않음 (방어 코드에서 null로 변환)
  selectedComponentId?: string | null
  onComponentClick?: (componentId: string) => void
}

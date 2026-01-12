import { useRef, useEffect } from 'react'
import { ThreeEngine, type Size } from '../engine'
import { debugLog } from '../utils/debug'

/**
 * React ↔ ThreeEngine 브리지 Hook
 * 
 * 역할:
 * - ThreeEngine 인스턴스 생성 및 관리
 * - React 생명주기와 ThreeEngine 생명주기 연결
 */
export function useThreeEngine(
  containerRef: React.RefObject<HTMLDivElement>,
  size: Size,
) {
  // 엔진 인스턴스 생성 (컴포넌트 생명주기 동안 유지)
  const engineRef = useRef<ThreeEngine | null>(null)
  
  // 엔진 인스턴스가 없으면 생성
  if (!engineRef.current) {
    debugLog('[useThreeEngine] ThreeEngine 인스턴스 생성')
    engineRef.current = new ThreeEngine()
  }

  // 엔진 초기화 및 리사이즈
  useEffect(() => {
    if (!engineRef.current || !containerRef.current) return

    const { width, height } = size
    if (!width || !height) {
      debugLog('[useThreeEngine] 컨테이너 사이즈가 준비되지 않았습니다.', { size })
      return
    }

    if (!engineRef.current.isInitialized()) {
      debugLog('[useThreeEngine] 엔진 초기화', { size })
      engineRef.current.init(containerRef.current, size)
    } else {
      debugLog('[useThreeEngine] 엔진 리사이즈', { size })
      engineRef.current.resize(size)
    }
  }, [size.width, size.height])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        debugLog('[useThreeEngine] ThreeEngine 인스턴스 정리')
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, [])

  // 엔진 인스턴스 반환 (항상 존재)
  return engineRef.current
}

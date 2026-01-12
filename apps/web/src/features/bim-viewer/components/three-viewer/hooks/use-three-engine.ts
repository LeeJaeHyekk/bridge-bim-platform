import { useRef, useEffect, useState } from 'react'
import { createThreeEngineInstance, type ThreeEngine, type Size } from '../engine'
import { debugLog } from '../utils/debug'

/**
 * React ↔ ThreeEngine 브리지 Hook
 * 
 * 역할:
 * - ThreeEngine 인스턴스 생성 및 관리
 * - React 생명주기와 ThreeEngine 생명주기 연결
 * - 엔진 초기화 상태 추적 및 반환
 */
export function useThreeEngine(
  containerRef: React.RefObject<HTMLDivElement>,
  size: Size,
) {
  // 엔진 인스턴스 생성 (컴포넌트 생명주기 동안 유지)
  const engineRef = useRef<ThreeEngine | null>(null)
  
  // 엔진 초기화 상태 추적 (ref 동기화를 위한 트리거)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // 엔진 인스턴스가 없으면 생성
  if (!engineRef.current) {
    debugLog('[useThreeEngine] ThreeEngine 인스턴스 생성')
    engineRef.current = createThreeEngineInstance()
  }

  // 엔진 초기화 및 리사이즈
  useEffect(() => {
    if (!engineRef.current || !containerRef.current) return

    const { width, height } = size
    if (!width || !height) {
      debugLog('[useThreeEngine] 컨테이너 사이즈가 준비되지 않았습니다.', { size })
      setIsInitialized(false)
      return
    }

    if (!engineRef.current.isInitialized()) {
      debugLog('[useThreeEngine] 엔진 초기화', { size })
      engineRef.current.init(containerRef.current, size)
      // 초기화 완료 후 상태 업데이트 (다음 렌더에서 ref 동기화 트리거)
      setIsInitialized(true)
    } else {
      debugLog('[useThreeEngine] 엔진 리사이즈', { size })
      engineRef.current.resize(size)
    }
  }, [size.width, size.height])

  // 엔진 초기화 상태 동기화 (엔진이 이미 초기화된 경우)
  useEffect(() => {
    if (engineRef.current && engineRef.current.isInitialized() && !isInitialized) {
      setIsInitialized(true)
    }
  }, [isInitialized])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        debugLog('[useThreeEngine] ThreeEngine 인스턴스 정리')
        engineRef.current.destroy()
        engineRef.current = null
        setIsInitialized(false)
      }
    }
  }, [])

  // 엔진 인스턴스와 초기화 상태 반환
  return {
    engine: engineRef.current,
    isInitialized,
  }
}

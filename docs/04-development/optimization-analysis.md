# Three.js BIM Viewer 구조 분석 및 최적화 제안

## 📋 분석 일시
2024년 현재

## 🔍 발견된 개선 포인트

### 1. 코드 중복 (High Priority)

#### 문제점
- `camera-focus.ts`의 `focusCameraToScene`과 `focusCameraToComponent` 함수에서 화면 기준 거리 계산 로직이 중복됨
- 동일한 계산 로직이 두 곳에 존재하여 유지보수 어려움

#### 위치
- `apps/web/src/features/bim-viewer/components/three-viewer/utils/camera-focus.ts`
  - `focusCameraToScene` (라인 57-102)
  - `focusCameraToComponent` (라인 188-226)

#### 개선 방안
```typescript
// 공통 함수로 추출
function calculateScreenBasedDistance(
  camera: THREE.PerspectiveCamera,
  size: THREE.Vector3,
  screenFillRatio: number = 0.8
): number {
  const fov = camera.fov * (Math.PI / 180)
  const aspect = camera.aspect
  const horizontalSize = Math.max(size.x, size.z)
  const verticalSize = size.y
  
  const verticalDistance = (verticalSize / 2) / (Math.tan(fov / 2) * screenFillRatio)
  const horizontalDistance = (horizontalSize / 2) / (Math.tan(fov / 2) * aspect * screenFillRatio)
  
  const baseDistance = Math.max(verticalDistance, horizontalDistance)
  const maxSize = Math.max(size.x, size.y, size.z)
  const minDistance = maxSize * 0.5
  
  return Math.max(baseDistance, minDistance)
}
```

---

### 2. 애니메이션 Cleanup 누락 (High Priority)

#### 문제점
- `use-camera-focus.ts`의 `requestAnimationFrame` 기반 애니메이션이 cleanup되지 않음
- 컴포넌트 언마운트 시 또는 새로운 애니메이션이 시작될 때 이전 애니메이션이 계속 실행될 수 있음

#### 위치
- `apps/web/src/features/bim-viewer/components/three-viewer/hooks/use-camera-focus.ts`
  - 라인 373-400 (부재 선택 시 애니메이션)

#### 개선 방안
```typescript
useEffect(() => {
  // ... 기존 코드 ...
  
  let animationFrameId: number | null = null
  let cancelled = false
  
  const animate = (currentTime: number) => {
    if (cancelled) return
    
    // ... 기존 애니메이션 로직 ...
    
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      // 완료 처리
    }
  }
  
  animationFrameId = requestAnimationFrame(animate)
  
  return () => {
    cancelled = true
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}, [selectedComponentId, meshesReady])
```

---

### 3. 불필요한 리렌더링 (Medium Priority)

#### 문제점
- `index.tsx`의 일부 `useEffect`가 의존성 배열이 없어 매 렌더마다 실행됨
- 디버그 로그가 과도하게 출력됨

#### 위치
- `apps/web/src/features/bim-viewer/components/three-viewer/index.tsx`
  - 라인 132-146: Ref 상태 체크 (의존성 배열 없음)
  - 라인 198-229: 진행 상황 요약 (의존성 배열 없음)

#### 개선 방안
```typescript
// 의존성 배열 추가 또는 useMemo로 최적화
useEffect(() => {
  // ... 로직 ...
}, [engine, engineInitialized, meshesRef.current.size, modelLoadingRef.current])

// 또는 개발 환경에서만 실행
useEffect(() => {
  if (!isDev) return
  // ... 디버그 로직 ...
}, [/* 의존성 */])
```

---

### 4. Polling 최적화 (Medium Priority)

#### 문제점
- `use-camera-focus.ts`에서 `setInterval`을 사용한 메시 카운트 추적 (50ms 간격)
- 메시가 준비되지 않았을 때만 polling하도록 개선 가능

#### 위치
- `apps/web/src/features/bim-viewer/components/three-viewer/hooks/use-camera-focus.ts`
  - 라인 54-79

#### 개선 방안
```typescript
// ResizeObserver나 MutationObserver 활용 고려
// 또는 useModelLoader에서 직접 콜백으로 알림
useEffect(() => {
  if (!model || !modelId) {
    setMeshCountState(0)
    return
  }
  
  const currentCount = meshesRef.current.size
  setMeshCountState(currentCount)
  
  // 이미 준비되었으면 polling 불필요
  if (currentCount >= expectedComponentCount) {
    return
  }
  
  // 짧은 간격으로 체크하되, 최대 시간 제한 추가
  const startTime = Date.now()
  const maxWaitTime = 5000 // 5초 최대 대기
  
  const interval = setInterval(() => {
    const newCount = meshesRef.current.size
    setMeshCountState(newCount)
    
    if (newCount >= expectedComponentCount || Date.now() - startTime > maxWaitTime) {
      clearInterval(interval)
    }
  }, 50)
  
  return () => clearInterval(interval)
}, [modelId, expectedComponentCount])
```

---

### 5. 메모이제이션 부족 (Low Priority)

#### 문제점
- 화면 기준 거리 계산 로직이 매번 재실행됨
- 동일한 입력에 대해 결과를 캐싱할 수 있음

#### 개선 방안
```typescript
// useMemo로 계산 결과 메모이제이션
const distance = useMemo(() => {
  return calculateScreenBasedDistance(camera, size, screenFillRatio)
}, [camera.fov, camera.aspect, size.x, size.y, size.z, screenFillRatio])
```

---

### 6. 타입 안정성 개선 (Low Priority)

#### 문제점
- 일부 refs가 null일 수 있는데 체크가 부족함
- `cameraRef.current!` 같은 non-null assertion이 과도하게 사용됨

#### 개선 방안
```typescript
// 명시적인 null 체크
if (!cameraRef.current || !controlsRef.current) {
  return
}

// 또는 타입 가드 함수 사용
function assertRefsReady(
  camera: THREE.PerspectiveCamera | null,
  controls: OrbitControls | null
): asserts camera is THREE.PerspectiveCamera {
  if (!camera || !controls) {
    throw new Error('Camera or controls not ready')
  }
}
```

---

## 📊 우선순위 요약

| 우선순위 | 항목 | 영향도 | 난이도 |
|---------|------|--------|--------|
| High | 코드 중복 제거 | 높음 | 낮음 |
| High | 애니메이션 cleanup | 높음 | 낮음 |
| Medium | 불필요한 리렌더링 | 중간 | 중간 |
| Medium | Polling 최적화 | 중간 | 중간 |
| Low | 메모이제이션 | 낮음 | 낮음 |
| Low | 타입 안정성 | 낮음 | 낮음 |

## 🎯 권장 작업 순서

1. **애니메이션 cleanup 추가** (메모리 누수 방지)
2. **코드 중복 제거** (유지보수성 향상)
3. **불필요한 리렌더링 최적화** (성능 향상)
4. **Polling 최적화** (리소스 사용 감소)
5. **메모이제이션 및 타입 안정성** (코드 품질 향상)

## 📝 참고사항

- 현재 기능은 정상 작동 중
- 개선 사항은 점진적으로 적용 권장
- 각 개선 후 테스트 필수

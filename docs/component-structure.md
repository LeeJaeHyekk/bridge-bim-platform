# 컴포넌트 구조 가이드

## 📋 개요

이 문서는 프로젝트의 컴포넌트 구조와 각 컴포넌트의 역할을 설명합니다.

## 🏗️ 컴포넌트 계층 구조

```
App (providers.tsx)
└─ RouterProvider (router.tsx)
   └─ AppLayout (layout.tsx)
      ├─ Navigation (shared/ui/navigation.tsx)
      └─ Outlet
         ├─ DashboardPage (pages/dashboard/index.tsx)
         ├─ BridgeListPage (pages/bridge-list/index.tsx)
         └─ BridgeDetailPage (pages/bridge-detail/index.tsx)
            └─ BIMViewer (features/bim-viewer/components/bim-viewer.tsx)
               └─ ThreeViewer (features/bim-viewer/components/three-viewer.tsx)
```

## 📄 주요 컴포넌트

### 1. App Layout (`app/layout.tsx`)

**역할**: 전체 앱의 공통 레이아웃을 제공합니다.

**구성 요소:**
- `Navigation`: 전역 네비게이션 바
- `Outlet`: 하위 라우트 렌더링

**스타일:**
- 최소 높이: `100vh`
- 배경색: `bg-gray-50`

---

### 2. Navigation (`shared/ui/navigation.tsx`)

**역할**: 전역 네비게이션 바를 제공합니다.

**기능:**
- 현재 경로 하이라이트
- 링크 네비게이션

**스타일 파일:** `shared/styles/navigation.module.css`

---

### 3. Dashboard Page (`pages/dashboard/index.tsx`)

**역할**: 대시보드 페이지를 렌더링합니다.

**구성 요소:**
- 통계 카드 (전체, 안전, 주의, 위험)
- 교량 목록 (최대 6개)
- 빠른 액션 버튼

**데이터:**
- `useBridges()` Hook 사용

**스타일 파일:** `pages/dashboard/dashboard.module.css`

**주요 섹션:**
1. 헤더 (제목, 부제목)
2. 통계 그리드 (4개 카드)
3. 교량 목록 카드
4. 빠른 액션 카드

---

### 4. Bridge List Page (`pages/bridge-list/index.tsx`)

**역할**: 모든 교량 목록을 표시합니다.

**기능:**
- 교량 목록 그리드 표시
- 로딩/에러 상태 처리
- 교량 카드 클릭 시 상세 페이지로 이동

**데이터:**
- `useBridges()` Hook 사용

---

### 5. Bridge Detail Page (`pages/bridge-detail/index.tsx`)

**역할**: 특정 교량의 상세 정보를 표시합니다.

**구성 요소:**
- 교량 정보 카드
- BIM 뷰어
- BIM 속성 패널

**데이터:**
- `useBridge(id)` Hook 사용
- `useBIMModel(bridgeId)` Hook 사용

---

### 6. Bridge Card (`features/bridge/components/bridge-card.tsx`)

**역할**: 교량 정보를 카드 형태로 표시합니다.

**표시 정보:**
- 교량 이름
- 상태 배지 (SAFE/WARNING/DANGER)
- 위치

**스타일 파일:** `shared/styles/bridge-card.module.css`

**상태별 스타일:**
- `SAFE`: 초록색
- `WARNING`: 노란색
- `DANGER`: 빨간색

---

### 7. BIM Viewer (`features/bim-viewer/components/bim-viewer.tsx`)

**역할**: BIM 모델을 표시하는 메인 컴포넌트입니다.

**구성 요소:**
- `ThreeViewer`: 3D 렌더링 영역
- `BIMFilter`: 필터 컨트롤 (향후 구현)
- `BIMProperties`: 속성 패널

**데이터:**
- `useBIMModel(bridgeId)` Hook 사용
- `useBIMComponents(modelId)` Hook 사용

**스타일 파일:** `shared/styles/bim-viewer.module.css`

---

### 8. Three Viewer (`features/bim-viewer/components/three-viewer.tsx`)

**역할**: Three.js를 사용하여 3D 씬을 렌더링합니다.

**기능:**
- Scene, Camera, Renderer 설정
- 기본 구체 렌더링 (현재)
- OrbitControls로 카메라 조작
- 애니메이션 루프
- 리사이즈 처리
- 메모리 정리 (cleanup)

**Props:**
- `width`: number
- `height`: number
- `selectedComponent?`: 선택된 부재 (향후 하이라이트용)

**향후 확장:**
- glTF 모델 로딩
- 부재 하이라이트
- 섹션 커팅

---

### 9. BIM Filter (`features/bim-viewer/components/bim-filter.tsx`)

**역할**: BIM 부재를 필터링하는 컨트롤을 제공합니다.

**필터 옵션:**
- 부재 타입 (Pylon, Cable, Deck 등)
- 상태 (SAFE, WARNING, DANGER)

**상태:** 향후 구현 예정

---

### 10. BIM Properties (`features/bim-viewer/components/bim-properties.tsx`)

**역할**: 선택된 BIM 부재의 속성을 표시합니다.

**표시 정보:**
- 부재 이름 및 타입
- 속성 목록
- 부모/자식 관계

**스타일 파일:** `shared/styles/bim-properties.module.css`

---

## 🎨 공통 UI 컴포넌트

### Loading Spinner (`shared/ui/loading.tsx`)

**역할**: 로딩 상태를 표시합니다.

**Props:**
- `size?`: 'sm' | 'md' | 'lg'

**사용 예시:**
```tsx
<LoadingSpinner size="lg" />
```

---

### Error Message (`shared/ui/error.tsx`)

**역할**: 에러 메시지를 표시합니다.

**Props:**
- `message`: string

**사용 예시:**
```tsx
<ErrorMessage message="데이터를 불러올 수 없습니다." />
```

---

## 📦 컴포넌트 Export 구조

각 기능 모듈은 `index.ts` 파일을 통해 컴포넌트를 export합니다:

```tsx
// features/bridge/components/index.ts
export { BridgeCard } from './bridge-card'

// features/bridge/index.ts
export { BridgeCard } from './components'
export { useBridges, useBridge } from './hooks'
export * from './api'
```

**사용 예시:**
```tsx
import { BridgeCard, useBridges } from '@/features/bridge'
```

## 🔄 데이터 흐름

```
Page Component
  ↓ useHook()
Feature Hook
  ↓ api.call()
API Function
  ↓ fetch()
Backend API
  ↓ response
Hook State Update
  ↓ re-render
Page Component
```

## 📝 컴포넌트 작성 가이드

### 새 컴포넌트 추가 시

1. **파일 생성**
   ```
   features/my-feature/components/my-component.tsx
   features/my-feature/components/my-component.module.css
   ```

2. **컴포넌트 작성**
   ```tsx
   import styles from './my-component.module.css'
   
   interface MyComponentProps {
     // props 정의
   }
   
   export function MyComponent({ ...props }: MyComponentProps) {
     return <div className={styles.container}>...</div>
   }
   ```

3. **Export 추가**
   ```tsx
   // features/my-feature/components/index.ts
   export { MyComponent } from './my-component'
   ```

4. **스타일 작성**
   - CSS Modules 사용
   - 반응형 미디어 쿼리 추가
   - `box-sizing: border-box` 적용

## 🎯 베스트 프랙티스

1. **단일 책임 원칙**: 각 컴포넌트는 하나의 명확한 역할만 수행
2. **재사용성**: 공통 컴포넌트는 `shared/ui`에 배치
3. **타입 안정성**: 모든 Props에 타입 정의
4. **스타일 분리**: CSS Modules로 스타일 분리
5. **에러 처리**: 로딩/에러 상태 항상 처리

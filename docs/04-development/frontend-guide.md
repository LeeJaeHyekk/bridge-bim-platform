# 프론트엔드 개발 가이드

> 이 문서는 프론트엔드 개발자가 프로젝트에서 작업하는 방법을 단계별로 설명합니다.

## 📋 목차

- [시작하기](#시작하기)
- [프로젝트 구조 이해하기](#프로젝트-구조-이해하기)
- [컴포넌트 작성하기](#컴포넌트-작성하기)
- [데이터 페칭하기](#데이터-페칭하기)
- [스타일링하기](#스타일링하기)
- [라우팅 설정하기](#라우팅-설정하기)
- [문제 해결](#문제-해결)

---

## 🚀 시작하기

### 개발 환경 설정

**1단계: 의존성 설치**
```bash
npm install
```

**2단계: 개발 서버 실행**
```bash
# 프론트엔드만 실행
npm run dev:web

# 또는 프론트엔드 + 백엔드 동시 실행
npm run dev
```

**3단계: 브라우저에서 확인**
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:3001

### 개발 도구

**필수 도구:**
- React DevTools (브라우저 확장 프로그램)
- TypeScript 지원 에디터 (VS Code 권장)

**유용한 VS Code 확장:**
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

---

## 📐 프로젝트 구조 이해하기

### 전체 구조

프론트엔드는 **Feature-Sliced Design**과 **DDD-lite** 원칙을 따릅니다.

```
src/
├─ app/              # 앱 레벨 설정 (라우터, 레이아웃, 스토어)
├─ pages/            # 페이지 레벨 (라우트 단위 컴포넌트)
├─ features/         # 기능 레벨 (비즈니스 로직)
├─ entities/         # 엔티티 레벨 (도메인 모델)
└─ shared/           # 공유 레벨 (재사용 가능한 코드)
```

### 각 레이어의 역할

| 레이어 | 역할 | 예시 |
|--------|------|------|
| **app/** | 앱 초기 설정 | 라우터, 레이아웃, Redux Store |
| **pages/** | 페이지 컴포넌트 | 대시보드, 교량 목록, 교량 상세 |
| **features/** | 기능 모듈 | 교량 조회, BIM 뷰어 |
| **entities/** | 도메인 엔티티 | 교량 엔티티 |
| **shared/** | 공통 리소스 | UI 컴포넌트, 스타일, 유틸리티 |

### 어디에 무엇을 넣어야 할까요?

**새로운 기능 추가:**
- ✅ `features/새기능/` 폴더에 추가
- ❌ `pages/`에 직접 비즈니스 로직 작성하지 않기

**공통 UI 컴포넌트:**
- ✅ `shared/ui/` 폴더에 추가
- ❌ `features/` 안에 공통 컴포넌트 넣지 않기

**도메인 모델:**
- ✅ `entities/` 폴더에 추가
- ❌ `features/` 안에 도메인 모델 넣지 않기

---

## 🧩 컴포넌트 작성하기

### 새 컴포넌트 추가하기

**1단계: 파일 생성**

```
features/my-feature/components/
├─ my-component.tsx
└─ my-component.module.css
```

**2단계: 컴포넌트 작성**

```tsx
// features/my-feature/components/my-component.tsx
import styles from './my-component.module.css'
import { clsx } from 'clsx'

interface MyComponentProps {
  title: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function MyComponent({ 
  title, 
  onClick, 
  variant = 'primary' 
}: MyComponentProps) {
  return (
    <div 
      className={clsx(styles.container, styles[variant])}
      onClick={onClick}
    >
      <h2 className={styles.title}>{title}</h2>
    </div>
  )
}
```

**3단계: 스타일 작성**

```css
/* features/my-feature/components/my-component.module.css */
.container {
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}
```

**4단계: Export 추가**

```tsx
// features/my-feature/components/index.ts
export { MyComponent } from './my-component'
```

### 공통 UI 컴포넌트 사용하기

프로젝트에서 제공하는 공통 컴포넌트:

| 컴포넌트 | 위치 | 용도 |
|---------|------|------|
| `Navigation` | `shared/ui/navigation.tsx` | 전역 네비게이션 바 |
| `LoadingSpinner` | `shared/ui/loading.tsx` | 로딩 상태 표시 |
| `LoadingPage` | `shared/ui/loading.tsx` | 전체 페이지 로딩 |
| `ErrorMessage` | `shared/ui/error.tsx` | 에러 메시지 표시 |
| `ErrorPage` | `shared/ui/error.tsx` | 전체 페이지 에러 |

**사용 예시:**

```tsx
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'
import { useBridges } from '@/features/bridge/hooks'

export function BridgeListPage() {
  const { bridges, loading, error } = useBridges()
  
  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <ErrorMessage message={error.message} />
  
  return (
    <div>
      {bridges.map(bridge => (
        <BridgeCard key={bridge.id} bridge={bridge} />
      ))}
    </div>
  )
}
```

---

## 🔄 데이터 페칭하기

### 커스텀 Hook 사용하기

각 기능 모듈은 커스텀 Hook을 제공합니다.

**기존 Hook 사용:**

```tsx
import { useBridges, useBridge } from '@/features/bridge/hooks'
import { useBIMModel } from '@/features/bim-viewer/hooks'

export function BridgeDetailPage({ bridgeId }: { bridgeId: string }) {
  // 교량 정보 가져오기
  const { bridge, loading: bridgeLoading, error: bridgeError } = useBridge(bridgeId)
  
  // BIM 모델 가져오기
  const { model, loading: modelLoading, error: modelError } = useBIMModel(bridgeId)
  
  if (bridgeLoading || modelLoading) return <LoadingSpinner />
  if (bridgeError || modelError) return <ErrorMessage message="데이터를 불러올 수 없습니다." />
  
  return <div>{/* ... */}</div>
}
```

### 새 Hook 만들기

**1단계: API 함수 작성**

```tsx
// features/my-feature/api.ts
import type { MyData } from '@bridge-bim-platform/shared'

const API_BASE_URL = '/api/my-feature'

export async function getMyData(id: string): Promise<MyData> {
  const response = await fetch(`${API_BASE_URL}/${id}`)
  if (!response.ok) {
    throw new Error('데이터를 불러올 수 없습니다.')
  }
  return response.json()
}
```

**2단계: Hook 작성**

```tsx
// features/my-feature/hooks.ts
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loadMyData } from './myFeatureSlice'
import { getMyData } from './api'

export function useMyData(id: string) {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector(
    (state) => state.myFeature
  )
  
  useEffect(() => {
    if (id) {
      dispatch(loadMyData(id))
    }
  }, [dispatch, id])
  
  return { data, loading, error }
}
```

**3단계: Redux Slice 작성**

```tsx
// features/my-feature/myFeatureSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMyData } from './api'
import { handleAsyncThunk } from '@/shared/redux'

export const loadMyData = createAsyncThunk(
  'myFeature/loadMyData',
  async (id: string) => {
    return await getMyData(id)
  }
)

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunk(builder, loadMyData, (state) => state)
  },
})

export default myFeatureSlice.reducer
```

---

## 🎨 스타일링하기

### CSS Modules 사용

프로젝트는 **CSS Modules**를 사용하여 컴포넌트별로 스타일을 관리합니다.

**파일 구조:**
```
components/
├─ my-component.tsx
└─ my-component.module.css
```

**사용 예시:**

```tsx
import styles from './my-component.module.css'
import { clsx } from 'clsx'

export function MyComponent({ isActive }: { isActive: boolean }) {
  return (
    <div className={clsx(styles.container, isActive && styles.active)}>
      <h1 className={styles.title}>제목</h1>
    </div>
  )
}
```

```css
/* my-component.module.css */
.container {
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
}

.active {
  background-color: #3b82f6;
  color: white;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
}
```

### clsx로 조건부 클래스

```tsx
import { clsx } from 'clsx'

<div className={clsx(
  styles.card,
  isActive && styles.active,
  variant === 'primary' && styles.primary,
  disabled && styles.disabled
)}>
```

### 반응형 디자인

CSS Modules에서 미디어 쿼리를 사용합니다:

```css
.container {
  padding: 1rem;
}

/* 태블릿 이상 */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }
}

/* 데스크톱 이상 */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
}
```

**브레이크포인트:**
- `640px`: 모바일 → 태블릿
- `768px`: 태블릿
- `1024px`: 태블릿 → 데스크톱
- `1280px`: 대형 데스크톱

### Tailwind CSS 사용

Tailwind CSS는 유틸리티 클래스로 사용하되, CSS Modules와 함께 사용합니다.

**권장 패턴:**
- 레이아웃, 간격: CSS Modules
- 유틸리티: Tailwind (필요시)

```tsx
// CSS Modules로 레이아웃
<div className={styles.container}>
  {/* Tailwind로 유틸리티 */}
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    클릭
  </button>
</div>
```

---

## 🛣️ 라우팅 설정하기

### 새 페이지 추가하기

**1단계: 페이지 컴포넌트 생성**

```tsx
// pages/my-page/index.tsx
export function MyPage() {
  return <div>My Page</div>
}
```

**2단계: 라우트 추가**

```tsx
// app/router.tsx
import { MyPage } from '@/pages/my-page'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/my-page', element: <MyPage /> }, // 새 라우트 추가
      // ...
    ],
  },
])
```

**3단계: 네비게이션에 링크 추가 (선택사항)**

```tsx
// shared/ui/navigation.tsx
<Link to="/my-page">My Page</Link>
```

### 동적 라우트 사용하기

```tsx
// app/router.tsx
{ path: '/bridges/:id', element: <BridgeDetailPage /> }

// pages/bridge-detail/index.tsx
import { useParams } from 'react-router-dom'

export function BridgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  // id를 사용하여 데이터 가져오기
}
```

---

## 📦 타입 정의하기

### Shared 패키지 사용

프론트엔드와 백엔드가 공유하는 타입은 `@bridge-bim-platform/shared`에서 가져옵니다:

```tsx
import type { Bridge, BIMModel, BridgeStatus } from '@bridge-bim-platform/shared'

function MyComponent({ bridge }: { bridge: Bridge }) {
  // ...
}
```

### 로컬 타입 정의

컴포넌트별 타입은 해당 파일에 정의합니다:

```tsx
interface MyComponentProps {
  title: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function MyComponent({ title, onClick, variant }: MyComponentProps) {
  // ...
}
```

---

## 🚀 개발 워크플로우

### 새 기능 추가하기

**1단계: Feature 폴더 생성**
```bash
mkdir -p apps/web/src/features/my-feature/components
```

**2단계: 기본 파일 생성**
- `api.ts` - API 호출 함수
- `hooks.ts` - React Hooks
- `myFeatureSlice.ts` - Redux Slice
- `components/` - 컴포넌트 폴더
- `index.ts` - Export 파일

**3단계: Redux Store에 추가**
```tsx
// app/store.ts
import myFeatureReducer from '@/features/my-feature/myFeatureSlice'

export const store = configureStore({
  reducer: {
    // ...
    myFeature: myFeatureReducer,
  },
})
```

**4단계: 타입 체크**
```bash
npm run typecheck
```

**5단계: 개발 서버에서 확인**
```bash
npm run dev:web
```

---

## 🐛 문제 해결

### HMR이 작동하지 않아요

**해결 방법:**
1. 브라우저 새로고침 (Ctrl+R 또는 Cmd+R)
2. 개발 서버 재시작
3. 브라우저 캐시 삭제

### 타입 에러가 발생해요

**해결 방법:**
```bash
# 타입 체크 실행
npm run typecheck

# 에러 메시지 확인 후 수정
```

**일반적인 타입 에러:**
- `any` 타입 사용 → 명시적 타입 지정
- `undefined` 가능성 → 옵셔널 체이닝 또는 타입 가드 사용
- Shared 패키지 타입 불일치 → `npm install` 재실행

### CSS가 적용되지 않아요

**해결 방법:**
1. CSS Module import 확인
   ```tsx
   import styles from './my-component.module.css' // ✅ 올바름
   import './my-component.css' // ❌ 잘못됨
   ```
2. 클래스명 오타 확인
3. CSS 파일이 올바른 위치에 있는지 확인

### API 호출이 실패해요

**해결 방법:**
1. 백엔드 서버가 실행 중인지 확인 (`npm run dev:api`)
2. 네트워크 탭에서 요청 확인
3. CORS 설정 확인
4. API 엔드포인트 URL 확인

### Redux 상태가 업데이트되지 않아요

**해결 방법:**
1. Redux DevTools로 상태 확인
2. Action이 dispatch되는지 확인
3. Reducer가 올바르게 작성되었는지 확인
4. Store에 reducer가 등록되었는지 확인

---

## 📝 코딩 컨벤션

### 명명 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| **컴포넌트** | PascalCase | `MyComponent` |
| **파일명** | kebab-case | `my-component.tsx` |
| **함수** | camelCase | `handleClick` |
| **상수** | UPPER_SNAKE_CASE | `API_BASE_URL` |
| **타입/인터페이스** | PascalCase | `MyType` |

### 코드 스타일

**함수형 컴포넌트 사용:**
```tsx
// ✅ 권장
export function MyComponent() {
  return <div>Hello</div>
}

// ❌ 비권장
export const MyComponent = () => {
  return <div>Hello</div>
}
```

**Props 타입 정의:**
```tsx
// ✅ 권장
interface MyComponentProps {
  title: string
  onClick: () => void
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  // ...
}
```

---

## 💡 베스트 프랙티스

### 1. 컴포넌트는 작게 유지하기

```tsx
// ✅ 좋은 예: 작은 컴포넌트들로 분리
function BridgeCard({ bridge }: { bridge: Bridge }) {
  return (
    <Card>
      <BridgeHeader bridge={bridge} />
      <BridgeBody bridge={bridge} />
      <BridgeFooter bridge={bridge} />
    </Card>
  )
}

// ❌ 나쁜 예: 하나의 큰 컴포넌트
function BridgeCard({ bridge }: { bridge: Bridge }) {
  return (
    <div>
      {/* 100줄 이상의 코드 */}
    </div>
  )
}
```

### 2. 커스텀 Hook으로 로직 분리하기

```tsx
// ✅ 좋은 예: 로직을 Hook으로 분리
function BridgeListPage() {
  const { bridges, loading, error } = useBridges()
  // ...
}

// ❌ 나쁜 예: 컴포넌트 안에 모든 로직
function BridgeListPage() {
  const [bridges, setBridges] = useState([])
  const [loading, setLoading] = useState(true)
  // ... 50줄 이상의 로직
}
```

### 3. 에러 처리 항상 하기

```tsx
// ✅ 좋은 예: 에러 처리 포함
function MyComponent() {
  const { data, loading, error } = useMyData()
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  
  return <div>{/* ... */}</div>
}
```

---

**마지막 업데이트**: 2024년

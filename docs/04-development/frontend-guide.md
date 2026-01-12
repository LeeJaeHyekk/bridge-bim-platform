# 프론트엔드 개발 가이드

## 📐 프로젝트 구조

프론트엔드는 **Feature-Sliced Design**과 **DDD-lite** 원칙을 따릅니다.

```
src/
├─ app/              # 앱 레벨 설정
├─ pages/            # 페이지 레벨 (라우트)
├─ features/         # 기능 레벨 (비즈니스 로직)
├─ entities/         # 엔티티 레벨 (도메인 모델)
└─ shared/           # 공유 레벨 (재사용 가능한 코드)
```

## 🎨 스타일링

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

export function MyComponent() {
  return (
    <div className={clsx(styles.container, styles.active)}>
      <h1 className={styles.title}>제목</h1>
    </div>
  )
}
```

### 전역 스타일

`src/shared/styles/global.css`에 전역 스타일을 정의합니다.

현재 적용된 전역 스타일:
- `box-sizing: border-box` (모든 요소)

### Tailwind CSS

Tailwind CSS는 유틸리티 클래스로 사용하되, CSS Modules와 함께 사용합니다.

**권장 패턴:**
- 레이아웃, 간격: CSS Modules
- 유틸리티: Tailwind (필요시)

## 🧩 컴포넌트 구조

### 공통 UI 컴포넌트 (`shared/ui`)

재사용 가능한 UI 컴포넌트:

- **Navigation**: 전역 네비게이션 바
- **LoadingSpinner / LoadingPage**: 로딩 상태 표시
- **ErrorMessage / ErrorPage**: 에러 상태 표시

**사용 예시:**
```tsx
import { LoadingSpinner, ErrorMessage } from '@/shared/ui'

if (loading) return <LoadingSpinner size="lg" />
if (error) return <ErrorMessage message={error.message} />
```

### 기능 컴포넌트 (`features`)

각 기능은 독립적인 모듈로 구성됩니다:

```
features/
└─ bridge/
   ├─ api.ts              # API 호출 함수
   ├─ hooks.ts            # React Hooks
   ├─ components/        # 컴포넌트
   │  └─ bridge-card.tsx
   └─ index.ts            # Export
```

## 🔄 데이터 페칭

### React Hooks 패턴

각 기능 모듈은 커스텀 Hook을 제공합니다:

```tsx
// features/bridge/hooks.ts
export function useBridges() {
  const [bridges, setBridges] = useState<Bridge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    bridgeApi.getAll()
      .then(setBridges)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { bridges, loading, error }
}
```

**사용 예시:**
```tsx
import { useBridges } from '@/features/bridge/hooks'

export function BridgeListPage() {
  const { bridges, loading, error } = useBridges()
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  
  return <div>{/* ... */}</div>
}
```

## 🛣️ 라우팅

React Router DOM을 사용합니다.

**라우트 정의 (`app/router.tsx`):**
```tsx
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/bridges', element: <BridgeListPage /> },
      { path: '/bridges/:id', element: <BridgeDetailPage /> },
    ],
  },
])
```

**레이아웃 (`app/layout.tsx`):**
```tsx
export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Outlet />
    </div>
  )
}
```

## 🎯 3D 렌더링 (Three.js)

### ThreeViewer 컴포넌트

`features/bim-viewer/components/three-viewer.tsx`에서 Three.js를 사용하여 3D 렌더링을 수행합니다.

**주요 기능:**
- Scene, Camera, Renderer 설정
- OrbitControls로 카메라 조작
- 애니메이션 루프
- 리사이즈 처리
- 메모리 정리 (cleanup)

**사용 예시:**
```tsx
import { ThreeViewer } from '@/features/bim-viewer/components'

<ThreeViewer width={800} height={600} />
```

## 📱 반응형 디자인

CSS Modules에서 미디어 쿼리를 사용합니다:

```css
.container {
  padding: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }
}

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

## 🔧 유틸리티

### clsx

조건부 클래스명을 위해 `clsx`를 사용합니다:

```tsx
import { clsx } from 'clsx'

<div className={clsx(
  styles.card,
  isActive && styles.active,
  variant === 'primary' && styles.primary
)}>
```

## 📦 타입 정의

### Shared 패키지 사용

프론트엔드와 백엔드가 공유하는 타입은 `@bridge-bim-platform/shared`에서 가져옵니다:

```tsx
import type { Bridge, BridgeStatus } from '@bridge-bim-platform/shared'
```

### 로컬 타입 정의

컴포넌트별 타입은 해당 파일에 정의합니다:

```tsx
interface MyComponentProps {
  title: string
  onClick: () => void
}
```

## 🚀 개발 워크플로우

1. **새 기능 추가**
   - `features/`에 새 폴더 생성
   - `api.ts`, `hooks.ts`, `components/` 구조 생성
   - 필요시 `pages/`에 페이지 추가

2. **스타일 추가**
   - 컴포넌트와 같은 이름의 `.module.css` 파일 생성
   - CSS Modules로 스타일 작성

3. **타입 체크**
   ```bash
   npm run typecheck
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev:web
   ```

## 📝 코딩 컨벤션

- **컴포넌트**: PascalCase (`MyComponent`)
- **파일명**: kebab-case (`my-component.tsx`)
- **함수**: camelCase (`handleClick`)
- **상수**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **타입/인터페이스**: PascalCase (`MyType`)

## 🐛 디버깅

### 개발자 도구

- React DevTools: 컴포넌트 트리 및 상태 확인
- 브라우저 DevTools: 네트워크, 콘솔 확인

### 일반적인 문제

1. **HMR이 작동하지 않음**
   - 브라우저 새로고침
   - 개발 서버 재시작

2. **타입 에러**
   ```bash
   npm run typecheck
   ```

3. **CSS가 적용되지 않음**
   - CSS Module import 확인
   - 클래스명 오타 확인

# 아키텍처 설계

> 이 문서는 Bridge BIM Platform의 전체 아키텍처와 설계 원칙을 설명합니다. 프로젝트를 처음 시작하는 개발자를 위한 가이드입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [빠른 시작 가이드](#빠른-시작-가이드)
- [설계 원칙](#설계-원칙)
- [프로젝트 구조](#프로젝트-구조)
- [주요 컴포넌트 이해하기](#주요-컴포넌트-이해하기)
- [데이터 흐름](#데이터-흐름)
- [확장 가이드](#확장-가이드)

---

## 📐 프로젝트 개요

**프로젝트명**: Bridge BIM Platform  
**타입**: 모노레포 (npm workspaces)  
**목적**: 교량 BIM 데이터를 웹에서 시각화하고 관리하는 플랫폼  
**아키텍처**: DDD-lite + Feature-Sliced Design

### 핵심 특징

- ✅ **모노레포 구조**: 프론트엔드와 백엔드가 타입을 공유
- ✅ **3D BIM 뷰어**: Three.js 기반 실시간 렌더링
- ✅ **확장 가능한 구조**: 새로운 기능 추가가 쉬움
- ✅ **타입 안정성**: TypeScript로 전체 타입 정의

---

## 🚀 빠른 시작 가이드

### 프로젝트 구조 한눈에 보기

```
bridge-bim-platform/
├── apps/
│   ├── web/          ← 프론트엔드 (React + TypeScript)
│   └── api/          ← 백엔드 (Express + TypeScript)
├── packages/
│   └── shared/       ← 공통 타입 (프론트/백엔드 공유)
└── docs/             ← 프로젝트 문서
```

### 개발 시작하기

**1단계: 프로젝트 클론 및 설치**
```bash
git clone <repository-url>
cd bridge-bim-platform
npm install
```

**2단계: 개발 서버 실행**
```bash
# 프론트엔드와 백엔드 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:web   # http://localhost:3000
npm run dev:api   # http://localhost:3001
```

**3단계: 코드 탐색**
- 프론트엔드: `apps/web/src/` 폴더부터 시작
- 백엔드: `apps/api/src/` 폴더부터 시작
- 공통 타입: `packages/shared/src/` 폴더 확인

---

## 🎯 설계 원칙

### 1. 모노레포 구조

**왜 모노레포를 선택했나요?**

| 장점 | 설명 |
|------|------|
| **타입 일관성** | 프론트엔드와 백엔드가 같은 타입을 공유 (`packages/shared`) |
| **개발 효율성** | 한 번의 `npm install`로 모든 패키지 설치 |
| **실무 표준** | 대규모 프로젝트에서 널리 사용되는 구조 |

**구현 방법:**
- npm workspaces 사용
- `packages/shared`에서 타입 정의
- 프론트/백엔드에서 `@bridge-bim-platform/shared` import

### 2. DDD-lite 접근

완전한 DDD는 과하지만, 도메인 중심 사고를 유지합니다:

| 레이어 | 역할 | 예시 |
|--------|------|------|
| **entities/** | 핵심 도메인 모델 | 교량 엔티티 |
| **features/** | 비즈니스 기능 단위 | 교량 조회, BIM 뷰어 |
| **pages/** | 라우팅 단위 | 대시보드, 교량 목록 |

**왜 이렇게 나누나요?**

- **entities/bridge**: 교량이라는 핵심 도메인. 상태, 부재 정보 등 핵심 개념
- **features/bridge**: "교량 목록 조회", "교량 상태 분석" 같은 행위
- **pages/**: 실제 라우팅 단위. 사용자가 보는 화면

### 3. Feature-Sliced Design

각 기능은 독립적인 모듈로 구성됩니다:

```
features/
├── bridge/              # 교량 관련 기능
│   ├── api.ts          # API 호출 함수
│   ├── bridgeSlice.ts  # Redux Slice
│   ├── hooks.ts        # React Hooks
│   └── components/      # 컴포넌트
└── bim-viewer/          # BIM 뷰어 기능
    ├── api.ts
    ├── bimSlice.ts
    ├── hooks.ts
    └── components/
```

**장점:**
- 각 feature는 독립적인 API, Slice, Hooks, Components 포함
- 새로운 기능 추가 시 기존 코드에 영향 없음
- 코드 탐색이 쉬움

### 4. 레이어 분리 (Backend)

백엔드는 명확한 레이어로 분리됩니다:

| 레이어 | 역할 | 예시 |
|--------|------|------|
| **Controller** | HTTP 레이어 | 요청 파싱, 응답 포맷팅 |
| **Service** | 비즈니스 로직 | 도메인 규칙 적용 |
| **Repository** | 데이터 접근 | DB 또는 Mock 데이터 |

**확장 시나리오:**
- DB 추가 → `repository.ts`만 수정
- 새로운 비즈니스 로직 → `service.ts`에 추가
- 구조 변경 최소화

### 5. 단일 책임 원칙

- 각 파일은 하나의 책임만 수행
- 의존성 역전: 상위 레이어가 하위 레이어에 의존
- 확장에 열려있고, 수정에 닫혀있음

---

## 🏗️ 프로젝트 구조

### 전체 구조

```
bridge-bim-platform/
├── apps/                          # 애플리케이션 레벨
│   ├── web/                       # 프론트엔드 (React + Vite + TypeScript)
│   └── api/                       # 백엔드 (Express + TypeScript)
│
├── packages/                      # 공유 패키지
│   └── shared/                    # 공통 타입 및 상수
│
├── docs/                          # 프로젝트 문서
│   ├── 01-architecture/          # 아키텍처 문서
│   ├── 02-api/                    # API 명세
│   ├── 03-domain/                 # 도메인 문서
│   ├── 04-development/            # 개발 가이드
│   └── 05-status/                 # 프로젝트 현황
│
├── package.json                   # 루트 워크스페이스 설정
└── README.md                      # 프로젝트 개요
```

---

## 🎨 Frontend 구조 (`apps/web`)

### 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.2.0 | UI 프레임워크 |
| TypeScript | 5.3.3 | 타입 안정성 |
| Vite | 5.0.8 | 빌드 도구 |
| React Router DOM | 6.21.0 | 라우팅 |
| Redux Toolkit | 2.11.2 | 상태 관리 |
| Three.js | 0.182.0 | 3D 렌더링 |
| Tailwind CSS | - | 스타일링 |
| CSS Modules | - | 컴포넌트 스타일 |

### 디렉토리 구조

```
apps/web/src/
├── app/                    # 앱 초기 설정
│   ├── layout.tsx          # 공통 레이아웃 (네비게이션 포함)
│   ├── router.tsx           # 라우트 정의
│   ├── providers.tsx       # Redux Provider, Router Provider
│   ├── store.ts            # Redux Store 설정
│   └── hooks.ts            # 전역 Hooks
│
├── pages/                  # 페이지 컴포넌트 (라우트 단위)
│   ├── dashboard/          # 대시보드 페이지
│   ├── bridge-list/        # 교량 목록 페이지
│   └── bridge-detail/      # 교량 상세 페이지 (BIM 뷰어 포함)
│
├── features/               # 기능 모듈 (Feature-Sliced Design)
│   ├── bridge/             # 교량 관련 기능
│   │   ├── api.ts          # API 호출 함수
│   │   ├── bridgeSlice.ts # Redux Slice
│   │   ├── hooks.ts        # React Hooks
│   │   └── components/     # 컴포넌트
│   │       └── bridge-card.tsx
│   │
│   └── bim-viewer/         # BIM 뷰어 기능
│       ├── api.ts          # BIM API 호출
│       ├── bimSlice.ts     # Redux Slice
│       ├── hooks.ts        # BIM 관련 Hooks
│       └── components/
│           ├── bim-viewer.tsx
│           ├── bim-filter.tsx
│           ├── bim-properties.tsx
│           └── three-viewer/      # Three.js 3D 뷰어
│               ├── index.tsx
│               ├── engine/        # Three.js 엔진
│               │   ├── ThreeEngine.ts
│               │   └── managers/  # Manager들
│               ├── hooks/         # React ↔ Engine 브리지
│               └── utils/         # 유틸리티
│
├── entities/               # 도메인 엔티티 (DDD)
│   └── bridge/             # 교량 엔티티
│
└── shared/                 # 공통 리소스
    ├── ui/                 # 공통 UI 컴포넌트
    ├── styles/             # CSS Modules 및 전역 스타일
    ├── redux/              # Redux 헬퍼
    ├── constants/          # 상수
    └── lib/                # 유틸리티 함수
```

### 주요 컴포넌트 흐름

**사용자가 교량 상세 페이지를 방문하면:**

1. **라우팅**: `app/router.tsx` → `pages/bridge-detail/`
2. **페이지**: `bridge-detail/index.tsx` → `features/bim-viewer/`
3. **BIM 뷰어**: `bim-viewer.tsx` → `three-viewer/index.tsx`
4. **3D 뷰어**: `ThreeViewer` → `useThreeEngine` Hook → `ThreeEngine`

---

## 🔧 Backend 구조 (`apps/api`)

### 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| Express | 4.18.2 | 웹 프레임워크 |
| TypeScript | 5.3.3 | 타입 안정성 |
| tsx | 4.7.0 | TypeScript 실행 및 watch 모드 |
| cors | 2.8.5 | CORS 미들웨어 |

### 디렉토리 구조

```
apps/api/src/
├── app.ts                 # Express 앱 설정
├── server.ts              # 서버 시작점
│
├── modules/               # 기능 모듈
│   ├── bridge/            # 교량 모듈
│   │   ├── bridge.route.ts      # 라우트 정의
│   │   ├── bridge.controller.ts # HTTP 요청/응답 처리
│   │   ├── bridge.service.ts    # 비즈니스 로직
│   │   ├── bridge.repository.ts # 데이터 접근 (Mock)
│   │   └── index.ts
│   │
│   └── bim/               # BIM 모듈
│       ├── bim.route.ts
│       ├── bim.controller.ts
│       ├── bim.service.ts
│       ├── bim.repository.ts
│       └── index.ts
│
├── common/                # 공통 미들웨어
│   └── error/
│       └── error-handler.ts  # 전역 에러 핸들러
│
└── config/                # 환경 설정
    └── env.ts
```

### API 엔드포인트

**교량 API** (`/api/bridges`)
- `GET /api/bridges` - 교량 목록 조회
- `GET /api/bridges/:id` - 교량 상세 조회

**BIM API** (`/api/bim`)
- `GET /api/bim/bridges/:bridgeId/bim` - 교량의 BIM 모델 조회
- `GET /api/bim/models/:modelId` - BIM 모델 상세 조회
- `GET /api/bim/models/:modelId/components` - 부재 목록 (필터 지원)
- `GET /api/bim/models/:modelId/components/:componentId` - 부재 상세
- `GET /api/bim/models/:modelId/components/:componentId/geometry` - 형상 데이터
- `GET /api/bim/models/:modelId/relationships` - 관계 정보

---

## 📦 Shared 패키지 (`packages/shared`)

### 목적

프론트엔드와 백엔드 간 타입 공유로 타입 불일치를 방지합니다.

### 구조

```
packages/shared/src/
├── types/                 # 타입 정의
│   ├── bridge.ts         # Bridge 타입
│   ├── bim.ts            # BIM 타입
│   └── index.ts
│
├── enums/                 # 열거형
│   ├── bridge-status.ts  # 교량 상태
│   ├── bim-component-type.ts  # BIM 부재 타입
│   └── index.ts
│
└── index.ts               # 메인 export
```

### 사용 방법

**프론트엔드에서:**
```tsx
import type { Bridge, BIMModel } from '@bridge-bim-platform/shared'
```

**백엔드에서:**
```ts
import type { Bridge, BIMModel } from '@bridge-bim-platform/shared'
```

**장점:**
- ✅ 타입 불일치 방지
- ✅ 한 곳에서 수정하면 전체 반영
- ✅ 실무에서 매우 중요한 패턴

---

## 🎯 ThreeEngine 아키텍처 (핵심)

### 설계 철학

**"React는 언제를 결정하고, Engine은 어떻게를 수행한다"**

- **React 레이어**: UI 상태 관리, 사용자 인터랙션 처리
- **Engine 레이어**: Three.js 객체 생명주기, 렌더링 로직
- **완전한 분리**: React 생명주기와 Three.js 생명주기 독립적 관리

### 구조 개요

```
three-viewer/
├── index.tsx              # 얇은 React 컴포넌트
│   └── useThreeEngine()   # Engine 인스턴스 관리
│
├── engine/
│   ├── ThreeEngine.ts     # Facade (단일 진입점)
│   └── managers/          # 단일 책임 Manager들
│       ├── SceneManager        # Scene 생성/관리
│       ├── CameraManager       # Camera 생성/리사이즈/포커스
│       ├── RendererManager     # Renderer 생성/리사이즈
│       ├── ControlsManager     # OrbitControls 관리
│       └── AnimationManager   # 애니메이션 루프
│
└── hooks/
    └── use-three-engine.ts  # React ↔ Engine 브리지
```

### Manager 책임 분리

| Manager | 책임 | 상태 |
|---------|------|------|
| `SceneManager` | Scene 생성, 조명/헬퍼 추가 | ✅ 완료 |
| `CameraManager` | Camera 생성, 리사이즈, 포커스 | ✅ 완료 |
| `RendererManager` | Renderer 생성, 리사이즈, DOM 연결 | ✅ 완료 |
| `ControlsManager` | OrbitControls 생성 및 업데이트 | ✅ 완료 |
| `AnimationManager` | requestAnimationFrame 루프 관리 | ✅ 완료 |
| `ModelManager` | 모델 로딩, 메시 관리, 하이라이트 | ⏳ 예정 |
| `ResizeManager` | 리사이즈 이벤트 처리 | ⏳ 예정 |
| `InteractionManager` | 클릭/호버 등 인터랙션 처리 | ⏳ 예정 |

### 주요 장점

1. **단일 책임 원칙 (SRP)**: 각 Manager가 하나의 책임만 수행
2. **테스트 용이성**: Manager를 독립적으로 테스트 가능
3. **확장성**: 새로운 기능 추가 시 Manager만 추가하면 됨
4. **StrictMode 안전**: initialized 플래그로 중복 초기화 방지
5. **생명주기 명확성**: React와 Three.js 생명주기 완전 분리

---

## 🔄 데이터 흐름

### 교량 데이터 흐름

```
사용자 요청
  ↓
pages/bridge-detail
  ↓
features/bridge/hooks.ts (useBridge)
  ↓
features/bridge/api.ts
  ↓
GET /api/bridges/:id
  ↓
bridge.controller → bridge.service → bridge.repository
  ↓
JSON 응답
  ↓
Redux Store (bridgeSlice)
  ↓
컴포넌트 렌더링
```

### BIM 데이터 흐름

```
사용자 요청
  ↓
pages/bridge-detail
  ↓
features/bim-viewer/components/bim-viewer.tsx
  ↓
features/bim-viewer/hooks.ts (useBIMModel)
  ↓
features/bim-viewer/api.ts
  ↓
GET /api/bim/bridges/:bridgeId/bim
  ↓
bim.controller → bim.service → bim.repository
  ↓
BIMModel JSON 응답
  ↓
Redux Store (bimSlice)
  ↓
ThreeViewer 컴포넌트
  ↓
useThreeEngine → ThreeEngine.init()
  ↓
useModelLoader
  ↓
Three.js Scene에 메시 추가
  ↓
AnimationManager (애니메이션 루프)
  ↓
3D 렌더링
```

### 3D 뷰어 렌더링 흐름

```
ThreeViewer 컴포넌트 (React)
  ↓
useThreeEngine Hook
  ↓
ThreeEngine (Facade)
  ├── SceneManager.init()      → Scene 생성
  ├── CameraManager.init()      → Camera 생성
  ├── RendererManager.init()   → Renderer 생성
  ├── ControlsManager.init()    → OrbitControls 생성
  └── AnimationManager.start()  → 애니메이션 루프 시작
  ↓
useModelLoader
  ↓
useHighlight
  ↓
useCameraFocus
  ↓
3D 렌더링 완료
```

**핵심 설계 원칙:**
- **React**: "언제" (init / load / focus) 결정
- **ThreeEngine**: "어떻게" (render / resize / animate) 수행
- **Manager**: 단일 책임 원칙 (SRP) 적용

---

## 🚀 확장 가이드

### 새로운 기능 추가하기

**예시: "교량 점검 기록" 기능 추가**

**1단계: Feature 생성**
```
features/
  └─ inspection/
      ├─ api.ts              # API 호출 함수
      ├─ hooks.ts            # React Hooks
      ├─ components/         # 컴포넌트
      └─ index.ts            # Export
```

**2단계: Backend 모듈 생성**
```
modules/
  └─ inspection/
      ├─ inspection.route.ts
      ├─ inspection.controller.ts
      ├─ inspection.service.ts
      └─ inspection.repository.ts
```

**3단계: 타입 정의 (Shared 패키지)**
```
packages/shared/src/types/
  └─ inspection.ts
```

### 3D BIM 뷰어 연동 (✅ 구현 완료)

현재 Three.js를 사용하여 3D 렌더링을 구현했습니다:

```
features/
  └─ bim-viewer/
      ├─ components/
      │  ├─ bim-viewer.tsx        # 메인 BIM 뷰어 컴포넌트
      │  ├─ three-viewer.tsx      # Three.js 3D 렌더링
      │  ├─ bim-filter.tsx        # 필터 컴포넌트
      │  └─ bim-properties.tsx    # 속성 표시 컴포넌트
      ├─ api.ts                   # BIM API 호출
      └─ hooks.ts                 # BIM 데이터 Hooks
```

### DB 연동하기

현재는 Mock 데이터를 사용하지만, DB 연동 시:

```
modules/bridge/
  └─ bridge.repository.ts  # Mock → Prisma/TypeORM
```

**변경 사항:**
- `bridge.repository.ts`만 수정
- Service와 Controller는 변경 없음

---

## 🎨 스타일링 전략

- **Tailwind CSS**: 유틸리티 퍼스트 CSS
- **CSS Modules**: 컴포넌트별 스타일 격리
- **전역 스타일**: `shared/styles/global.css`
- **CSS 변수**: `shared/styles/variables.css`

---

## 🛠️ 개발 스크립트

### 루트 레벨

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 프론트엔드 + 백엔드 동시 실행 |
| `npm run dev:web` | 프론트엔드만 실행 (http://localhost:3000) |
| `npm run dev:api` | 백엔드만 실행 (http://localhost:3001) |
| `npm run build` | 모든 워크스페이스 빌드 |
| `npm run typecheck` | 모든 워크스페이스 타입 체크 |

---

## 📝 주요 파일 설명

### Frontend 핵심 파일

| 파일 | 설명 |
|------|------|
| `apps/web/src/main.tsx` | 앱 진입점 |
| `apps/web/src/app/router.tsx` | 라우트 정의 |
| `apps/web/src/app/store.ts` | Redux Store |
| `apps/web/src/features/bim-viewer/components/three-viewer/index.tsx` | 3D 뷰어 메인 컴포넌트 |
| `apps/web/src/features/bim-viewer/components/three-viewer/engine/ThreeEngine.ts` | Three.js 엔진 Facade |
| `apps/web/src/features/bim-viewer/components/three-viewer/engine/managers/` | Manager들 |

### Backend 핵심 파일

| 파일 | 설명 |
|------|------|
| `apps/api/src/server.ts` | 서버 시작점 |
| `apps/api/src/app.ts` | Express 앱 설정 |
| `apps/api/src/modules/bim/bim.repository.ts` | BIM Mock 데이터 |

### Shared 핵심 파일

| 파일 | 설명 |
|------|------|
| `packages/shared/src/types/bim.ts` | BIM 타입 정의 |
| `packages/shared/src/types/bridge.ts` | Bridge 타입 정의 |

---

## 💡 자주 묻는 질문

### Q: 새로운 기능을 추가하려면 어디서 시작하나요?

**A:** Feature-Sliced Design 원칙에 따라 `features/` 폴더에 새 기능을 추가하세요.

1. `features/새기능/` 폴더 생성
2. `api.ts`, `hooks.ts`, `components/` 구조 생성
3. 필요시 `pages/`에 페이지 추가

### Q: 타입을 수정하려면 어디서 하나요?

**A:** `packages/shared/src/types/` 폴더에서 타입을 정의하세요. 프론트엔드와 백엔드가 자동으로 공유됩니다.

### Q: 3D 뷰어에 새로운 기능을 추가하려면?

**A:** `features/bim-viewer/components/three-viewer/` 폴더를 확인하세요. ThreeEngine 구조를 이해한 후 Manager를 추가하거나 수정하세요.

### Q: Mock 데이터를 실제 DB로 교체하려면?

**A:** `apps/api/src/modules/*/repository.ts` 파일만 수정하면 됩니다. Service와 Controller는 변경할 필요가 없습니다.

---

이 구조는 확장 가능하고 유지보수하기 쉬운 웹 CAD/BIM 뷰어 플랫폼을 위한 견고한 기반을 제공합니다.

**마지막 업데이트**: 2024년

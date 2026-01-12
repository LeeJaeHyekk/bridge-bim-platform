# Bridge BIM Platform - 프로젝트 구조 요약

## 📦 프로젝트 개요

**프로젝트명**: Bridge BIM Platform  
**타입**: 모노레포 (npm workspaces)  
**목적**: 교량 BIM 데이터를 웹에서 시각화하고 관리하는 플랫폼  
**아키텍처**: DDD-lite + Feature-Sliced Design

---

## 🏗️ 전체 구조

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
│   ├── architecture.md            # 아키텍처 설계
│   ├── api-spec.md                # API 명세
│   ├── bim-architecture.md        # BIM 아키텍처
│   ├── 3d-viewer-specification.md # 3D 뷰어 사양
│   └── ...                        # 기타 문서
│
├── package.json                   # 루트 워크스페이스 설정
└── README.md                      # 프로젝트 개요
```

---

## 🎨 Frontend 구조 (apps/web)

### 기술 스택
- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **라우팅**: React Router DOM v6
- **상태 관리**: Redux Toolkit
- **3D 렌더링**: Three.js
- **스타일링**: Tailwind CSS + CSS Modules

### 디렉토리 구조

```
apps/web/src/
├── app/                           # 앱 초기 설정
│   ├── layout.tsx                 # 공통 레이아웃 (네비게이션 포함)
│   ├── router.tsx                 # 라우트 정의
│   ├── providers.tsx              # Redux Provider, Router Provider
│   ├── store.ts                   # Redux Store 설정
│   └── hooks.ts                   # 전역 Hooks
│
├── pages/                         # 페이지 컴포넌트 (라우트 단위)
│   ├── dashboard/                 # 대시보드 페이지
│   │   ├── index.tsx
│   │   └── dashboard.module.css
│   ├── bridge-list/               # 교량 목록 페이지
│   │   └── index.tsx
│   └── bridge-detail/             # 교량 상세 페이지 (BIM 뷰어 포함)
│       └── index.tsx
│
├── features/                      # 기능 모듈 (Feature-Sliced Design)
│   ├── bridge/                    # 교량 관련 기능
│   │   ├── api.ts                 # API 호출 함수
│   │   ├── bridgeSlice.ts        # Redux Slice
│   │   ├── hooks.ts               # React Hooks (useBridges 등)
│   │   └── components/
│   │       └── bridge-card.tsx   # 교량 카드 컴포넌트
│   │
│   └── bim-viewer/                # BIM 뷰어 기능
│       ├── api.ts                 # BIM API 호출
│       ├── bimSlice.ts            # Redux Slice (BIM 상태)
│       ├── hooks.ts               # BIM 관련 Hooks
│       └── components/
│           ├── bim-viewer.tsx     # 메인 BIM 뷰어 (3D + 부재 목록)
│           ├── bim-filter.tsx     # 필터 UI
│           ├── bim-properties.tsx # 속성 표시
│           └── three-viewer/      # Three.js 3D 뷰어
│               ├── index.tsx      # ThreeViewer 컴포넌트 (얇은 React 레이어)
│               ├── types.ts       # 타입 정의
│               │
│               ├── engine/        # 🔥 Three.js 엔진 (핵심)
│               │   ├── ThreeEngine.ts    # Facade (단일 진입점)
│               │   ├── types.ts          # 엔진 타입
│               │   └── managers/         # 단일 책임 Manager들
│               │       ├── SceneManager.ts      # Scene 생명주기
│               │       ├── CameraManager.ts      # Camera 생명주기
│               │       ├── RendererManager.ts   # Renderer 생명주기
│               │       ├── ControlsManager.ts   # OrbitControls 관리
│               │       └── AnimationManager.ts   # 애니메이션 루프
│               │
│               ├── hooks/         # React ↔ Engine 브리지
│               │   ├── use-three-engine.ts  # 🔥 Engine 인스턴스 관리
│               │   ├── use-model-loader.ts  # ⏳ 점진적 제거 예정
│               │   ├── use-highlight.ts     # ⏳ 점진적 제거 예정
│               │   └── use-camera-focus.ts  # ⏳ 점진적 제거 예정
│               │
│               ├── handlers/      # 이벤트 핸들러 (향후 InteractionManager로 이동)
│               │   ├── click-handler.ts    # 클릭 이벤트
│               │   └── resize-handler.ts   # 리사이즈 이벤트
│               │
│               └── utils/         # 유틸리티
│                   ├── bounding-box.ts    # 바운딩 박스 계산
│                   ├── camera-focus.ts     # 카메라 포커스 로직
│                   ├── geometry.ts        # 형상 생성
│                   └── debug.ts           # 디버그 로그
│
├── entities/                      # 도메인 엔티티 (DDD)
│   └── bridge/                    # 교량 엔티티
│       ├── model.ts               # 교량 모델
│       ├── types.ts               # 교량 타입
│       └── index.ts
│
└── shared/                        # 공통 리소스
    ├── ui/                        # 공통 UI 컴포넌트
    │   ├── navigation.tsx         # 네비게이션 바
    │   ├── loading.tsx            # 로딩 컴포넌트
    │   ├── error.tsx              # 에러 컴포넌트
    │   └── index.tsx
    ├── styles/                    # CSS Modules 및 전역 스타일
    │   ├── global.css             # 전역 스타일
    │   ├── variables.css          # CSS 변수
    │   ├── navigation.module.css
    │   ├── bridge-card.module.css
    │   ├── bim-viewer.module.css
    │   └── ...
    ├── redux/                     # Redux 헬퍼
    │   ├── types.ts               # Redux 타입
    │   ├── reducerHelpers.ts     # Reducer 헬퍼
    │   ├── selectorHelpers.ts    # Selector 헬퍼
    │   └── thunkHelpers.ts       # Thunk 헬퍼
    ├── constants/                 # 상수
    └── lib/                       # 유틸리티 함수
```

### 주요 컴포넌트 흐름

1. **라우팅**: `app/router.tsx` → 페이지 컴포넌트
2. **페이지**: `pages/bridge-detail/` → `features/bim-viewer/`
3. **BIM 뷰어**: `bim-viewer.tsx` → `three-viewer/index.tsx`
4. **3D 뷰어**: `ThreeViewer` → 커스텀 Hooks (useThreeScene, useModelLoader, useHighlight, useCameraFocus)

---

## 🔧 Backend 구조 (apps/api)

### 기술 스택
- **프레임워크**: Express + TypeScript
- **개발 도구**: tsx (watch mode)
- **CORS**: cors 미들웨어

### 디렉토리 구조

```
apps/api/src/
├── app.ts                         # Express 앱 설정
├── server.ts                      # 서버 시작점
│
├── modules/                       # 기능 모듈
│   ├── bridge/                    # 교량 모듈
│   │   ├── bridge.route.ts       # 라우트 정의 (/api/bridges)
│   │   ├── bridge.controller.ts  # HTTP 요청/응답 처리
│   │   ├── bridge.service.ts     # 비즈니스 로직
│   │   ├── bridge.repository.ts  # 데이터 접근 (Mock)
│   │   └── index.ts
│   │
│   └── bim/                       # BIM 모듈
│       ├── bim.route.ts          # 라우트 정의 (/api/bim)
│       ├── bim.controller.ts     # HTTP 요청/응답 처리
│       ├── bim.service.ts         # 비즈니스 로직
│       ├── bim.repository.ts     # 데이터 접근 (Mock)
│       └── index.ts
│
├── common/                         # 공통 미들웨어
│   └── error/
│       └── error-handler.ts      # 전역 에러 핸들러
│
└── config/                        # 환경 설정
    └── env.ts                     # 환경 변수
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

## 📦 Shared 패키지 (packages/shared)

### 목적
프론트엔드와 백엔드 간 타입 공유

### 구조

```
packages/shared/src/
├── types/                         # 타입 정의
│   ├── bridge.ts                 # Bridge 타입
│   ├── bim.ts                    # BIM 타입 (BIMModel, BIMComponent 등)
│   └── index.ts
│
├── enums/                         # 열거형
│   ├── bridge-status.ts          # 교량 상태 (SAFE, WARNING, DANGER)
│   ├── bim-component-type.ts     # BIM 부재 타입 (Pylon, Deck, Cable 등)
│   └── index.ts
│
└── index.ts                       # 메인 export
```

### 주요 타입

**Bridge 타입**
- `Bridge`: 교량 정보
- `BridgeStatus`: 교량 상태 열거형

**BIM 타입**
- `BIMModel`: 전체 BIM 모델
- `BIMComponent`: 부재 정보 (타입, 속성, 상태)
- `BIMGeometry`: 형상 데이터
- `BIMRelationship`: 부재 간 관계
- `BIMComponentType`: 부재 타입 열거형

---

## 🎯 핵심 아키텍처 원칙

### 1. 모노레포 구조
- **장점**: 타입 일관성, 개발 효율성
- **구현**: npm workspaces 사용

### 2. DDD-lite 접근
- **entities/**: 핵심 도메인 모델 (교량)
- **features/**: 비즈니스 기능 단위
- **pages/**: 라우팅 단위

### 3. Feature-Sliced Design
- **features/bridge**: 교량 관련 기능
- **features/bim-viewer**: BIM 뷰어 기능
- 각 feature는 독립적인 API, Slice, Hooks, Components 포함

### 4. 레이어 분리 (Backend)
- **Controller**: HTTP 레이어
- **Service**: 비즈니스 로직
- **Repository**: 데이터 접근 (현재 Mock, 향후 DB)

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
├── index.tsx                    # 얇은 React 컴포넌트
│   └── useThreeEngine()         # Engine 인스턴스 관리
│
├── engine/
│   ├── ThreeEngine.ts          # Facade (단일 진입점)
│   └── managers/               # 단일 책임 Manager들
│       ├── SceneManager        # Scene 생성/관리
│       ├── CameraManager       # Camera 생성/리사이즈/포커스
│       ├── RendererManager     # Renderer 생성/리사이즈
│       ├── ControlsManager     # OrbitControls 관리
│       └── AnimationManager   # 애니메이션 루프
│
└── hooks/
    └── use-three-engine.ts     # React ↔ Engine 브리지
```

### Manager 책임 분리

| Manager | 책임 | 상태 |
|---------|------|------|
| `SceneManager` | Scene 생성, 조명/헬퍼 추가 | ✅ 완료 |
| `CameraManager` | Camera 생성, 리사이즈, 포커스 | ✅ 완료 (포커스는 향후 추가) |
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

### 1. 교량 데이터 흐름
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

### 2. BIM 데이터 흐름
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
useModelLoader (임시 - ModelManager로 이동 예정)
  ↓
Three.js Scene에 메시 추가
  ↓
AnimationManager (애니메이션 루프)
  ↓
3D 렌더링
```

### 3. 3D 뷰어 렌더링 흐름 (새로운 구조)
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
useModelLoader (임시 - ModelManager로 이동 예정)
  ↓
useHighlight (임시 - ModelManager로 이동 예정)
  ↓
useCameraFocus (임시 - CameraManager로 이동 예정)
  ↓
3D 렌더링 완료
```

**핵심 설계 원칙:**
- **React**: "언제" (init / load / focus) 결정
- **ThreeEngine**: "어떻게" (render / resize / animate) 수행
- **Manager**: 단일 책임 원칙 (SRP) 적용

---

## 🛠️ 개발 스크립트

### 루트 레벨
- `npm run dev` - 프론트엔드 + 백엔드 동시 실행
- `npm run dev:web` - 프론트엔드만 실행 (http://localhost:3000)
- `npm run dev:api` - 백엔드만 실행 (http://localhost:3001)
- `npm run build` - 모든 워크스페이스 빌드
- `npm run typecheck` - 모든 워크스페이스 타입 체크

---

## 📊 현재 구현 상태

### ✅ 완료된 기능
- 교량 목록 조회 및 상세 보기
- 대시보드 (통계, 최근 교량 목록)
- BIM 뷰어 기본 구조 (Three.js 통합)
- 3D 모델 렌더링 (18개 부재: 주탑, 상판, 교각 6개, 케이블 10개)
- 부재 선택 및 하이라이트
- 카메라 자동 포커스 (전체 모델 / 개별 부재)
- 반응형 디자인
- 로딩/에러 상태 처리
- 네비게이션 바

### 🔄 최근 개선 사항

#### 아키텍처 리팩토링 (2024)
- **ThreeEngine + Manager 구조 도입**
  - Hook 중심 구조 → Engine + Manager 구조로 전환
  - `ThreeEngine` Facade 패턴으로 단일 진입점 제공
  - 각 Manager가 단일 책임 원칙 (SRP) 준수
  - React와 Three.js 생명주기 완전 분리
- **useThreeEngine Hook 추가**
  - React ↔ Engine 브리지 역할
  - 엔진 인스턴스 생명주기 관리

#### 이전 개선 사항
- React Hooks 규칙 준수 (조건부 hooks 호출 제거)
- containerSize 기반 렌더링 (props width/height 제거)
- meshesReady 파생 상태로 변경 (polling 제거)
- selectedComponentId 정규화 (null/undefined 명확히 분리)
- 상세한 디버그 로그 추가 (기능별 태그)

### 🚧 향후 구현 예정

#### ThreeEngine 구조 완성
- `ModelManager` 생성 (useModelLoader 대체)
- `ResizeManager` 생성 (resize-handler 대체)
- `InteractionManager` 생성 (click-handler 대체)
- 기존 hooks 제거 (useModelLoader, useHighlight, useCameraFocus)

#### 기능 확장
- BIM 파일 업로드 및 변환 (IFC → glTF)
- 필터 및 검색 기능
- 교량 CRUD 기능
- 데이터베이스 연동 (현재 Mock 데이터)

---

## 📚 문서 구조

### 핵심 문서
- `docs/architecture.md` - 프로젝트 구조 및 설계 원칙
- `docs/api-spec.md` - 백엔드 API 엔드포인트
- `docs/bim-architecture.md` - BIM 데이터 구조 및 처리 방식
- `docs/3d-viewer-specification.md` - 3D 뷰어 구현 사양

### 개발 가이드
- `docs/frontend-guide.md` - 프론트엔드 개발 방법론
- `docs/component-structure.md` - 컴포넌트 계층 및 역할
- `docs/redux-optimization.md` - Redux 최적화 가이드

### 도메인 문서
- `docs/domain-bridge.md` - 교량 도메인 개념
- `docs/bim-concept.md` - BIM 기본 개념
- `docs/bim-structure-summary.md` - BIM 구조 요약
- `docs/project-status.md` - 구현 현황 및 향후 계획

---

## 🔑 주요 설계 결정

### 1. 모노레포 선택 이유
- 타입 일관성 보장 (shared 패키지)
- 개발 효율성 향상
- 실무에서 널리 사용되는 구조

### 2. DDD-lite 접근
- 완전한 DDD는 과하지만 도메인 중심 사고 유지
- entities/로 핵심 도메인 모델 분리
- features/로 비즈니스 기능 단위 구성

### 3. Three.js 통합 방식 (ThreeEngine 구조)
- **엔진 분리**: React와 Three.js 생명주기 완전 분리
- **Facade 패턴**: `ThreeEngine`이 유일한 진입점
- **Manager 패턴**: 각 Manager가 단일 책임 (SRP)
  - `SceneManager`: Scene 생명주기
  - `CameraManager`: Camera 생명주기 및 포커스
  - `RendererManager`: Renderer 생명주기
  - `ControlsManager`: OrbitControls 관리
  - `AnimationManager`: 애니메이션 루프
- **React 역할**: "언제" 결정 (init / load / focus)
- **Engine 역할**: "어떻게" 수행 (render / resize / animate)
- **StrictMode 안전**: initialized 플래그로 중복 초기화 방지

### 4. 상태 관리 전략
- **Redux Toolkit**: Feature-based slices (전역 상태)
- **React 상태**: UI 전용 (containerSize 등)
- **Three.js 상태**: Engine 내부에서 관리 (Manager 패턴)
- **파생 상태**: useMemo로 계산 (meshesReady 등)
- **Ref 기반**: Three 객체는 Engine 내부에서 직접 관리

---

## 🎨 스타일링 전략

- **Tailwind CSS**: 유틸리티 퍼스트 CSS
- **CSS Modules**: 컴포넌트별 스타일 격리
- **전역 스타일**: `shared/styles/global.css`
- **CSS 변수**: `shared/styles/variables.css`

---

## 🔍 현재 프로젝트 상태

### 기술적 성숙도
- ✅ 기본 아키텍처 구축 완료
- ✅ 타입 안정성 확보
- ✅ 3D 렌더링 기본 기능 구현
- ✅ ThreeEngine + Manager 구조 도입 (React ↔ Three.js 생명주기 분리)
- 🔄 ModelManager, ResizeManager, InteractionManager 추가 예정
- ⏳ 데이터베이스 연동 예정

### 코드 품질
- TypeScript strict mode 활성화
- ESLint + Prettier 설정
- 상세한 디버그 로그 시스템
- React Hooks 규칙 준수

---

## 📝 주요 파일 설명

### Frontend 핵심 파일
- `apps/web/src/main.tsx` - 앱 진입점
- `apps/web/src/app/router.tsx` - 라우트 정의
- `apps/web/src/app/store.ts` - Redux Store
- `apps/web/src/features/bim-viewer/components/three-viewer/index.tsx` - 3D 뷰어 메인 컴포넌트
- `apps/web/src/features/bim-viewer/components/three-viewer/engine/ThreeEngine.ts` - Three.js 엔진 Facade
- `apps/web/src/features/bim-viewer/components/three-viewer/engine/managers/` - Manager들 (Scene, Camera, Renderer, Controls, Animation)
- `apps/web/src/features/bim-viewer/components/three-viewer/hooks/use-three-engine.ts` - React ↔ Engine 브리지

### Backend 핵심 파일
- `apps/api/src/server.ts` - 서버 시작점
- `apps/api/src/app.ts` - Express 앱 설정
- `apps/api/src/modules/bim/bim.repository.ts` - BIM Mock 데이터

### Shared 핵심 파일
- `packages/shared/src/types/bim.ts` - BIM 타입 정의
- `packages/shared/src/types/bridge.ts` - Bridge 타입 정의

---

이 구조는 확장 가능하고 유지보수하기 쉬운 웹 CAD/BIM 뷰어 플랫폼을 위한 견고한 기반을 제공합니다.

# 아키텍처 설계

## 📐 프로젝트 구조 선택 이유

이 프로젝트는 **DDD-lite + 모노레포** 관점으로 설계되었습니다.

### 왜 모노레포인가?

1. **타입 일관성**: 프론트엔드와 백엔드가 같은 타입을 공유 (`packages/shared`)
2. **개발 효율성**: 한 번의 `npm install`로 모든 패키지 설치
3. **실무 경험**: 대규모 프로젝트에서 흔히 사용되는 구조

### 왜 DDD-lite인가?

완전한 DDD는 과하지만, 도메인 중심 사고를 보여주기 위해:

- **entities/**: 핵심 도메인 모델 (교량)
- **features/**: 비즈니스 기능 단위 (교량 조회, BIM 뷰어)
- **pages/**: 라우팅 단위

## 🏗️ 레이어 구조

### Frontend (`apps/web`)

```
src/
├─ app/              # 앱 초기 설정 (라우터, 프로바이더)
├─ pages/            # 라우트 단위 페이지
├─ features/         # 기능 단위 (교량 조회, BIM 뷰어)
├─ entities/         # 핵심 도메인 모델
└─ shared/           # 공통 UI, 유틸
```

**왜 이렇게 나누는가?**

- **entities/bridge**: 교량이라는 핵심 도메인. 상태, 부재 정보 등 핵심 개념
- **features/bridge**: "교량 목록 조회", "교량 상태 분석" 같은 행위
- **pages/**: 실제 라우팅 단위. 사용자가 보는 화면

**확장 시나리오:**

- 새로운 기능 추가 → `features/`에 추가
- 새로운 도메인 추가 → `entities/`에 추가
- 구조가 깨지지 않음

### Backend (`apps/api`)

```
src/
├─ modules/
│  └─ bridge/
│     ├─ bridge.controller.ts    # HTTP 요청/응답
│     ├─ bridge.service.ts        # 비즈니스 로직
│     ├─ bridge.repository.ts     # 데이터 접근
│     └─ bridge.route.ts          # URL 정의
├─ common/                        # 공통 미들웨어, 에러 처리
└─ config/                        # 환경 설정
```

**역할 분리 이유:**

- **Controller**: HTTP 레이어. 요청 파싱, 응답 포맷팅
- **Service**: 비즈니스 로직. 도메인 규칙 적용
- **Repository**: 데이터 접근. DB 또는 Mock 데이터

**확장 시나리오:**

- DB 추가 → `repository.ts`만 수정
- 새로운 비즈니스 로직 → `service.ts`에 추가
- 구조 변경 최소화

## 🔄 데이터 흐름

```
Frontend (React)
  ↓ API 호출
Backend (Express)
  ↓ Service 호출
Repository
  ↓ 데이터 반환
Service
  ↓ Controller
Frontend
```

## 📦 Shared 패키지

`packages/shared`는 프론트엔드와 백엔드가 공유하는 타입을 정의합니다.

**장점:**
- 타입 불일치 방지
- 한 곳에서 수정하면 전체 반영
- 실무에서 매우 중요한 패턴

## 🚀 확장 가능성

### 1. 새로운 기능 추가

예: "교량 점검 기록" 기능 추가

```
features/
  └─ inspection/
      ├─ api.ts
      ├─ hooks.ts
      └─ components/
```

### 2. 3D BIM 뷰어 연동

```
features/
  └─ bim-viewer/
      ├─ viewer.tsx        # Three.js 또는 Forge Viewer
      └─ controls.tsx
```

### 3. DB 연동

```
modules/bridge/
  └─ bridge.repository.ts  # Mock → Prisma/TypeORM
```

## 🎯 설계 원칙

1. **단일 책임 원칙**: 각 파일은 하나의 책임만
2. **의존성 역전**: 상위 레이어가 하위 레이어에 의존
3. **확장에 열려있고, 수정에 닫혀있음**: 새로운 기능 추가 시 기존 코드 변경 최소화

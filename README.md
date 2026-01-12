# Bridge BIM Platform

교량 BIM + Web 플랫폼 토이 프로젝트

## 📁 프로젝트 구조

```
bridge-bim-platform/
├─ apps/
│  ├─ web/              # 프론트엔드 (Vite + React + TS)
│  │  └─ src/
│  │     ├─ app/        # 앱 설정 (라우터, 레이아웃)
│  │     ├─ pages/      # 페이지 컴포넌트
│  │     ├─ features/   # 기능 모듈 (bridge, bim-viewer)
│  │     ├─ entities/   # 도메인 엔티티
│  │     └─ shared/     # 공통 UI, 스타일, 유틸
│  └─ api/              # 백엔드 (Express)
│     └─ src/
│        ├─ modules/    # 기능 모듈 (bridge, bim)
│        ├─ common/     # 공통 미들웨어
│        └─ config/     # 환경 설정
│
├─ packages/
│  └─ shared/           # 공통 타입 / 상수 / 유틸
│
├─ docs/                # 문서 (설계/도메인/BIM 설명)
│
└─ package.json         # 루트 워크스페이스
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
# 프론트엔드만 (http://localhost:3000)
npm run dev:web

# 백엔드만 (http://localhost:3001)
npm run dev:api

# 동시 실행 (권장)
npm run dev
```

### 타입 체크

```bash
npm run typecheck
```

## 📚 문서

### 핵심 문서
- [아키텍처 설계](./docs/architecture.md) - 프로젝트 구조 및 설계 원칙
- [API 명세](./docs/api-spec.md) - 백엔드 API 엔드포인트
- [BIM 아키텍처](./docs/bim-architecture.md) - BIM 데이터 구조 및 처리 방식
- [프로젝트 현황](./docs/project-status.md) - 구현 현황 및 향후 계획

### 개발 가이드
- [프론트엔드 개발 가이드](./docs/frontend-guide.md) - 프론트엔드 개발 방법론
- [컴포넌트 구조](./docs/component-structure.md) - 컴포넌트 계층 및 역할

### 도메인 문서
- [교량 도메인 설명](./docs/domain-bridge.md) - 교량 도메인 개념
- [BIM 개념](./docs/bim-concept.md) - BIM 기본 개념

## 🏗️ 기술 스택

### Frontend
- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **라우팅**: React Router DOM
- **스타일링**: Tailwind CSS + CSS Modules
- **3D 렌더링**: Three.js
- **유틸리티**: clsx

### Backend
- **프레임워크**: Express + TypeScript
- **개발 도구**: tsx (watch mode)
- **CORS**: cors 미들웨어

### 공통
- **모노레포**: npm workspaces
- **타입 공유**: `@bridge-bim-platform/shared` 패키지

## ✨ 주요 기능

### 현재 구현된 기능
- ✅ 교량 목록 조회 및 상세 보기
- ✅ 대시보드 (통계, 최근 교량 목록)
- ✅ BIM 뷰어 기본 구조 (Three.js 통합)
- ✅ 반응형 디자인
- ✅ 로딩/에러 상태 처리
- ✅ 네비게이션 바

### 향후 구현 예정
- [ ] BIM 파일 업로드 및 변환 (IFC → glTF)
- [ ] 3D 모델 로딩 및 렌더링
- [ ] 부재 선택 및 하이라이트
- [ ] 필터 및 검색 기능
- [ ] 교량 CRUD 기능

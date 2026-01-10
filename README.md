# Bridge BIM Platform

교량 BIM + Web 플랫폼 토이 프로젝트

## 📁 프로젝트 구조

```
bridge-bim-platform/
├─ apps/
│  ├─ web/              # 프론트엔드 (Vite + React + TS)
│  └─ api/              # 백엔드 (Express)
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
# 프론트엔드만
npm run dev:web

# 백엔드만
npm run dev:api

# 동시 실행
npm run dev
```

## 📚 문서

- [아키텍처 설계](./docs/architecture.md)
- [교량 도메인 설명](./docs/domain-bridge.md)
- [BIM 개념](./docs/bim-concept.md)
- [API 명세](./docs/api-spec.md)

## 🏗️ 기술 스택

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Express + TypeScript
- **Monorepo**: npm workspaces

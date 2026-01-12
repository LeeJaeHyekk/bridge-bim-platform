# Bridge BIM Platform - 문서 목차

이 폴더는 프로젝트의 모든 문서를 파트별로 정리한 것입니다.

## 📚 문서 구조

### 1. 아키텍처 (Architecture)
프로젝트의 전체 구조와 설계 원칙을 설명합니다.

- [아키텍처 설계](./01-architecture/architecture.md) - 프로젝트 구조 및 설계 원칙
- [BIM 아키텍처](./01-architecture/bim-architecture.md) - BIM 데이터 구조 및 처리 방식
- [3D 뷰어 사양서](./01-architecture/3d-viewer-specification.md) - 3D 뷰어 구현 사양

### 2. API (API)
백엔드 API 명세를 설명합니다.

- [API 명세](./02-api/api-spec.md) - 백엔드 API 엔드포인트

### 3. 도메인 (Domain)
비즈니스 도메인 개념을 설명합니다.

- [교량 도메인](./03-domain/domain-bridge.md) - 교량 도메인 개념
- [BIM 개념](./03-domain/bim-concept.md) - BIM 기본 개념

### 4. 개발 가이드 (Development)
개발자를 위한 가이드 문서입니다.

- [프론트엔드 개발 가이드](./04-development/frontend-guide.md) - 프론트엔드 개발 방법론
- [컴포넌트 구조](./04-development/component-structure.md) - 컴포넌트 계층 및 역할
- [Redux 최적화](./04-development/redux-optimization.md) - Redux 최적화 가이드

### 5. 프로젝트 현황 (Status)
프로젝트의 구현 현황과 구조 요약입니다.

- [프로젝트 현황](./05-status/project-status.md) - 구현 현황 및 향후 계획
- [BIM 구조 요약](./05-status/bim-structure-summary.md) - BIM 구조 요약

---

## 🗂️ 문서 읽기 순서

### 신규 개발자
1. [아키텍처 설계](./01-architecture/architecture.md) - 프로젝트 구조 이해
2. [프론트엔드 개발 가이드](./04-development/frontend-guide.md) - 개발 환경 설정
3. [컴포넌트 구조](./04-development/component-structure.md) - 컴포넌트 구조 이해
4. [API 명세](./02-api/api-spec.md) - API 사용법

### BIM 기능 개발
1. [BIM 개념](./03-domain/bim-concept.md) - BIM 기본 개념
2. [BIM 아키텍처](./01-architecture/bim-architecture.md) - BIM 구조 이해
3. [3D 뷰어 사양서](./01-architecture/3d-viewer-specification.md) - 3D 뷰어 구현 사양
4. [BIM 구조 요약](./05-status/bim-structure-summary.md) - 구현된 구조 확인

### 프로젝트 현황 파악
1. [프로젝트 현황](./05-status/project-status.md) - 전체 구현 현황
2. [BIM 구조 요약](./05-status/bim-structure-summary.md) - BIM 구현 현황

---

## 📝 문서 업데이트 가이드

새로운 문서를 추가할 때는 다음 규칙을 따르세요:

1. **파트별 폴더에 배치**: 문서의 성격에 맞는 폴더에 배치
2. **파일명 규칙**: kebab-case 사용 (예: `my-new-document.md`)
3. **README 업데이트**: 이 파일에 새 문서 링크 추가

---

## 🔍 빠른 검색

### 아키텍처 관련
- 프로젝트 구조: [아키텍처 설계](./01-architecture/architecture.md)
- BIM 구조: [BIM 아키텍처](./01-architecture/bim-architecture.md)
- 3D 뷰어: [3D 뷰어 사양서](./01-architecture/3d-viewer-specification.md)

### 개발 관련
- 프론트엔드: [프론트엔드 개발 가이드](./04-development/frontend-guide.md)
- 컴포넌트: [컴포넌트 구조](./04-development/component-structure.md)
- Redux: [Redux 최적화](./04-development/redux-optimization.md)

### API 관련
- API 명세: [API 명세](./02-api/api-spec.md)

### 도메인 관련
- 교량: [교량 도메인](./03-domain/domain-bridge.md)
- BIM: [BIM 개념](./03-domain/bim-concept.md)

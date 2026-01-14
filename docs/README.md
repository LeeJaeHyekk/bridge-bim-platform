# Bridge BIM Platform - 문서 목차

이 폴더는 프로젝트의 모든 문서를 카테고리별로 정리한 것입니다.

## 📚 문서 구조

### 1. 아키텍처 (01-architecture)
프로젝트의 전체 구조와 설계 원칙을 설명합니다.

- [아키텍처 설계](./01-architecture/architecture.md) - 프로젝트 구조 및 설계 원칙 (통합)
- [BIM 아키텍처](./01-architecture/bim-architecture.md) - BIM 데이터 구조 및 처리 방식 (통합)
- [3D 뷰어 사양서](./01-architecture/3d-viewer-specification.md) - 3D 뷰어 구현 사양

### 2. API (02-api)
백엔드 API 명세를 설명합니다.

- [API 명세](./02-api/api-spec.md) - 백엔드 API 엔드포인트

### 3. 도메인 (03-domain)
비즈니스 도메인 개념을 설명합니다.

- [도메인 개념](./03-domain/domain.md) - 교량 및 BIM 도메인 개념 (통합)

### 4. 개발 가이드 (04-development)
개발자를 위한 가이드 문서입니다.

- [프론트엔드 개발 가이드](./04-development/frontend-guide.md) - 프론트엔드 개발 방법론
- [컴포넌트 구조](./04-development/component-structure.md) - 컴포넌트 계층 및 역할
- [Redux 최적화](./04-development/redux-optimization.md) - Redux 최적화 가이드
- [최적화 분석](./04-development/optimization-analysis.md) - Three.js BIM Viewer 최적화 제안

### 5. 프로젝트 현황 (05-status)
프로젝트의 구현 현황입니다.

- [프로젝트 현황](./05-status/project-status.md) - 구현 현황 및 향후 계획

---

## 🗂️ 문서 읽기 순서

### 신규 개발자
1. [아키텍처 설계](./01-architecture/architecture.md) - 프로젝트 구조 이해
2. [프론트엔드 개발 가이드](./04-development/frontend-guide.md) - 개발 환경 설정
3. [컴포넌트 구조](./04-development/component-structure.md) - 컴포넌트 구조 이해
4. [API 명세](./02-api/api-spec.md) - API 사용법

### BIM 기능 개발
1. [도메인 개념](./03-domain/domain.md) - BIM 기본 개념
2. [BIM 아키텍처](./01-architecture/bim-architecture.md) - BIM 구조 이해
3. [3D 뷰어 사양서](./01-architecture/3d-viewer-specification.md) - 3D 뷰어 구현 사양

### 성능 최적화
1. [Redux 최적화](./04-development/redux-optimization.md) - Redux 상태 관리 최적화
2. [최적화 분석](./04-development/optimization-analysis.md) - Three.js 뷰어 최적화 제안

### 프로젝트 현황 파악
1. [프로젝트 현황](./05-status/project-status.md) - 전체 구현 현황

---

## 📝 문서 업데이트 가이드

새로운 문서를 추가할 때는 다음 규칙을 따르세요:

1. **카테고리별 폴더에 배치**: 문서의 성격에 맞는 폴더에 배치
   - `01-architecture/`: 아키텍처 및 설계 문서
   - `02-api/`: API 명세 문서
   - `03-domain/`: 도메인 개념 문서
   - `04-development/`: 개발 가이드 문서
   - `05-status/`: 프로젝트 현황 문서

2. **파일명 규칙**: kebab-case 사용 (예: `my-new-document.md`)

3. **README 업데이트**: 이 파일에 새 문서 링크 추가

4. **중복 방지**: 기존 문서와 중복되는 내용이 있는지 확인 후 통합 고려

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
- 성능: [최적화 분석](./04-development/optimization-analysis.md)

### API 관련
- API 명세: [API 명세](./02-api/api-spec.md)

### 도메인 관련
- 도메인 개념: [도메인 개념](./03-domain/domain.md)

### 프로젝트 현황
- 구현 현황: [프로젝트 현황](./05-status/project-status.md)

---

## 📊 문서 통합 내역

### 통합된 문서
- `architecture.md` + `project-structure.md` → `architecture.md` (통합)
- `bim-architecture.md` + `bim-structure-summary.md` → `bim-architecture.md` (통합)
- `domain-bridge.md` + `bim-concept.md` → `domain.md` (통합)

### 이동된 문서
- `optimization-analysis.md` → `04-development/optimization-analysis.md`

### 삭제된 문서
- 중복 내용이 통합되어 삭제된 문서들은 위의 통합 내역 참조

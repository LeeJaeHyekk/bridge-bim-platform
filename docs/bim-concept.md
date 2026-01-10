# BIM 개념

## 🏗️ BIM이란?

**BIM (Building Information Modeling)**은 건축물의 3D 모델과 정보를 통합 관리하는 방식입니다.

### 핵심 특징

1. **3D 시각화**: 건축물을 3차원으로 표현
2. **정보 통합**: 기하학적 정보 + 속성 정보
3. **생명주기 관리**: 설계 → 시공 → 유지보수

## 🌉 교량 BIM

### 왜 교량에 BIM을 적용하는가?

1. **복잡한 구조**: 교량은 많은 부재로 구성됨
2. **유지보수 중요**: 안전과 직결
3. **정보 관리**: 각 부재의 상태, 점검 이력 등

### 교량 BIM의 구성 요소

1. **기하학적 모델**
   - 주탑, 케이블, 상판 등의 3D 형상
   - 각 부재의 위치, 크기, 형태

2. **속성 정보**
   - 재료 (콘크리트, 강재 등)
   - 규격 (두께, 길이 등)
   - 제작일, 시공일

3. **상태 정보**
   - 현재 상태 (SAFE, WARNING, DANGER)
   - 점검 이력
   - 수리 이력

## 📄 IFC 파일

### IFC란?

**IFC (Industry Foundation Classes)**는 BIM 데이터의 국제 표준 포맷입니다.

- ISO 16739 표준
- 벤더 독립적
- 건축, 토목, 설비 등 다양한 분야 지원

### IFC 파일 구조

```
IFC 파일
├─ 프로젝트 정보
├─ 건물 정보
├─ 부재 정보 (Wall, Beam, Column 등)
└─ 속성 정보
```

### 교량 IFC 예시

```
IFC 파일
├─ Bridge (교량)
│  ├─ Pylon (주탑)
│  ├─ Cable (케이블)
│  ├─ Deck (상판)
│  └─ Foundation (기초)
```

## 🔧 기술 스택 (향후 확장)

### 3D 뷰어 옵션

1. **Three.js**
   - 웹 기반 3D 라이브러리
   - IFC 파일 파싱 필요

2. **Autodesk Forge Viewer**
   - 전문 BIM 뷰어
   - IFC 파일 직접 지원

3. **xeokit**
   - 오픈소스 BIM 뷰어
   - IFC 지원

### IFC 파싱

- **IFC.js**: JavaScript 기반 IFC 파서
- **web-ifc**: WebAssembly 기반 고성능 파서

## 🚀 확장 시나리오

### Phase 1: 기본 구조
- 교량 목록 조회
- 교량 상세 정보

### Phase 2: BIM 뷰어 연동
- IFC 파일 업로드
- 3D 모델 표시
- 부재 선택 시 정보 표시

### Phase 3: 상태 시각화
- 부재별 상태 색상 표시
- 점검 이력 타임라인
- 알림 기능

## 📚 참고 자료

- [IFC.js 공식 문서](https://ifcjs.github.io/info/)
- [Autodesk Forge](https://forge.autodesk.com/)
- ISO 16739 (IFC 표준)

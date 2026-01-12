# BIM 웹 아키텍처 설계

## 📐 전체 구조 개요

```
[BIM 원본 파일]
(Revit / IFC)
      ↓ 변환
[서버]
- 형상 데이터 (경량화: glTF/OBJ)
- 속성 데이터 (DB)
- 관계 정보
      ↓ API
[웹 클라이언트]
- 3D Viewer
- 속성 조회
- 필터 / 검색
```

## 🏗️ 데이터 흐름

### 1. BIM 파일 업로드 및 변환 (향후 구현)

```
IFC/Revit 파일 업로드
  ↓
서버에서 파싱 (IFC.js 등)
  ↓
형상 데이터 → glTF 변환 (경량화)
속성 데이터 → DB 저장
관계 정보 → DB 저장
```

### 2. 데이터 조회

```
클라이언트 요청
  ↓
API 호출
  ↓
서버에서 데이터 조회
  ↓
JSON 응답
  ↓
클라이언트 렌더링
```

## 📦 프로젝트 구조

### Shared 패키지 (`packages/shared`)

**타입 정의:**
- `BIMComponent`: 부재 정보
- `BIMGeometry`: 형상 데이터 (경량화)
- `BIMRelationship`: 관계 정보
- `BIMModel`: 전체 BIM 모델
- `BIMFilter`: 필터 조건

### 서버 (`apps/api/src/modules/bim`)

```
bim/
├─ bim.repository.ts    # 데이터 접근 (Mock → 향후 DB)
├─ bim.service.ts        # 비즈니스 로직
├─ bim.controller.ts    # HTTP 요청/응답
└─ bim.route.ts          # 라우트 정의
```

**주요 기능:**
- BIM 모델 조회 (교량 ID 또는 모델 ID)
- 부재 목록 조회 (필터 지원)
- 부재 상세 정보 조회
- 형상 데이터 조회
- 관계 정보 조회
- 파일 업로드/변환 (향후 구현)

**API 엔드포인트:**
- `GET /api/bim/bridges/:bridgeId/bim` - 교량의 BIM 모델 조회
- `GET /api/bim/models/:modelId` - BIM 모델 상세 조회
- `GET /api/bim/models/:modelId/components` - 부재 목록 (필터 지원)
- `GET /api/bim/models/:modelId/components/:componentId` - 부재 상세
- `GET /api/bim/models/:modelId/components/:componentId/geometry` - 형상 데이터
- `GET /api/bim/models/:modelId/relationships` - 관계 정보

### 클라이언트 (`apps/web/src/features/bim-viewer`)

```
bim-viewer/
├─ api.ts                    # API 호출 함수
├─ hooks.ts                  # React Hooks (useBIMModel, useBIMComponents 등)
├─ components/
│  ├─ bim-viewer.tsx         # 메인 3D 뷰어 컴포넌트
│  ├─ bim-filter.tsx          # 필터 컴포넌트
│  └─ bim-properties.tsx      # 속성 표시 컴포넌트
└─ index.tsx                 # Export
```

**주요 기능:**
- BIM 모델 로딩 및 표시
- 부재 목록 표시
- 부재 선택 시 속성 조회
- 필터 기능 (타입, 상태)
- 3D 뷰어 (향후 Three.js/IFC.js 연동)

## 🔄 데이터 구조

### BIM 모델 (BIMModel)

```typescript
{
  metadata: {
    id: string
    bridgeId: string
    name: string
    version: string
    sourceFormat: 'IFC' | 'Revit'
    componentCount: number
    geometryFormat: 'glTF' | 'OBJ'
  },
  components: BIMComponent[],
  geometries: BIMGeometry[],
  relationships: BIMRelationship[]
}
```

### 부재 (BIMComponent)

```typescript
{
  id: string
  name: string
  type: 'Pylon' | 'Cable' | 'Deck' | ...
  properties: [
    { key: 'material', value: 'Concrete', unit: undefined },
    { key: 'height', value: 50, unit: 'm' }
  ],
  parentId?: string,
  childrenIds?: string[],
  status?: 'SAFE' | 'WARNING' | 'DANGER'
}
```

### 형상 데이터 (BIMGeometry)

```typescript
{
  componentId: string
  format: 'glTF' | 'OBJ' | 'IFC'
  url: string
  boundingBox: {
    min: [number, number, number],
    max: [number, number, number]
  },
  vertexCount?: number,
  fileSize?: number
}
```

## 🚀 확장 계획

### Phase 1: 기본 구조 (현재)
- ✅ 타입 정의
- ✅ API 구조
- ✅ 기본 컴포넌트
- ✅ 필터 기능

### Phase 2: 3D 뷰어 연동
- [ ] Three.js 또는 IFC.js 연동
- [ ] glTF 파일 로딩
- [ ] 부재 선택 시 하이라이트
- [ ] 카메라 컨트롤

### Phase 3: 파일 업로드 및 변환
- [ ] IFC 파일 업로드
- [ ] IFC.js로 파싱
- [ ] glTF 변환
- [ ] 속성 데이터 추출 및 저장

### Phase 4: 고급 기능
- [ ] 검색 기능
- [ ] 측정 도구
- [ ] 섹션 커팅
- [ ] 애니메이션 (시공 시뮬레이션)

## 💡 설계 원칙

1. **경량화**: 원본 BIM 파일을 그대로 사용하지 않고 웹용 포맷으로 변환
2. **분리**: 형상 데이터와 속성 데이터를 분리하여 관리
3. **확장성**: 새로운 부재 타입이나 속성을 쉽게 추가 가능
4. **타입 안정성**: TypeScript로 전체 타입 정의

## 📚 참고 기술

- **IFC.js**: JavaScript 기반 IFC 파서
- **Three.js**: 웹 기반 3D 라이브러리
- **glTF**: 웹용 3D 모델 포맷 (경량화)
- **Autodesk Forge**: 전문 BIM 뷰어 (상용)

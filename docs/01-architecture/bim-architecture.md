# BIM 아키텍처 설계

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

---

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

---

## 📦 프로젝트 구조

### Shared 패키지 (`packages/shared`)

**타입 정의:**
- `BIMComponent`: 부재 정보 (타입, 속성, 상태)
- `BIMGeometry`: 형상 데이터 (경량화된 glTF/OBJ)
- `BIMRelationship`: 부재 간 관계 정보
- `BIMModel`: 전체 BIM 모델 구조
- `BIMFilter`: 필터 조건 타입

**파일 구조:**
```
packages/shared/src/
├─ types/bim.ts                    # BIM 타입 정의
└─ enums/bim-component-type.ts    # 부재 타입 enum
```

### 서버 (`apps/api/src/modules/bim`)

**레이어 구조:**
```
bim/
├─ bim.route.ts          # 라우트 정의
├─ bim.controller.ts     # HTTP 요청/응답 처리
├─ bim.service.ts        # 비즈니스 로직
└─ bim.repository.ts     # 데이터 접근 (Mock → 향후 DB)
```

**주요 기능:**
- BIM 모델 조회 (교량 ID 또는 모델 ID)
- 부재 목록 조회 (필터 지원)
- 부재 상세 정보 조회
- 형상 데이터 조회
- 관계 정보 조회
- 파일 업로드/변환 (향후 구현)

**API 엔드포인트:**
```
/api/bim/
├─ GET /bridges/:bridgeId/bim          # 교량의 BIM 모델 조회
├─ GET /models/:modelId                # BIM 모델 상세
├─ GET /models/:modelId/components     # 부재 목록 (필터 지원)
├─ GET /models/:modelId/components/:componentId  # 부재 상세
├─ GET /models/:modelId/components/:componentId/geometry  # 형상 데이터
└─ GET /models/:modelId/relationships  # 관계 정보
```

### 클라이언트 (`apps/web/src/features/bim-viewer`)

**구조:**
```
features/bim-viewer/
├─ api.ts                    # API 호출 함수
├─ hooks.ts                  # React Hooks
│  ├─ useBIMModel           # BIM 모델 로딩
│  ├─ useBIMComponents      # 부재 목록 (필터 지원)
│  └─ useBIMComponent       # 부재 상세
└─ components/
   ├─ bim-viewer.tsx        # 메인 뷰어 (3D 영역 + 부재 목록)
   ├─ bim-filter.tsx         # 필터 UI (타입, 상태)
   └─ bim-properties.tsx     # 속성 표시
```

**주요 기능:**
- BIM 모델 로딩 및 표시
- 부재 목록 표시
- 부재 선택 시 속성 조회
- 필터 기능 (타입, 상태)
- 3D 뷰어 (Three.js 연동 완료)

---

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

---

## 🎯 핵심 설계 원칙

### 1. 데이터 분리
- **형상 데이터**: 경량화된 glTF/OBJ 파일로 별도 저장
- **속성 데이터**: JSON으로 DB에 저장
- **관계 정보**: 부재 간 관계를 별도로 관리

### 2. 경량화 전략
- 원본 IFC 파일을 그대로 사용하지 않음
- 웹용 포맷(glTF)으로 변환하여 전송량 최소화
- 필요시에만 형상 데이터 로딩 (Lazy Loading)

### 3. 확장 가능한 구조
- 새로운 부재 타입 추가 용이
- 필터 조건 확장 가능
- 향후 3D 뷰어 라이브러리 교체 용이

### 4. 타입 안정성
- TypeScript로 전체 타입 정의
- Shared 패키지로 프론트/백엔드 타입 일치

---

## 📋 사용 예시

### 서버에서 부재 필터링

```typescript
// 타입별 필터
const filter: BIMFilter = {
  componentType: ['Pylon', 'Cable']
}

// 상태별 필터
const filter: BIMFilter = {
  status: ['WARNING', 'DANGER']
}

// 속성 필터
const filter: BIMFilter = {
  propertyFilters: [
    { key: 'material', operator: 'equals', value: 'Concrete' }
  ]
}
```

### 클라이언트에서 사용

```tsx
import { BIMViewer, BIMFilter, BIMProperties } from '@/features/bim-viewer'

function BridgeDetailPage({ bridgeId }: { bridgeId: string }) {
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [filter, setFilter] = useState<BIMFilter>({})

  return (
    <div className="grid grid-cols-3">
      <div>
        <BIMFilter onFilterChange={setFilter} />
      </div>
      <div className="col-span-2">
        <BIMViewer 
          bridgeId={bridgeId}
          onComponentSelect={setSelectedComponent}
        />
      </div>
      <div>
        <BIMProperties component={selectedComponent} />
      </div>
    </div>
  )
}
```

---

## 🚀 확장 계획

### Phase 1: 기본 구조 (✅ 완료)
- ✅ 타입 정의
- ✅ API 구조
- ✅ 기본 컴포넌트
- ✅ 필터 기능
- ✅ Three.js 3D 뷰어 연동

### Phase 2: 3D 뷰어 고도화 (진행 중)
- ✅ Three.js 연동 완료
- ✅ glTF 파일 로딩 준비
- ✅ 부재 선택 및 하이라이트
- ✅ 카메라 컨트롤 (OrbitControls)
- ⏳ ModelManager, ResizeManager, InteractionManager 추가 예정

### Phase 3: 파일 업로드 및 변환 (예정)
- [ ] IFC 파일 업로드
- [ ] IFC.js로 파싱
- [ ] glTF 변환
- [ ] 속성 데이터 추출 및 저장

### Phase 4: 고급 기능 (예정)
- [ ] 검색 기능
- [ ] 측정 도구
- [ ] 섹션 커팅
- [ ] 애니메이션 (시공 시뮬레이션)

---

## 💡 핵심 포인트

1. **원본 파일을 그대로 사용하지 않음**: 웹용 포맷으로 변환
2. **형상과 속성 분리**: 각각 최적화된 방식으로 저장
3. **필터링은 서버에서**: 대용량 데이터 효율 처리
4. **타입 안정성**: Shared 패키지로 프론트/백엔드 타입 일치

---

## 📚 참고 기술

- **IFC.js**: JavaScript 기반 IFC 파서
- **Three.js**: 웹 기반 3D 라이브러리 (현재 사용 중)
- **glTF**: 웹용 3D 모델 포맷 (경량화)
- **Autodesk Forge**: 전문 BIM 뷰어 (상용, 참고용)

---

## 📁 파일 구조 요약

```
packages/shared/src/
├─ types/bim.ts                    # BIM 타입 정의
└─ enums/bim-component-type.ts    # 부재 타입 enum

apps/api/src/modules/bim/
├─ bim.repository.ts              # 데이터 접근
├─ bim.service.ts                 # 비즈니스 로직
├─ bim.controller.ts              # HTTP 처리
└─ bim.route.ts                   # 라우트

apps/web/src/features/bim-viewer/
├─ api.ts                         # API 호출
├─ hooks.ts                       # React Hooks
├─ components/
│  ├─ bim-viewer.tsx             # 메인 뷰어
│  ├─ bim-filter.tsx             # 필터
│  └─ bim-properties.tsx         # 속성 표시
└─ index.tsx                     # Export
```

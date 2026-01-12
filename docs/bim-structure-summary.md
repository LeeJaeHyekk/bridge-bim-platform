# BIM 웹 구조 요약

## ✅ 구현 완료된 구조

### 1. 타입 정의 (Shared 패키지)
- ✅ `BIMComponent`: 부재 정보 (타입, 속성, 상태)
- ✅ `BIMGeometry`: 형상 데이터 (경량화된 glTF/OBJ)
- ✅ `BIMRelationship`: 부재 간 관계 정보
- ✅ `BIMModel`: 전체 BIM 모델 구조
- ✅ `BIMFilter`: 필터 조건 타입

### 2. 서버 API 구조
```
/api/bim/
├─ GET /bridges/:bridgeId/bim          # 교량의 BIM 모델 조회
├─ GET /models/:modelId                # BIM 모델 상세
├─ GET /models/:modelId/components     # 부재 목록 (필터 지원)
├─ GET /models/:modelId/components/:componentId  # 부재 상세
├─ GET /models/:modelId/components/:componentId/geometry  # 형상 데이터
└─ GET /models/:modelId/relationships  # 관계 정보
```

**레이어 구조:**
- `bim.route.ts`: 라우트 정의
- `bim.controller.ts`: HTTP 요청/응답 처리
- `bim.service.ts`: 비즈니스 로직
- `bim.repository.ts`: 데이터 접근 (현재 Mock, 향후 DB)

### 3. 클라이언트 구조
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

## 🚀 다음 단계

### 즉시 가능한 작업
1. ✅ 타입 체크 통과
2. ✅ API 엔드포인트 동작 확인
3. ✅ 컴포넌트 통합 테스트

### 향후 구현
1. **3D 뷰어 연동**
   - Three.js 또는 IFC.js 설치
   - glTF 파일 로딩
   - 부재 선택 시 하이라이트

2. **파일 업로드**
   - multer 미들웨어 추가
   - IFC 파일 파싱 (IFC.js)
   - glTF 변환 로직

3. **검색 기능**
   - 텍스트 검색 API
   - 속성 기반 검색
   - 자동완성

## 📁 파일 구조

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

## 💡 핵심 포인트

1. **원본 파일을 그대로 사용하지 않음**: 웹용 포맷으로 변환
2. **형상과 속성 분리**: 각각 최적화된 방식으로 저장
3. **필터링은 서버에서**: 대용량 데이터 효율 처리
4. **타입 안정성**: Shared 패키지로 프론트/백엔드 타입 일치

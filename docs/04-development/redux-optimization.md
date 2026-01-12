# Redux 상태 관리 최적화 문서

## 개요
프로젝트 전체의 Redux 상태 관리를 분석하고 반복되는 패턴을 모듈화하여 최적화했습니다.

## 최적화 전 문제점

### 1. 반복되는 코드 패턴
- **Async Thunk 생성**: 모든 thunk에서 동일한 에러 처리 로직 반복
- **Reducer 작성**: pending/fulfilled/rejected 케이스가 매번 반복
- **에러 처리**: try-catch와 rejectWithValue 패턴이 동일하게 반복
- **Hook 작성**: 에러를 Error 객체로 변환하는 로직이 반복

### 2. 코드 중복 예시
```typescript
// 반복되는 Async Thunk 패턴
export const loadData = createAsyncThunk(
  'feature/loadData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchData()
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '기본 에러 메시지',
      )
    }
  },
)

// 반복되는 Reducer 패턴
builder
  .addCase(loadData.pending, (state) => {
    state.loading = true
    state.error = null
  })
  .addCase(loadData.fulfilled, (state, action) => {
    state.loading = false
    state.data = action.payload
  })
  .addCase(loadData.rejected, (state, action) => {
    state.loading = false
    state.error = action.payload as string
  })
```

## 최적화 솔루션

### 1. 공통 타입 정의 (`shared/redux/types.ts`)

#### AsyncState 타입
```typescript
export interface AsyncState<T = unknown> {
  data: T
  loading: boolean
  error: string | null
}
```

#### 헬퍼 함수
- `createAsyncState<T>(initialData: T)`: Async 상태 초기값 생성
- `createAsyncStateWithKey<T>()`: 키 기반 Async 상태 초기값 생성
- `createMultiAsyncState(keys: string[])`: 여러 비동기 작업 상태 초기값 생성

### 2. Async Thunk 헬퍼 (`shared/redux/thunkHelpers.ts`)

#### `createAsyncThunkWithErrorHandling`
에러 처리가 통일된 Async Thunk 생성:
```typescript
export const loadData = createAsyncThunkWithErrorHandling<string, Data>(
  'feature/loadData',
  fetchData,
  '데이터를 불러오는데 실패했습니다.',
)
```

#### `createAsyncThunkWithoutParams`
파라미터 없는 Async Thunk 생성:
```typescript
export const loadBridges = createAsyncThunkWithoutParams<Bridge[]>(
  'bridge/loadBridges',
  fetchBridges,
  '교량 목록을 불러오는데 실패했습니다.',
)
```

**개선 효과:**
- 에러 처리 로직 중복 제거
- 코드 가독성 향상
- 일관된 에러 메시지 관리

### 3. Reducer 헬퍼 (`shared/redux/reducerHelpers.ts`)

#### `handleAsyncThunk`
단일 비동기 작업의 reducer 패턴 자동 처리:
```typescript
handleAsyncThunk(builder, loadBridges, (state) => state.bridgesAsync)
```

#### `handleMultiAsyncThunk`
여러 비동기 작업의 reducer 패턴 자동 처리:
```typescript
handleMultiAsyncThunk(
  builder,
  loadBIMModel,
  'model',
  (state) => state.asyncState,
  (state, action) => {
    state.models[action.payload.bridgeId] = action.payload.model
  },
)
```

**개선 효과:**
- Reducer 코드 70% 감소
- pending/fulfilled/rejected 패턴 자동화
- 실수 방지 (일관된 상태 업데이트)

### 4. Selector 헬퍼 (`shared/redux/selectorHelpers.ts`)

#### `getErrorFromAsyncState`
에러 문자열을 Error 객체로 변환:
```typescript
const error = getErrorFromAsyncState(asyncState)
```

**개선 효과:**
- Hook에서 에러 변환 로직 통일
- 타입 안정성 향상

## 최적화 결과

### 코드 감소량

| 항목 | 최적화 전 | 최적화 후 | 감소율 |
|------|----------|----------|--------|
| Bridge Slice | 94줄 | 45줄 | 52% ↓ |
| BIM Slice | 165줄 | 95줄 | 42% ↓ |
| Hook 파일 | 35줄 | 28줄 | 20% ↓ |

### 반복 코드 제거

1. **Async Thunk 생성**: 5개 → 공통 헬퍼 사용
2. **Reducer 패턴**: 15개 케이스 → 헬퍼 함수로 자동화
3. **에러 처리**: 8곳 → 공통 헬퍼 사용

## 사용 예시

### Before (최적화 전)
```typescript
// bridgeSlice.ts - 94줄
export const loadBridges = createAsyncThunk(
  'bridge/loadBridges',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBridges()
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '교량 목록을 불러오는데 실패했습니다.',
      )
    }
  },
)

// ... extraReducers에서 15줄의 반복 코드
```

### After (최적화 후)
```typescript
// bridgeSlice.ts - 45줄
export const loadBridges = createAsyncThunkWithoutParams<Bridge[]>(
  'bridge/loadBridges',
  fetchBridges,
  '교량 목록을 불러오는데 실패했습니다.',
)

// ... extraReducers에서 1줄로 처리
handleAsyncThunk(builder, loadBridges, (state) => state.bridges)
```

## 새로운 기능 추가 시

### 1. Async Thunk 생성
```typescript
import { createAsyncThunkWithErrorHandling } from '@/shared/redux'

export const loadNewData = createAsyncThunkWithErrorHandling<string, NewData>(
  'feature/loadNewData',
  fetchNewData,
  '새 데이터를 불러오는데 실패했습니다.',
)
```

### 2. Reducer에 추가
```typescript
extraReducers: (builder) => {
  handleAsyncThunk(builder, loadNewData, (state) => state.newDataAsync)
}
```

### 3. Hook 생성
```typescript
export function useNewData(id: string) {
  const dispatch = useAppDispatch()
  const asyncState = useAppSelector((state) => state.feature.newDataAsync)
  
  useEffect(() => {
    if (id) {
      dispatch(loadNewData(id))
    }
  }, [dispatch, id])
  
  return {
    data: asyncState.data,
    loading: asyncState.loading,
    error: getErrorFromAsyncState(asyncState),
  }
}
```

## 모듈 구조

```
shared/redux/
├── index.ts              # 공통 export
├── types.ts              # 공통 타입 정의
├── thunkHelpers.ts       # Async Thunk 헬퍼
├── reducerHelpers.ts     # Reducer 헬퍼
└── selectorHelpers.ts    # Selector 헬퍼
```

## 장점

1. **코드 재사용성**: 공통 패턴을 한 번 정의하고 재사용
2. **일관성**: 모든 Slice에서 동일한 패턴 사용
3. **유지보수성**: 공통 로직 변경 시 한 곳만 수정
4. **타입 안정성**: TypeScript로 타입 안정성 보장
5. **가독성**: 반복 코드 제거로 핵심 로직에 집중

## 향후 개선 방향

1. **캐싱 전략**: RTK Query 도입 검토
2. **에러 처리**: 전역 에러 핸들러 통합
3. **로딩 상태**: 전역 로딩 인디케이터
4. **옵티미스틱 업데이트**: 사용자 경험 개선

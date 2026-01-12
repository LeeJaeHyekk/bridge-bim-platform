# API 명세

## 📡 API 개요

이 프로젝트의 백엔드 API는 RESTful 원칙을 따릅니다.

**Base URL**: `http://localhost:3001/api`

## 🔌 엔드포인트

### 교량 API

#### 1. 교량 목록 조회

**GET** `/api/bridges`

교량 목록을 조회합니다.

#### 응답 예시

```json
[
  {
    "id": "1",
    "name": "한강대교",
    "location": "서울특별시",
    "status": "SAFE"
  },
  {
    "id": "2",
    "name": "마포대교",
    "location": "서울특별시",
    "status": "WARNING"
  }
]
```

#### 상태 코드

- `200 OK`: 성공

---

#### 2. 교량 상세 조회

**GET** `/api/bridges/:id`

특정 교량의 상세 정보를 조회합니다.

#### 경로 파라미터

- `id` (string): 교량 ID

#### 응답 예시

```json
{
  "id": "1",
  "name": "한강대교",
  "location": "서울특별시",
  "status": "SAFE"
}
```

#### 상태 코드

- `200 OK`: 성공
- `404 Not Found`: 교량을 찾을 수 없음

---

## 📦 데이터 타입

### Bridge

```typescript
interface Bridge {
  id: string
  name: string
  location: string
  status: 'SAFE' | 'WARNING' | 'DANGER'
}
```

### BridgeStatus

```typescript
type BridgeStatus = 'SAFE' | 'WARNING' | 'DANGER'
```

## 🔄 향후 확장 가능한 엔드포인트

### 교량 생성

**POST** `/bridges`

```json
{
  "name": "새로운 교량",
  "location": "서울특별시",
  "status": "SAFE"
}
```

### 교량 수정

**PUT** `/bridges/:id`

### 교량 삭제

**DELETE** `/bridges/:id`

### 교량 점검 기록 조회

**GET** `/bridges/:id/inspections`

### BIM API

#### 1. 교량의 BIM 모델 조회

**GET** `/api/bim/bridges/:bridgeId/bim`

특정 교량에 연결된 BIM 모델을 조회합니다.

#### 응답 예시

```json
{
  "metadata": {
    "id": "bim-model-1",
    "bridgeId": "1",
    "name": "한강대교 BIM 모델",
    "version": "1.0.0",
    "sourceFormat": "IFC",
    "componentCount": 150,
    "geometryFormat": "glTF"
  },
  "components": [...],
  "geometries": [...],
  "relationships": [...]
}
```

#### 상태 코드

- `200 OK`: 성공
- `404 Not Found`: BIM 모델을 찾을 수 없음

---

#### 2. BIM 모델 상세 조회

**GET** `/api/bim/models/:modelId`

BIM 모델의 상세 정보를 조회합니다.

---

#### 3. BIM 부재 목록 조회

**GET** `/api/bim/models/:modelId/components`

BIM 모델의 부재 목록을 조회합니다. 쿼리 파라미터로 필터링 가능합니다.

**쿼리 파라미터:**
- `type` (optional): 부재 타입 필터 (예: `Pylon`, `Cable`, `Deck`)
- `status` (optional): 상태 필터 (예: `SAFE`, `WARNING`, `DANGER`)

**예시:**
```
GET /api/bim/models/bim-model-1/components?type=Pylon&status=SAFE
```

---

#### 4. BIM 부재 상세 조회

**GET** `/api/bim/models/:modelId/components/:componentId`

특정 부재의 상세 정보를 조회합니다.

---

#### 5. BIM 부재 형상 데이터 조회

**GET** `/api/bim/models/:modelId/components/:componentId/geometry`

부재의 3D 형상 데이터를 조회합니다.

---

#### 6. BIM 관계 정보 조회

**GET** `/api/bim/models/:modelId/relationships`

BIM 모델의 부재 간 관계 정보를 조회합니다.

## 🛠️ 에러 처리

### 에러 응답 형식

```json
{
  "message": "에러 메시지",
  "error": "상세 에러 (개발 환경에서만)"
}
```

### 상태 코드

- `400 Bad Request`: 잘못된 요청
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

## 🔐 인증 (향후 추가)

현재는 인증이 없지만, 향후 추가 가능:

- JWT 토큰 기반 인증
- 역할 기반 접근 제어 (RBAC)

## 📝 참고

- 모든 날짜는 ISO 8601 형식 사용
- 모든 응답은 JSON 형식
- CORS 활성화 (개발 환경)

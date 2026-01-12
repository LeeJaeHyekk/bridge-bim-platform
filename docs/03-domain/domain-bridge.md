# 교량 도메인 설명

## 🌉 교량이란?

교량(Bridge)은 강, 계곡, 도로 등을 가로지르는 구조물입니다. 이 프로젝트에서는 교량의 **상태 관리**와 **BIM 데이터 연동**을 다룹니다.

## 📊 핵심 개념

### 1. 교량 기본 정보

- **ID**: 고유 식별자
- **이름**: 교량명 (예: 한강대교, 마포대교)
- **위치**: 교량이 있는 지역

### 2. 교량 상태 (Bridge Status)

교량의 안전 상태를 나타냅니다:

- **SAFE**: 안전 상태
- **WARNING**: 주의 필요
- **DANGER**: 위험 상태

### 3. 부재 (Component)

교량을 구성하는 요소들:

- **주탑 (Pylon)**: 교량을 지지하는 주요 구조물
- **케이블 (Cable)**: 현수교의 경우 케이블
- **상판 (Deck)**: 차량이 다니는 부분
- **기초 (Foundation)**: 지반과 연결된 부분

### 4. 점검 (Inspection)

정기적인 점검을 통해 교량의 상태를 확인합니다:

- 점검 일자
- 점검 항목
- 점검 결과
- 다음 점검 예정일

## 🏗️ BIM과의 연관성

BIM(Building Information Modeling)은 건축물의 3D 모델과 정보를 통합 관리하는 방식입니다.

### 교량 BIM의 특징

1. **3D 모델**: 교량의 3차원 시각화
2. **속성 정보**: 각 부재의 재료, 규격, 제작일 등
3. **상태 추적**: 시간에 따른 교량 상태 변화 기록

### IFC 파일

IFC(Industry Foundation Classes)는 BIM 데이터의 표준 포맷입니다. 향후 IFC 파일을 읽어서 교량 모델을 표시할 수 있습니다.

## 💡 도메인 모델링

### Bridge Entity

```typescript
interface Bridge {
  id: string
  name: string
  location: string
  status: 'SAFE' | 'WARNING' | 'DANGER'
}
```

### 확장 가능한 구조

나중에 추가할 수 있는 필드:

- `components`: 부재 목록
- `inspections`: 점검 기록
- `bimModelUrl`: BIM 모델 파일 경로
- `lastInspectionDate`: 마지막 점검일

## 🔄 비즈니스 규칙

1. **상태 변경**: 점검 결과에 따라 상태가 변경됨
2. **점검 주기**: 교량 상태에 따라 점검 주기가 달라짐
3. **알림**: 위험 상태일 때 알림 발송

## 📚 참고 자료

- 교량 구조 설계 기준
- BIM 표준 (ISO 16739)
- IFC 스펙

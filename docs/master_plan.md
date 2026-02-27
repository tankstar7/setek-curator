# 프로젝트명: 22개정 이공계 세특/생기부 큐레이션 및 생성 플랫폼

## 1. 프로젝트 개요 (Overview)
본 프로젝트는 대한민국 고등학생을 대상으로 2022 개정 교육과정에 맞춘 이공계(의약학, 공학, 자연과학) 세특(세부능력 및 특기사항) 탐구 주제를 큐레이션하고, 프리미엄 보고서 초안을 생성해 주는 웹 서비스다. 현직 연구원의 인사이트를 반영하여 고퀄리티의 심화 탐구 내용을 제공하되, 교과서 성취 기준을 벗어나지 않도록 난이도를 조절하는 것이 핵심이다.

## 2. 기술 스택 (Tech Stack)
- **Frontend/Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui (또는 Tailwind 기반 UI 라이브러리)
- **Backend & Database:** Firebase (Firestore)
- **AI Integration:** Google Gemini 1.5 Pro API (추후 서버리스/Cloud Functions 환경에서 호출 예정)

## 3. 핵심 데이터베이스 스키마 (Firestore DB Structure)
데이터는 오프라인에서 AI(Gemini)를 통해 미리 시딩(Seeding)되어 Firestore에 저장된다.

### 3.1. `curriculum` (교육과정 트리 - 6 Depth)
- `subject`: 과목군 (예: 과학)
- `course`: 세부 과목 (예: 화학, 물질과 에너지)
- `major_unit`: 대주제 (예: 화학 반응과 에너지)
- `minor_units`: 소주제 배열 (융합 가능)
- `textbook_analysis`: { `core_concepts`: [], `publisher_specifics`: [{`publisher`, `focus_point`}] }

### 3.2. `skill_trees` (대학 전공별 필수 수강 과목 매핑)
- `major_name`: 목표 전공 (예: 기계공학과)
- `core_required`: 필수 수강 과목명 배열
- `ai_recommended_combo`: [{ `course`, `reason` }] (진로/융합 선택 3과목 꿀조합 추천)

### 3.3. `reports_db` (세특 보고서 특정 주제 데이터)
- `trend_keyword`: 관련 산업 트렌드 (예: 전고체 배터리)
- `report_title`: 보고서 특정 주제 제목
- `target_majors`: 추천 전공 배열
- `golden_template`: 
  - `motivation`: 탐구 동기 (Free)
  - `basic_knowledge`: 교과서 연계 기초 지식 (출판사 맞춤) (Free)
  - `application`: 내용 탐구 (Free)
  - `in_depth`: 석학 시선의 심화 탐구 (Premium - Paywall)
  - `major_connection`: 전공 연계 비전 (Premium - Paywall)

## 4. 핵심 페이지 구조 및 요구사항 (UI/UX)

### 4.1. 홈 화면 (`app/page.tsx`)
- **Hero Section:** 서비스 슬로건과 중앙에 거대한 통합 검색창 배치 ("희망 전공을 입력하여 필수 수강 과목과 맞춤 세특을 확인하세요").
- **Lead Magnet Section:** '15개정 vs 22개정 교육과정 비교표 보기' 유도 배너.
- **Trending Section:** 이번 주 인기 세특 TOP 3를 가로 카드 형태로 노출. (더미 데이터 활용)

### 4.2. 전공 맞춤형 스킬 트리 화면 (`app/skill-tree/[major]/page.tsx`)
- 유저가 홈에서 검색한 전공(major)의 22개정 필수 과목 조합을 시각적인 '테크 트리' 형태로 보여줌.
- AI 추천 진로/융합 선택 3과목 꿀조합을 표나 카드로 명확하게 제시.
- 화면 하단에 **"이 3과목이 융합된 맞춤형 심화 세특 보고서 생성하기"** 버튼(Call to Action)을 강렬하게 배치하여 결제/생성 퍼널로 유도.

### 4.3. 보고서 생성 및 결제 화면 (`app/generate/page.tsx`)
- **좌측 패널 (필터링):** 과목, 대단원, 본인의 교과서 출판사, 트렌드 키워드를 드롭다운으로 선택.
- **우측 패널 (결과 & Paywall):**
  - 선택한 필터에 맞춰 `golden_template` 데이터 렌더링.
  - 탐구 동기, 기초 지식, 내용 탐구는 텍스트를 온전히 보여줌.
  - **심화 탐구, 전공 연계 파트는 텍스트를 블러(Blur) 처리하거나 자물쇠 아이콘으로 가림.**
  - 하단에 고정된 플로팅 결제 바(Paywall) 구현: "프리미엄 결제하고 전체 보고서 확인하기".

## 5. 클로드(Claude) 작업 지침
1. **디자인 퀄리티:** 교육 서비스이므로 신뢰감을 주는 색상(네이비, 화이트, 포인트 컬러)을 사용하고, 모바일과 데스크톱 모두에서 완벽한 반응형(Responsive)으로 구현할 것.
2. **더미 데이터 활용:** 아직 Firebase 연결 전이므로, UI를 그릴 때 화학공학과, 의예과 등 기획안에 명시된 예시를 바탕으로 현실적인 더미 데이터(Mock Data)를 생성하여 화면을 채울 것.
3. **컴포넌트 분리:** 확장성을 고려하여 UI 요소들(Card, Button, SearchBar, Paywall)을 재사용 가능한 컴포넌트로 분리할 것.
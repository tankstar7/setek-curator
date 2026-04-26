import requests
import json
import time

def get_list_input(prompt_text):
    """콤마(,)로 구분된 입력을 리스트로 변환하는 헬퍼 함수"""
    user_input = input(prompt_text)
    return [x.strip() for x in user_input.split(',') if x.strip()]

# 2022 개정 수학 교과목 목차 맵핑 (교육부 고시 제2022-33호 공식 단원명)
MATH_CURRICULUM = {
    # ------ [공통과목] ------
    "공통수학1": ["I. 다항식", "II. 방정식과 부등식", "III. 경우의 수", "IV. 행렬"],
    "공통수학2": ["I. 도형의 방정식", "II. 집합과 명제", "III. 함수와 그래프"],
    # ------ [일반선택] ------
    "대수": ["I. 지수함수와 로그함수", "II. 삼각함수", "III. 수열"],
    "미적분Ⅰ": ["I. 함수의 극한과 연속", "II. 미분", "III. 적분"],
    "확률과 통계": ["I. 경우의 수", "II. 확률", "III. 통계"],
    # ------ [진로선택] ------
    "미적분Ⅱ": ["I. 수열의 극한", "II. 미분법", "III. 적분법"],
    "기하": ["I. 이차곡선", "II. 공간도형과 공간좌표", "III. 벡터"],
    "경제 수학": ["I. 수와 경제", "II. 함수와 경제", "III. 행렬과 경제", "IV. 미분과 경제"],
    "인공지능 수학": ["I. 인공지능과 빅데이터", "II. 텍스트 데이터 처리", "III. 이미지 데이터 처리", "IV. 예측과 최적화"],
    "직무 수학": ["I. 수와 연산", "II. 변화와 관계", "III. 도형과 측정", "IV. 자료와 가능성"],
    # ------ [융합선택] ------
    "수학과 문화": ["I. 음악과 수학", "II. 미술과 수학", "III. 스포츠와 수학", "IV. 생활과 수학"],
    "실용 통계": ["I. 통계의 활용", "II. 자료의 수집과 정리", "III. 통계적 추론"],
    "수학과제 탐구": ["I. 과제 탐구의 이해", "II. 과제 탐구의 실행", "III. 과제 탐구의 발표와 평가"]
}

import re

def strip_unit_prefix(name: str) -> str:
    """단원명에서 앞의 번호 접두사(로마자 또는 아라비아 숫자 + 점)를 제거한다.
    예: 'I. 지수함수와 로그함수' -> '지수함수와 로그함수'
        '3. 수학적 귀납법' -> '수학적 귀납법'
    DB의 large_unit_name, small_unit_name 컬럼에는 번호 없이 저장해야 한다.
    """
    return re.sub(r'^[IVX]+\.\s+|^\d+\.\s+', '', name).strip()


API_URL = "http://localhost:3000/api/generate-report"
SAFETY_DELAY = 15  # 🚀 구글 API Rate Limit(15 RPM 기준) 방지를 위한 안전 대기 시간 (초)

def call_api(payload, max_retries=10):
    print("\n" + "-" * 50)
    print(f"👉 대상 단원: {payload['units']}")
    
    for attempt in range(1, max_retries + 1):
        if attempt > 1:
            print(f"🔄 재시도 중... ({attempt}/{max_retries})")
        print("⏳ AI 생성 진행 중... (제발 끄지 말고 기다려주세요!)")
        
        try:
            response = requests.post(API_URL, json=payload, timeout=120)
            if response.status_code == 200:
                result = response.json()
                mapped = result.get('mappedData', {})
                print(f"✅ 성공! (ID: {result.get('id')}) | 주제: {mapped.get('title')}")
                return True
            else:
                print(f"⚠️ 에러 발생 (코드: {response.status_code})")
                print(response.text)
                
                # 503 (Service Unavailable) 또는 429 (Rate Limit), 내부 500의 경우 백오프 재시도
                if response.status_code in [500, 503, 429]:
                    wait_time = attempt * 20  # 20초, 40초, 60초 등 극단적 선형 대기
                    print(f"⚡ 구글 API 서버 트래픽 과부하(Rate Limit) 감지. {wait_time}초 대기 후 다시 시도합니다...")
                    time.sleep(wait_time)
                    continue
                else:
                    return False
                    
        except requests.exceptions.ConnectionError:
            print("❌ 서버 연결 실패. 'npm run dev'가 켜져있는지 확인하세요.")
            return False
        except requests.exceptions.Timeout:
            print("⚠️ API 요청 시간 초과! (서버 응답 지연)")
            time.sleep(5)
            continue
        except Exception as e:
            print(f"❌ 알 수 없는 에러: {e}")
            return False
            
    print("❌ 최대 재시도 횟수를 초과하여 생성에 실패했습니다.")
    return False

def generate_single():
    print("\n[단일 맞춤 생성 모드]")
    curriculumType = input("1. 과목 유형 (예: 진로선택, 일반선택): ").strip()
    subject = input("2. 교과목명 (예: 물리학, 생명과학): ").strip()
    units = get_list_input("3. 단원 계층 정보 (콤마로 구분, 순서대로 입력. 예: II. 전기와 자기, 1. 자기장, 03. 전자기 유도): ")
    majors = get_list_input("4. 희망 전공 (콤마로 구분, 예: 전자공학과, 반도체공학과): ")

    if not all([curriculumType, subject, units, majors]):
        print("❌ 빈칸이 있습니다.")
        return

    payload = {
        "curriculumType": curriculumType,
        "subject": subject,
        "units": units,
        "majors": majors
    }
    call_api(payload)

def generate_batch():
    print("\n[과목 목차 자동 순회 (Batch) 생성 모드]")
    print(f"지원하는 수학 과목: {', '.join(MATH_CURRICULUM.keys())}")
    
    curriculumType = input("1. 과목 유형 (예: 진로선택, 일반선택): ").strip()
    subject = input("2. 교과목명 입력: ").strip()
    
    if subject not in MATH_CURRICULUM:
        print(f"❌ 아직 내장 목차 데이터에 '{subject}'이(가) 없습니다. 단일 생성 모드를 써주세요.")
        return

    majors = get_list_input("3. 일괄 적용할 희망 전공 (콤마로 구분): ")
    unit_list = MATH_CURRICULUM[subject]

    print(f"\n발견된 대단원 목차: {unit_list}")
    try:
        repeat_n = int(input("4. 각 단원별로 몇 개의 보고서를 연속으로 뽑을까요? (숫자만 입력): ").strip())
    except:
        print("❌ 숫자만 입력해주세요.")
        return

    if repeat_n < 1:
        return

    print("\n" + "=" * 60)
    print(f"🚀 총 {len(unit_list) * repeat_n} 개의 보고서 렌더링 작업을 스케줄합니다.")
    print("=" * 60)

    for unit in unit_list:
        for i in range(repeat_n):
            print(f"\n--- [ {unit} ] 단원 작업 ( {i+1} / {repeat_n} ) 시작 ---")
            payload = {
                "curriculumType": curriculumType,
                "subject": subject,
                "units": [unit],
                "majors": majors
            }
            success = call_api(payload)
            if not success:
                print("⚠️ 10번의 강력한 재시도까지 실패하여 이 단원의 작업을 중단하고 다음으로 넘어갑니다.")
                # 에러가 나도 스크립트 중단 대신 다른 단원으로 계속 진행
                continue
                
            # 연속 호출 시 Vercel 서버나 Gemini API 과부하 방지 안전 대기
            print(f"🚀 차기 요청 전 {SAFETY_DELAY}초 안전 대기 중 (Total Quota 관리)...")
            time.sleep(SAFETY_DELAY)

def main():
    print("=" * 60)
    print("🌟 세특 자동 생성 & Supabase 업로드 스크립트 🌟")
    print("=" * 60)
    
    while True:
        print("\n원하시는 작동 모드를 선택하세요:")
        print("1. 수동 단일 생성 (기존 방식 - 단원명 직접 입력)")
        print("2. 과목 단위 자동 순회 (수학 과목 단원별 n개 일괄 생성)")
        print("0. 종료")
        
        choice = input("입력: ").strip()
        if choice == '1':
            generate_single()
        elif choice == '2':
            generate_batch()
        elif choice == '0':
            print("안녕히가세요!")
            break
        else:
            print("잘못된 입력입니다.")

if __name__ == "__main__":
    main()

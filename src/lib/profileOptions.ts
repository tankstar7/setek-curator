// 온보딩 / 마이페이지에서 공통으로 사용하는 선택지 상수

export const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전",
  "광주", "울산", "세종", "강원", "충북", "충남",
  "경북", "경남", "전북", "전남", "제주", "기타",
] as const;

export const ROLES = [
  { value: "학생",  emoji: "🎒", desc: "고등학생 / 중학생" },
  { value: "교사",  emoji: "👨‍🏫", desc: "현직 교사 / 강사" },
  { value: "학부모", emoji: "👨‍👩‍👧", desc: "자녀의 세특 준비" },
  { value: "기타",  emoji: "👋",  desc: "기타 관심 있는 분" },
] as const;

export const DREAM_MAJORS = [
  { value: "공학계열",       emoji: "🔧" },
  { value: "의학/약학계열",  emoji: "🏥" },
  { value: "자연과학계열",   emoji: "🔬" },
  { value: "인문계열",       emoji: "📚" },
  { value: "사회/경영계열",  emoji: "📊" },
  { value: "교육계열",       emoji: "👨‍🏫" },
  { value: "예술/체육계열",  emoji: "🎨" },
  { value: "법학계열",       emoji: "⚖️" },
  { value: "농림수산계열",   emoji: "🌾" },
  { value: "미디어/디자인계열", emoji: "🎬" },
] as const;

export const INTEREST_SUBJECTS = [
  { value: "수학",       emoji: "📐" },
  { value: "물리학",     emoji: "⚡" },
  { value: "화학",       emoji: "🧪" },
  { value: "생명과학",   emoji: "🧬" },
  { value: "지구과학",   emoji: "🌍" },
  { value: "정보/컴퓨터", emoji: "💻" },
  { value: "국어/문학",  emoji: "📝" },
  { value: "영어",       emoji: "🌐" },
  { value: "한국사/역사", emoji: "📜" },
  { value: "사회/경제",  emoji: "🏛️" },
  { value: "윤리/철학",  emoji: "💭" },
  { value: "체육",       emoji: "🏃" },
  { value: "음악",       emoji: "🎵" },
  { value: "미술",       emoji: "🖌️" },
] as const;

export const ROLE_EMOJI: Record<string, string> = Object.fromEntries(
  ROLES.map((r) => [r.value, r.emoji])
);

export const MAJOR_EMOJI: Record<string, string> = Object.fromEntries(
  DREAM_MAJORS.map((m) => [m.value, m.emoji])
);

export const SUBJECT_EMOJI: Record<string, string> = Object.fromEntries(
  INTEREST_SUBJECTS.map((s) => [s.value, s.emoji])
);

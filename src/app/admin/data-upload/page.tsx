"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";

// ── 타입 정의 ─────────────────────────────────────────────────────────────────
interface CsvRow {
  대학명?: string;
  모집단위1?: string;   // 단과대 또는 학과명 (정제 대상)
  모집단위2?: string;   // 세부 전공명 (선택)
  핵심과목?: string;
  권장과목?: string;
  비고?: string;        // univ_subject_requirements.note 에 저장 (선택)
  [key: string]: string | undefined;
}

type LogLevel = "info" | "success" | "error" | "warn";

interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  time: string;
}

interface Summary {
  totalRows: number;
  processedRows: number;
  insertedRequirements: number;
  skippedSubjects: number;
  errors: number;
}

// ── 로그 레벨 스타일 ─────────────────────────────────────────────────────────
const LOG_STYLE: Record<LogLevel, string> = {
  info:    "text-slate-400",
  success: "text-green-400",
  error:   "text-red-400",
  warn:    "text-amber-400",
};
const LOG_PREFIX: Record<LogLevel, string> = {
  info:    "[ INFO ]",
  success: "[ OK   ]",
  error:   "[ ERR  ]",
  warn:    "[ WARN ]",
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────
let logIdSeq = 0;
function makeLog(level: LogLevel, message: string): LogEntry {
  return {
    id: ++logIdSeq,
    level,
    message,
    time: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
  };
}

// 쉼표 구분 문자열 → 빈칸 제거된 배열
function splitSubjects(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// 대학명 표준화: '대'로 끝나는 약칭 → '대학교' 추가
//   예) '서울대' → '서울대학교', '성균관대' → '성균관대학교'
//   이미 '대학교'로 끝나거나 특수 명칭(기술원·포스텍·카이스트 등)은 그대로 유지
function refineUnivName(raw: string | undefined): string {
  const name = raw?.trim() ?? "";
  if (!name) return "";
  if (name.endsWith("대학교")) return name;   // 이미 완전한 형태
  if (name.endsWith("대"))     return name + "학교"; // 약칭 → '대학교'
  return name;                                // 기술원·KAIST 등 특수 명칭
}

// 전공명 정제: 모집단위1(단과대/학과) + 모집단위2(세부전공) → 최종 major_name
// 규칙:
//   part2가 있으면 part1은 단과대로 간주 → '대학' 접미사 보장 후 합산
//   part2가 없으면 part1 그대로 사용
//   예) '공과', '기계공학' → '공과대학 기계공학'
//       '이과대학', '물리학과' → '이과대학 물리학과'
//       '컴퓨터공학과', '' → '컴퓨터공학과'
function refineMajorName(part1: string | undefined, part2: string | undefined): string {
  const p1 = part1?.trim() ?? "";
  const p2 = part2?.trim() ?? "";

  if (!p1) return p2;

  if (p2) {
    let college = p1;
    if (!p1.endsWith("대학")) {
      college = p1.endsWith("대") ? p1 + "학" : p1 + "대학";
    }
    return college + " " + p2;
  }

  return p1;
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default function DataUploadPage() {
  const [isDragging,   setIsDragging]   = useState(false);
  const [file,         setFile]         = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress,     setProgress]     = useState(0);          // 0–100
  const [phase,        setPhase]        = useState("");
  const [logs,         setLogs]         = useState<LogEntry[]>([]);
  const [summary,      setSummary]      = useState<Summary | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef    = useRef<HTMLDivElement>(null);

  // 로그 추가
  const addLog = useCallback((level: LogLevel, message: string) => {
    setLogs((prev) => [...prev, makeLog(level, message)]);
  }, []);

  // 로그창 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ── 파일 유효성 검사 ────────────────────────────────────────────────────
  const validateFile = (f: File): boolean => {
    if (!f.name.endsWith(".csv")) {
      addLog("error", `지원하지 않는 파일 형식: ${f.name} (CSV만 가능)`);
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      addLog("error", "파일 크기가 10MB를 초과합니다.");
      return false;
    }
    return true;
  };

  // ── Drag & Drop 핸들러 ───────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && validateFile(dropped)) setFile(dropped);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && validateFile(selected)) setFile(selected);
  };

  // ── 핵심 처리 로직 ───────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setSummary(null);

    addLog("info", `파일 파싱 시작: ${file.name}`);
    setPhase("CSV 파싱 중...");

    // ① CSV 파싱 ─────────────────────────────────────────────────────────
    const rows = await new Promise<CsvRow[]>((resolve) => {
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
        transform: (v) => v.trim(),
        complete: (result) => resolve(result.data),
        error: () => resolve([]),
      });
    });

    if (rows.length === 0) {
      addLog("error", "CSV 파싱 결과가 비어있습니다. 파일 형식을 확인하세요.");
      setIsProcessing(false);
      return;
    }

    // 필수 컬럼 확인
    const firstRow = rows[0];
    const requiredCols = ["대학명", "모집단위1", "핵심과목", "권장과목"];  // 모집단위2 는 선택
    const missing = requiredCols.filter((c) => !(c in firstRow));
    if (missing.length > 0) {
      addLog("error", `필수 컬럼 누락: ${missing.join(", ")}`);
      addLog("warn", `감지된 컬럼: ${Object.keys(firstRow).join(", ")}`);
      setIsProcessing(false);
      return;
    }

    addLog("success", `${rows.length}개 행 파싱 완료`);
    setProgress(5);

    // ── 유니크 값 수집 ────────────────────────────────────────────────────
    const univNames    = new Set<string>();
    const majorNames   = new Set<string>();
    const subjectNames = new Set<string>();

    for (const row of rows) {
      const univ  = refineUnivName(row["대학명"]);
      const major = refineMajorName(row["모집단위1"], row["모집단위2"]);
      if (univ)  univNames.add(univ);
      if (major) majorNames.add(major);
      splitSubjects(row["핵심과목"]).forEach((s) => subjectNames.add(s));
      splitSubjects(row["권장과목"]).forEach((s) => subjectNames.add(s));
    }

    addLog("info", `유니크 대학: ${univNames.size}개 | 전공: ${majorNames.size}개 | 과목: ${subjectNames.size}개`);

    // ② 대학 배치 Upsert ──────────────────────────────────────────────────
    setPhase("대학 Upsert 중...");
    addLog("info", `[1/4] universities 테이블 Upsert (${univNames.size}개)`);

    const univPayload = [...univNames].map((name) => ({ name }));
    const { data: univRows, error: univErr } = await supabase
      .from("universities")
      .upsert(univPayload, { onConflict: "name" })
      .select("id, name");

    if (univErr) {
      addLog("error", `universities Upsert 실패: ${univErr.message}`);
      setIsProcessing(false);
      return;
    }
    const univMap = new Map(univRows?.map((r) => [r.name as string, r.id as string]) ?? []);
    addLog("success", `universities Upsert 완료 (${univRows?.length ?? 0}개 반환)`);
    setProgress(25);

    // ③ 전공 배치 Upsert ──────────────────────────────────────────────────
    setPhase("전공 Upsert 중...");
    addLog("info", `[2/4] target_majors 테이블 Upsert (${majorNames.size}개)`);

    const majorPayload = [...majorNames].map((major_name) => ({ major_name }));
    const { data: majorRows, error: majorErr } = await supabase
      .from("target_majors")
      .upsert(majorPayload, { onConflict: "major_name" })
      .select("id, major_name");

    if (majorErr) {
      addLog("error", `target_majors Upsert 실패: ${majorErr.message}`);
      setIsProcessing(false);
      return;
    }
    const majorMap = new Map(majorRows?.map((r) => [r.major_name as string, r.id as string]) ?? []);
    addLog("success", `target_majors Upsert 완료 (${majorRows?.length ?? 0}개 반환)`);
    setProgress(50);

    // ④ 과목 배치 Upsert ──────────────────────────────────────────────────
    setPhase("과목 Upsert 중...");
    addLog("info", `[3/4] curriculum_subjects 테이블 Upsert (${subjectNames.size}개)`);

    const subjectPayload = [...subjectNames].map((name) => ({ name }));
    const { data: subjectRows, error: subjectErr } = await supabase
      .from("curriculum_subjects")
      .upsert(subjectPayload, { onConflict: "name" })
      .select("id, name");

    if (subjectErr) {
      addLog("error", `curriculum_subjects Upsert 실패: ${subjectErr.message}`);
      addLog("warn", "curriculum_subjects(name) 에 UNIQUE 제약이 없으면 이 오류가 발생합니다.");
      setIsProcessing(false);
      return;
    }
    const subjectMap = new Map(subjectRows?.map((r) => [r.name as string, r.id as string]) ?? []);
    addLog("success", `curriculum_subjects Upsert 완료 (${subjectRows?.length ?? 0}개 반환)`);
    setProgress(70);

    // ⑤ 매핑 데이터 생성 및 Insert ────────────────────────────────────────
    setPhase("요구사항 매핑 Insert 중...");
    addLog("info", `[4/4] univ_subject_requirements 매핑 삽입 시작`);

    type ReqRecord = {
      university_id:     string;
      major_id:          string;
      subject_id:        string;
      requirement_level: string;
      note:              string | null;
    };

    const requirements: ReqRecord[] = [];
    let skippedSubjects = 0;
    let skippedRows     = 0;

    for (const row of rows) {
      const univName  = refineUnivName(row["대학명"]);
      const majorName = refineMajorName(row["모집단위1"], row["모집단위2"]);
      const note      = row["비고"]?.trim() || null;

      if (!univName || !majorName) {
        addLog("warn", `빈 행 스킵: 대학명="${univName}" 모집단위="${majorName}"`);
        skippedRows++;
        continue;
      }

      const univId  = univMap.get(univName);
      const majorId = majorMap.get(majorName);

      if (!univId || !majorId) {
        addLog("warn", `ID를 찾을 수 없어 스킵: ${univName} / ${majorName}`);
        skippedRows++;
        continue;
      }

      const addSubjects = (subjects: string[], level: string) => {
        for (const subjectName of subjects) {
          const subjectId = subjectMap.get(subjectName);
          if (!subjectId) {
            addLog("warn", `과목 ID 없음 (스킵): "${subjectName}"`);
            skippedSubjects++;
            return;
          }
          requirements.push({
            university_id:     univId,
            major_id:          majorId,
            subject_id:        subjectId,
            requirement_level: level,
            note,
          });
        }
      };

      addSubjects(splitSubjects(row["핵심과목"]), "핵심");
      addSubjects(splitSubjects(row["권장과목"]), "권장");
    }

    addLog("info", `매핑 레코드 ${requirements.length}개 생성 (스킵 행: ${skippedRows}, 스킵 과목: ${skippedSubjects})`);

    // 배치 사이즈 500으로 나눠서 Insert
    const BATCH = 500;
    let insertedCount = 0;
    let errorCount    = 0;

    for (let i = 0; i < requirements.length; i += BATCH) {
      const chunk = requirements.slice(i, i + BATCH);
      const { error: reqErr } = await supabase
        .from("univ_subject_requirements")
        .upsert(chunk, { onConflict: "university_id,major_id,subject_id" });

      if (reqErr) {
        addLog("error", `배치 Insert 실패 (${i}–${i + chunk.length}): ${reqErr.message}`);
        errorCount += chunk.length;
      } else {
        insertedCount += chunk.length;
        addLog("success", `배치 ${Math.floor(i / BATCH) + 1} 완료: ${chunk.length}개 삽입`);
      }

      // 진행률 70%~100% 사이에서 배분
      setProgress(70 + Math.round((30 * (i + chunk.length)) / Math.max(requirements.length, 1)));
    }

    // ── 완료 ──────────────────────────────────────────────────────────────
    setProgress(100);
    setPhase("완료");

    const finalSummary: Summary = {
      totalRows:             rows.length,
      processedRows:         rows.length - skippedRows,
      insertedRequirements:  insertedCount,
      skippedSubjects,
      errors:                errorCount,
    };
    setSummary(finalSummary);

    if (errorCount === 0) {
      addLog("success", `✅ 업로드 완료: ${insertedCount}개 매핑 삽입 성공`);
    } else {
      addLog("warn", `⚠ 업로드 완료 (에러 ${errorCount}개 포함): ${insertedCount}개 성공`);
    }

    setIsProcessing(false);
  };

  // ── 초기화 ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setPhase("");
    setLogs([]);
    setSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── 헤더 ── */}
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
            Admin / Data Upload
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">대교협 과목 데이터 업로더</h1>
          <p className="mt-1 text-sm text-slate-500">
            CSV 파일을 업로드하면 <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">universities</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">target_majors</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">curriculum_subjects</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">univ_subject_requirements</code>에 자동 삽입됩니다.
          </p>
        </div>

        {/* ── CSV 포맷 안내 ── */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm">
          <p className="mb-2 font-bold text-blue-800">📋 필수 CSV 컬럼 형식</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-blue-200 text-blue-700">
                  {["대학명", "모집단위1 (단과대/학과)", "모집단위2 (세부전공, 선택)", "핵심과목", "권장과목", "비고 (선택)"].map((h) => (
                    <th key={h} className="py-1.5 pr-5 text-left font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-blue-900">
                <tr>
                  <td className="py-1 pr-5">성균관대</td>
                  <td className="py-1 pr-5">공과</td>
                  <td className="py-1 pr-5">기계공학</td>
                  <td className="py-1 pr-5">수학,물리학</td>
                  <td className="py-1 pr-5">미적분Ⅱ,기하</td>
                  <td className="py-1 pr-5">2024학년도 기준</td>
                </tr>
                <tr className="opacity-70">
                  <td className="py-1 pr-5">서울대학교</td>
                  <td className="py-1 pr-5">컴퓨터공학과</td>
                  <td className="py-1 pr-5"></td>
                  <td className="py-1 pr-5">수학,정보</td>
                  <td className="py-1 pr-5">인공지능</td>
                  <td className="py-1 pr-5"></td>
                </tr>
                <tr className="opacity-70">
                  <td className="py-1 pr-5">연세대</td>
                  <td className="py-1 pr-5">이과대학</td>
                  <td className="py-1 pr-5">물리학과</td>
                  <td className="py-1 pr-5">물리학,수학</td>
                  <td className="py-1 pr-5">전자기와 양자</td>
                  <td className="py-1 pr-5"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-blue-600">
            대학명 약칭(예: 서울대)은 자동으로 &apos;서울대학교&apos;로 표준화 |
            모집단위1 단과대 약칭(예: 공과)은 &apos;공과대학&apos;으로 표준화 |
            핵심·권장과목은 쉼표(,) 구분 | 비고 없으면 null 저장 | 중복 upsert 안전
          </p>
        </div>

        {/* ── 드래그 & 드롭 영역 ── */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all",
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : file
              ? "border-green-400 bg-green-50"
              : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50",
            isProcessing ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          {file ? (
            <>
              <span className="text-4xl">📄</span>
              <div>
                <p className="font-bold text-green-700">{file.name}</p>
                <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB — 업로드 준비 완료</p>
              </div>
            </>
          ) : (
            <>
              <span className="text-4xl">📂</span>
              <div>
                <p className="font-semibold text-slate-700">CSV 파일을 여기에 드래그하거나 클릭하여 선택</p>
                <p className="mt-1 text-xs text-slate-400">최대 10MB · .csv 파일만 지원</p>
              </div>
            </>
          )}
        </div>

        {/* ── 액션 버튼 ── */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                처리 중... {phase && `(${phase})`}
              </>
            ) : (
              "🚀 업로드 시작"
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
          >
            초기화
          </button>
        </div>

        {/* ── 프로그레스 바 ── */}
        {(isProcessing || progress > 0) && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">{phase || "대기 중"}</span>
              <span className={progress === 100 ? "text-green-600" : "text-blue-600"}>{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={[
                  "h-full rounded-full transition-all duration-300",
                  progress === 100 ? "bg-green-500" : "bg-blue-500",
                ].join(" ")}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── 요약 카드 ── */}
        {summary && (
          <div className={[
            "grid grid-cols-2 gap-3 rounded-2xl border p-5 sm:grid-cols-5",
            summary.errors === 0 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50",
          ].join(" ")}>
            {[
              { label: "전체 행",     value: summary.totalRows,            color: "text-slate-700" },
              { label: "처리 행",     value: summary.processedRows,        color: "text-blue-700" },
              { label: "삽입 매핑",   value: summary.insertedRequirements, color: "text-green-700" },
              { label: "스킵 과목",   value: summary.skippedSubjects,      color: "text-amber-600" },
              { label: "에러",        value: summary.errors,               color: "text-red-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── 로그 창 ── */}
        {logs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5">
              <span className="text-xs font-bold text-slate-400">처리 로그</span>
              <span className="text-xs text-slate-500">{logs.length}줄</span>
            </div>
            <div className="h-72 overflow-y-auto px-4 py-3 font-mono text-xs">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 leading-5">
                  <span className="shrink-0 text-slate-600">{log.time}</span>
                  <span className={`shrink-0 font-bold ${LOG_STYLE[log.level]}`}>
                    {LOG_PREFIX[log.level]}
                  </span>
                  <span className={LOG_STYLE[log.level]}>{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

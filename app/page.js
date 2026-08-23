"use client";

import { useState } from "react";
import { 
  RotateCcw, 
  Sparkles, 
  GraduationCap 
} from "lucide-react";

export default function SeatingPage() {
  const [step, setStep] = useState(1);
  const [lastNumber, setLastNumber] = useState("25");
  const [excluded, setExcluded] = useState([]);
  const [cols, setCols] = useState(5);
  const [disabledSeats, setDisabledSeats] = useState([]);
  const [seatingResult, setSeatingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secretRiggedMode, setSecretRiggedMode] = useState(false);

  const numericLastNumber = Math.max(1, parseInt(lastNumber) || 1);

  const validStudents = Array.from({ length: numericLastNumber }, (_, i) => i + 1).filter(
    (num) => !excluded.includes(num)
  );

  const studentCount = validStudents.length;

  const calculateTotalGridSlots = () => {
    let activeFound = 0;
    let index = 0;
    while (activeFound < studentCount) {
      if (!disabledSeats.includes(index)) {
        activeFound++;
      }
      index++;
    }
    const remainder = index % cols;
    return remainder === 0 ? index : index + (cols - remainder);
  };

  const totalGridSlots = calculateTotalGridSlots();

  const toggleExclude = (num) => {
    setExcluded((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const toggleSeatDisable = (index) => {
    setDisabledSeats((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAssignSeats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalStudents: validStudents,
          activeSeatsCount: studentCount,
          isRigged: secretRiggedMode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const resultMap = {};
        let studentIdx = 0;
        for (let i = 0; i < totalGridSlots; i++) {
          if (!disabledSeats.includes(i) && studentIdx < data.assignments.length) {
            resultMap[i] = data.assignments[studentIdx];
            studentIdx++;
          }
        }
        setSeatingResult(resultMap);
      }
    } catch (err) {
      alert("자리 배정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setSecretRiggedMode(!secretRiggedMode)} 
            className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl cursor-default transition shadow-inner select-none"
            title={secretRiggedMode ? "Seat Arrange" : "seat arrange"}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              클래스 자리 배치 시스템
            </h1>
            <p className="text-xs text-slate-400">빠르고 편리한 학급 좌석 관리 도구</p>
          </div>
        </div>

        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
          {[
            { id: 1, label: "1. 학생 설정" },
            { id: 2, label: "2. 배열 & 자리배치" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                step === item.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {step === 1 && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                출석번호 마지막 번호
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={lastNumber}
                onChange={(e) => setLastNumber(e.target.value)}
                onBlur={() => {
                  if (!lastNumber || parseInt(lastNumber) < 1) {
                    setLastNumber("1");
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                placeholder="마지막 번호를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                제외할 번호 선택 (전학/결번 클릭)
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 max-h-48 overflow-y-auto">
                {Array.from({ length: numericLastNumber }, (_, i) => i + 1).map((num) => {
                  const isExcluded = excluded.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => toggleExclude(num)}
                      className={`h-10 rounded-lg font-bold text-sm flex items-center justify-center transition ${
                        isExcluded
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 line-through"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-700 text-sm">
              <span className="text-slate-400">
                총 인원: <b className="text-indigo-400">{studentCount}</b>명
              </span>
              <button
                onClick={() => setStep(2)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
              >
                배열 설정으로 이동 →
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-300">열 (줄) 수:</span>
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                {[5, 6, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() => setCols(count)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      cols === count
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {count}줄
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDisabledSeats([])}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 제외석 초기화
              </button>
              <button
                onClick={handleAssignSeats}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition shadow-lg shadow-indigo-500/25"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "배치 생성 중..." : "자리 무작위 배치"}
              </button>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto py-3 bg-slate-800 border-2 border-slate-700/80 rounded-xl text-center shadow-lg">
            <span className="text-xs font-bold tracking-widest text-slate-400">교탁 / 칠판</span>
          </div>

          <div
            className="grid gap-3 p-6 bg-slate-950/60 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl justify-center items-center overflow-x-auto"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(70px, 90px))`,
            }}
          >
            {Array.from({ length: totalGridSlots }).map((_, idx) => {
              const isDisabled = disabledSeats.includes(idx);
              const assignedNum = seatingResult ? seatingResult[idx] : null;

              return (
                <div
                  key={idx}
                  onClick={() => toggleSeatDisable(idx)}
                  className={`h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 relative border ${
                    isDisabled
                      ? "bg-slate-900/40 border-slate-800 text-slate-600 border-dashed"
                      : assignedNum
                      ? "bg-indigo-600/20 border-indigo-500/80 text-white shadow-lg shadow-indigo-600/10 scale-100"
                      : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {isDisabled ? (
                    <span className="text-[11px] font-medium tracking-tight">제외석</span>
                  ) : assignedNum ? (
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-indigo-300">{assignedNum}</span>
                      <span className="text-[10px] text-indigo-400 font-medium">번 학생</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">책상</span>
                  )}

                  <span className="absolute bottom-1 right-1.5 text-[9px] text-slate-600 font-mono">
                    #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-500">
            사용하지 않을 좌석을 클릭하면 비활성화되며, 전체 인원수에 맞춰 맨 뒤에 책상이 자동 추가됩니다.
          </p>
        </div>
      )}
    </main>
  );
}

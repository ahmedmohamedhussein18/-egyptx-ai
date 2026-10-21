"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Lang = "ar" | "en";

interface PuzzleTheme {
  id: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  // Remote high-resolution source (Wikimedia Commons) with local fallback
  remote: (width: number) => string;
  fallback: string;
}

const commons = (file: string) => (width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const THEMES: PuzzleTheme[] = [
  {
    id: "giza",
    name: { ar: "أهرامات الجيزة", en: "Giza Pyramids" },
    desc: { ar: "عجيبة الدنيا القديمة الباقية", en: "The last surviving ancient wonder" },
    remote: commons("All_Gizah_Pyramids.jpg"),
    fallback: "/giza-puzzle.jpg",
  },
  {
    id: "karnak",
    name: { ar: "معبد الكرنك", en: "Karnak Temple" },
    desc: { ar: "أكبر دار عبادة في التاريخ", en: "The largest temple complex ever built" },
    remote: commons("Karnak_Temple.jpg"),
    fallback: "/karnak-puzzle.jpg",
  },
  {
    id: "mask",
    name: { ar: "قناع توت عنخ آمون الذهبي", en: "Tutankhamun Golden Mask" },
    desc: { ar: "كنز الملك الذهبي الأشهر", en: "The most famous royal treasure" },
    remote: commons("The golden mask of Pharaoh Tutankhamun.jpg"),
    fallback: "/sphinx-puzzle.jpg",
  },
];

const T = {
  ar: {
    title: "بازل المصريات 🧩",
    subtitle: "حرّك القطع المجاورة للفراغ لإعادة بناء الصورة الأثرية",
    choose: "اختر صورة",
    start: "ابدأ اللعب",
    shuffle: "خلط",
    moves: "عدد الحركات",
    time: "الوقت",
    sec: "ث",
    xp: "نقاط الخبرة",
    reset: "🔄 مسح النقاط",
    preview: "معاينة الصورة",
    hint: "اضغط أو اسحب القطعة المجاورة للفراغ",
    validate: "تحقق",
    scanning: "جارِ فحص اللوحة بالذكاء الاصطناعي...",
    correct: "عقلك المبدع بيكبر كل يوم! 🧠",
    wrong: "الغلط بيساعدنا نتعلّم ونكبر! 🌱",
    xpReward: "+50 نقطة خبرة",
    playAgain: "العب مرة أخرى 🔄",
    loading: "جارِ تحميل الصورة...",
    empty: "فراغ",
    lang: "English",
  },
  en: {
    title: "Egyptian Sliding Puzzle 🧩",
    subtitle: "Slide the tiles next to the gap to rebuild the ancient image",
    choose: "Choose an image",
    start: "Start Playing",
    shuffle: "Shuffle",
    moves: "Moves",
    time: "Time",
    sec: "s",
    xp: "XP Points",
    reset: "🔄 Reset Points",
    preview: "Preview image",
    hint: "Tap or drag a tile next to the gap",
    validate: "Check",
    scanning: "AI is scanning the board...",
    correct: "Your creative mind grows every day! 🧠",
    wrong: "Mistakes help us learn and grow! 🌱",
    xpReward: "+50 XP",
    playAgain: "Play Again 🔄",
    loading: "Loading image...",
    empty: "Gap",
    lang: "عربي",
  },
} as const;

const EMPTY = 8;
const SOLVED = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const XP_KEY = "egyptx_kids_xp";
const BADGES_KEY = "egyptx_kids_badges";

const isAdjacent = (a: number, b: number) =>
  Math.abs(Math.floor(a / 3) - Math.floor(b / 3)) + Math.abs((a % 3) - (b % 3)) === 1;

const isSolved = (b: number[]) => b.every((v, i) => v === i);

// Shuffle by simulating legal moves from the solved state => always solvable
function makeShuffledBoard(steps = 90): number[] {
  const board = [...SOLVED];
  let empty = EMPTY;
  let prev = -1;
  for (let s = 0; s < steps; s++) {
    const r = Math.floor(empty / 3);
    const c = empty % 3;
    const neighbors: number[] = [];
    if (r > 0) neighbors.push(empty - 3);
    if (r < 2) neighbors.push(empty + 3);
    if (c > 0) neighbors.push(empty - 1);
    if (c < 2) neighbors.push(empty + 1);
    const options = neighbors.filter((n) => n !== prev);
    const pick = options[Math.floor(Math.random() * options.length)];
    board[empty] = board[pick];
    board[pick] = EMPTY;
    prev = empty;
    empty = pick;
  }
  if (isSolved(board)) {
    const n = empty === 8 ? 7 : empty + 1;
    board[empty] = board[n];
    board[n] = EMPTY;
  }
  return board;
}

export default function KidsSlidingPuzzle() {
  const [lang, setLang] = useState<Lang>("ar");
  const [themeId, setThemeId] = useState<string>(THEMES[0].id);
  const [board, setBoard] = useState<number[]>(SOLVED);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [solvedDone, setSolvedDone] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [xp, setXp] = useState(140);
  const [failedThemes, setFailedThemes] = useState<Record<string, boolean>>({});
  const [imgAspect, setImgAspect] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const dragFrom = useRef<number | null>(null);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = T[lang];
  const theme = THEMES.find((x) => x.id === themeId) ?? THEMES[0];
  const srcFor = useCallback(
    (th: PuzzleTheme, width: number) => (failedThemes[th.id] ? th.fallback : th.remote(width)),
    [failedThemes]
  );
  const boardSrc = srcFor(theme, 900);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Load persisted XP
  useEffect(() => {
    try {
      const saved = localStorage.getItem(XP_KEY);
      if (saved) setXp(parseInt(saved, 10) || 0);
    } catch (e) {
      console.warn("Storage warning", e);
    }
  }, []);

  // Preload active image (detect failure + natural aspect ratio for accurate square cropping)
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      setImgAspect((p) => ({ ...p, [theme.id + boardSrc]: img.naturalWidth / img.naturalHeight }));
      setLoaded((p) => ({ ...p, [theme.id + boardSrc]: true }));
    };
    img.onerror = () => {
      if (cancelled) return;
      if (!failedThemes[theme.id]) setFailedThemes((p) => ({ ...p, [theme.id]: true }));
    };
    img.src = boardSrc;
    return () => {
      cancelled = true;
    };
  }, [theme.id, boardSrc, failedThemes]);

  // Timer
  useEffect(() => {
    if (!playing || solvedDone) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [playing, solvedDone]);

  useEffect(() => {
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, []);

  const awardXp = useCallback(() => {
    try {
      const current = parseInt(localStorage.getItem(XP_KEY) || "140", 10) || 0;
      const next = current + 50;
      localStorage.setItem(XP_KEY, String(next));
      setXp(next);
      const badges: string[] = JSON.parse(localStorage.getItem(BADGES_KEY) || '["Pyramid Builder"]');
      if (!badges.includes("Puzzle Master")) {
        badges.push("Puzzle Master");
        localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
      }
    } catch (e) {
      console.warn("Storage warning", e);
    }
  }, []);

  // 1.5s AI scanner, then evaluate the board
  const runScan = useCallback(
    (currentBoard: number[]) => {
      setScanning(true);
      setResult(null);
      if (scanTimer.current) clearTimeout(scanTimer.current);
      scanTimer.current = setTimeout(() => {
        setScanning(false);
        if (isSolved(currentBoard)) {
          setResult("correct");
          setSolvedDone(true);
          setPlaying(false);
          awardXp();
        } else {
          setResult("incorrect");
        }
      }, 1500);
    },
    [awardXp]
  );

  const shuffle = useCallback(() => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    setBoard(makeShuffledBoard());
    setMoves(0);
    setSeconds(0);
    setPlaying(true);
    setSolvedDone(false);
    setScanning(false);
    setResult(null);
    setShowPreview(false);
  }, []);

  const selectTheme = (id: string) => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    setThemeId(id);
    setBoard(SOLVED);
    setMoves(0);
    setSeconds(0);
    setPlaying(false);
    setSolvedDone(false);
    setScanning(false);
    setResult(null);
  };

  const moveTile = useCallback(
    (idx: number) => {
      if (!playing || scanning || solvedDone) return;
      const empty = board.indexOf(EMPTY);
      if (!isAdjacent(idx, empty)) return;
      const next = [...board];
      next[empty] = next[idx];
      next[idx] = EMPTY;
      setBoard(next);
      setMoves((m) => m + 1);
      setResult(null);
      if (isSolved(next)) runScan(next); // auto-validate when completed
    },
    [board, playing, scanning, solvedDone, runScan]
  );

  const handleValidate = () => {
    if (!playing || scanning || solvedDone || moves === 0) return;
    runScan(board);
  };

  const resetPoints = () => {
    setXp(0);
    try {
      localStorage.removeItem(XP_KEY);
      localStorage.removeItem(BADGES_KEY);
    } catch (e) {
      console.warn("Storage warning", e);
    }
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!playing) return;
      const empty = board.indexOf(EMPTY);
      const r = Math.floor(empty / 3);
      const c = empty % 3;
      let target = -1;
      if (e.key === "ArrowUp" && r < 2) target = empty + 3;
      else if (e.key === "ArrowDown" && r > 0) target = empty - 3;
      else if (e.key === "ArrowLeft" && c < 2) target = empty + 1;
      else if (e.key === "ArrowRight" && c > 0) target = empty - 1;
      if (target !== -1) {
        e.preventDefault();
        moveTile(target);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, playing, moveTile]);

  // Accurate cover-crop slice for each tile (works for non-square images)
  const aspect = imgAspect[theme.id + boardSrc] ?? 1;
  const mx = Math.max(1, aspect);
  const my = Math.max(1, 1 / aspect);
  const tileStyle = (val: number): React.CSSProperties => {
    const col = val % 3;
    const row = Math.floor(val / 3);
    const px = (col + 1.5 * (mx - 1)) / (3 * mx - 1);
    const py = (row + 1.5 * (my - 1)) / (3 * my - 1);
    return {
      backgroundImage: `url("${boardSrc}")`,
      backgroundSize: `${300 * mx}% ${300 * my}%`,
      backgroundPosition: `${px * 100}% ${py * 100}%`,
      backgroundRepeat: "no-repeat",
    };
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const imgReady = !!loaded[theme.id + boardSrc];

  return (
    <div
      dir={dir}
      className="w-full bg-[#070D1F] text-[#F3F4F6] py-8 px-4 sm:px-6 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#1B6B93]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Local counter bar (single source of XP in kids mode) */}
      <div className="max-w-3xl mx-auto mb-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111C38] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-[#D4AF37]">{t.title}</h2>
          <p className="text-[11px] text-gray-300">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 bg-[#070D1F] px-4 py-2 rounded-xl border border-[#D4AF37]/30">
          <div>
            <span className="text-[10px] text-gray-400 block">{t.xp}</span>
            <span className="text-base font-bold text-[#D4AF37]">{xp}</span>
          </div>
          <button
            type="button"
            onClick={resetPoints}
            className="text-[11px] bg-rose-950/60 hover:bg-rose-900 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-800 transition-colors cursor-pointer"
          >
            {t.reset}
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="text-[11px] bg-[#D4AF37] text-[#070D1F] font-bold px-3 py-1 rounded-lg cursor-pointer"
          >
            {t.lang}
          </button>
        </div>
      </div>

      {/* Theme selector */}
      <div className="max-w-3xl mx-auto mb-6 relative z-10">
        <span className="text-xs font-bold text-gray-300 block mb-2">🖼️ {t.choose}</span>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((th) => {
            const active = th.id === themeId;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => selectTheme(th.id)}
                className={`rounded-2xl p-2 transition-all cursor-pointer text-start overflow-hidden ${
                  active
                    ? "bg-[#111C38] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                    : "bg-[#0A1022]/80 border border-gray-800 hover:border-[#D4AF37]/50"
                }`}
              >
                <div className="w-full h-20 sm:h-24 rounded-xl overflow-hidden bg-[#0A1022] border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={srcFor(th, 400)}
                    alt={th.name[lang]}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedThemes((p) => (p[th.id] ? p : { ...p, [th.id]: true }))}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className={`text-[11px] sm:text-xs font-bold mt-2 leading-tight ${active ? "text-[#D4AF37]" : "text-white"}`}>
                  {th.name[lang]}
                </h4>
                <p className="hidden sm:block text-[10px] text-gray-400 line-clamp-1">{th.desc[lang]}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats right above the board */}
      <div className="max-w-sm mx-auto mb-4 relative z-10 flex items-center justify-between gap-3 bg-[#111C38] border border-[#D4AF37]/30 rounded-2xl p-3 shadow-xl">
        <div className="text-center flex-1">
          <span className="text-[10px] text-gray-400 block">{t.moves}</span>
          <span className="text-lg font-extrabold text-[#D4AF37]">{moves}</span>
        </div>
        <div className="h-8 w-px bg-gray-700" />
        <div className="text-center flex-1">
          <span className="text-[10px] text-gray-400 block">{t.time}</span>
          <span className="text-lg font-extrabold text-teal-300" dir="ltr">
            {seconds}
            {t.sec}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            title={t.preview}
            className="p-2 rounded-xl bg-[#070D1F] border border-gray-700 hover:border-[#D4AF37] transition-all cursor-pointer text-sm"
          >
            👁️
          </button>
          <button
            type="button"
            onClick={shuffle}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2C974] text-[#070D1F] font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            {t.shuffle}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-sm mx-auto mb-4 overflow-hidden relative z-10"
          >
            <div className="p-2 bg-[#111C38] border border-[#D4AF37]/50 rounded-2xl flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={boardSrc} alt={theme.name[lang]} referrerPolicy="no-referrer" className="w-56 h-56 object-cover rounded-xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board + circular validation button */}
      <div className="flex flex-col items-center relative z-10">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <div className="relative p-3 sm:p-4 bg-[#111C38]/90 rounded-3xl border-2 border-[#D4AF37]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div dir="ltr" className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {board.map((val, idx) => {
                const empty = val === EMPTY;
                return (
                  <div
                    key={idx}
                    draggable={!empty && playing}
                    onDragStart={() => {
                      dragFrom.current = idx;
                    }}
                    onDragOver={(e) => {
                      if (empty) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (empty && dragFrom.current !== null) moveTile(dragFrom.current);
                      dragFrom.current = null;
                    }}
                    onClick={() => (empty ? undefined : playing ? moveTile(idx) : shuffle())}
                    style={{ ...(empty ? {} : tileStyle(val)), transition: "all 0.15s ease" }}
                    className={`w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] rounded-xl relative overflow-hidden select-none flex items-center justify-center ${
                      empty
                        ? "bg-[#0A1022] border-2 border-[#D4AF37]/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_0_14px_rgba(212,175,55,0.35)]"
                        : "border-2 border-[#D4AF37]/70 hover:border-[#D4AF37] shadow-lg cursor-pointer active:scale-95"
                    }`}
                  >
                    {empty ? (
                      <span className="text-[10px] text-[#D4AF37]/60 font-semibold">✨ {t.empty}</span>
                    ) : (
                      <span className="absolute top-1 end-1 bg-[#070D1F]/80 text-[#D4AF37] text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#D4AF37]/40 pointer-events-none">
                        {val + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Image loading veil */}
            {!imgReady && (
              <div className="absolute inset-0 rounded-3xl bg-[#070D1F]/80 flex items-center justify-center z-10">
                <span className="text-xs text-[#D4AF37] animate-pulse">{t.loading}</span>
              </div>
            )}

            {/* AI scanner laser */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-3xl bg-[#070D1F]/55 z-20 overflow-hidden pointer-events-none"
                >
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#4CC9F0] shadow-[0_0_18px_6px_rgba(76,201,240,0.8)]"
                  />
                  <div className="absolute bottom-2 inset-x-0 text-center text-[11px] font-bold text-[#4CC9F0] animate-pulse">
                    {t.scanning}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Small circular validation button (no text) */}
          <button
            type="button"
            onClick={handleValidate}
            disabled={!playing || scanning || solvedDone || moves === 0}
            title={t.validate}
            aria-label={t.validate}
            className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 border-2 border-white/60 shadow-xl flex items-center justify-center text-xl text-white transition-all cursor-pointer hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            ✓
          </button>
        </div>

        {!playing && !solvedDone && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={shuffle}
              className="bg-gradient-to-r from-[#D4AF37] to-[#E2C974] text-[#070D1F] font-extrabold px-8 py-3 rounded-2xl text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              🎮 {t.start}
            </button>
            <p className="text-[11px] text-gray-400 mt-2">{t.hint}</p>
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {result === "correct" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 w-full max-w-sm p-5 bg-emerald-950/70 border-2 border-emerald-500/70 rounded-2xl text-center shadow-2xl"
            >
              <p className="text-base font-extrabold text-emerald-200 mb-3">{t.correct}</p>
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="bg-[#070D1F] rounded-xl p-2 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">{t.moves}</span>
                  <b className="text-[#D4AF37]">{moves}</b>
                </div>
                <div className="bg-[#070D1F] rounded-xl p-2 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">{t.time}</span>
                  <b className="text-teal-300" dir="ltr">
                    {fmt(seconds)}
                  </b>
                </div>
                <div className="bg-[#070D1F] rounded-xl p-2 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">XP</span>
                  <b className="text-emerald-300" dir="ltr">
                    {t.xpReward}
                  </b>
                </div>
              </div>
              <button
                type="button"
                onClick={shuffle}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E2C974] text-[#070D1F] font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                {t.playAgain}
              </button>
            </motion.div>
          )}
          {result === "incorrect" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 w-full max-w-sm p-4 bg-rose-950/70 border-2 border-rose-500/70 rounded-2xl text-center text-rose-200 text-sm font-bold shadow-2xl"
            >
              {t.wrong}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

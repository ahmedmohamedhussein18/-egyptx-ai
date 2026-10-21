'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

const gods = [
  { id: 1, name: 'رع', nameEn: 'Ra', image: '/images/gods/ra.png', color: '#FFD700', description: 'God of the Sun' },
  { id: 2, name: 'أنوبيس', nameEn: 'Anubis', image: '/images/gods/anubis.png', color: '#1a1a2e', description: 'Guardian of the Dead' },
  { id: 3, name: 'إيزيس', nameEn: 'Isis', image: '/images/gods/isis.png', color: '#4B0082', description: 'Goddess of Magic' },
  { id: 4, name: 'حورس', nameEn: 'Horus', image: '/images/gods/horus.png', color: '#1B6B93', description: 'God of the Sky' },
  { id: 5, name: 'أوزيريس', nameEn: 'Osiris', image: '/images/gods/osiris.png', color: '#2E8B57', description: 'God of Life' },
  { id: 6, name: 'ست', nameEn: 'Set', image: '/images/gods/set.png', color: '#8B0000', description: 'God of Storms' },
  { id: 7, name: 'تحوت', nameEn: 'Thoth', image: '/images/gods/thoth.png', color: '#483D8B', description: 'God of Wisdom' },
  { id: 8, name: 'باست', nameEn: 'Bastet', image: '/images/gods/bastet.png', color: '#8B4513', description: 'Goddess of Cats' },
];

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy 😊', pairs: 4 },
  { key: 'medium', label: 'Medium 🤔', pairs: 6 },
  { key: 'hard', label: 'Hard 🔥', pairs: 8 },
] as const;

const WIN_MESSAGES = [
  'Genius! You know all Egyptian Gods! 🌟',
  'Amazing! Smart as a Pharaoh! 👑',
  'Excellent! Isis is proud of you! ✨',
];

interface CardItem {
  uid: number;
  godId: number;
}

/** Fisher-Yates shuffle (returns a new array). */
function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck(pairs: number): CardItem[] {
  const picked = shuffle(gods).slice(0, pairs);
  const deck = picked.flatMap((g) => [g.id, g.id]);
  return shuffle(deck).map((godId, uid) => ({ uid, godId }));
}

function starsFor(attempts: number): number {
  if (attempts < 20) return 3;
  if (attempts <= 35) return 2;
  return 1;
}

export default function GodsMemoryMatch() {
  const [pairsCount, setPairsCount] = useState<number | null>(null);
  const [deck, setDeck] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [toast, setToast] = useState(false);
  const [won, setWon] = useState(false);
  const [winMessage, setWinMessage] = useState(WIN_MESSAGES[0]);
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const isProcessing = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const playing = pairsCount !== null && !won;
  const matchedPairs = matched.length / 2;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(setTimeout(fn, ms));
  };

  // ---- Sound (Web Audio API) ----
  const tone = useCallback((freq: number, start: number, dur: number, type: OscillatorType = 'sine', endFreq?: number) => {
    try {
      if (!audioRef.current) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        audioRef.current = new Ctor();
      }
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = ctx.currentTime + start;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (endFreq) osc.frequency.linearRampToValueAtTime(endFreq, t0 + dur);
      gain.gain.setValueAtTime(0.15, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur);
    } catch {
      /* audio is optional */
    }
  }, []);

  const soundFlip = useCallback(() => tone(700, 0, 0.06, 'square'), [tone]);
  const soundMatch = useCallback(() => {
    tone(523, 0, 0.12, 'triangle');
    tone(659, 0.12, 0.12, 'triangle');
    tone(784, 0.24, 0.2, 'triangle');
  }, [tone]);
  const soundWrong = useCallback(() => tone(300, 0, 0.35, 'sawtooth', 120), [tone]);
  const soundWin = useCallback(() => {
    [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.16, 0.2, 'square'));
  }, [tone]);

  const startGame = useCallback((pairs: number) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    isProcessing.current = false;
    setPairsCount(pairs);
    setDeck(buildDeck(pairs));
    setFlipped([]);
    setMatched([]);
    setWrong([]);
    setAttempts(0);
    setScore(0);
    setSeconds(0);
    setToast(false);
    setWon(false);
  }, []);

  const backToMenu = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    isProcessing.current = false;
    setPairsCount(null);
    setDeck([]);
    setWon(false);
  }, []);

  const handleCardClick = (index: number) => {
    if (isProcessing.current || won) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    soundFlip();
    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length < 2) return;

    isProcessing.current = true;
    const [a, b] = nextFlipped;
    setAttempts((n) => n + 1);

    if (deck[a].godId === deck[b].godId) {
      later(() => {
        soundMatch();
        const nextMatched = [...matched, a, b];
        setMatched(nextMatched);
        setScore((s) => s + 10);
        setFlipped([]);
        setToast(true);
        later(() => setToast(false), 1000);
        if (nextMatched.length === deck.length) {
          later(() => {
            setWinMessage(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
            setWon(true);
            soundWin();
          }, 700);
        }
        isProcessing.current = false;
      }, 500);
    } else {
      later(() => {
        setWrong([a, b]);
        soundWrong();
      }, 500);
      later(() => {
        setWrong([]);
        setFlipped([]);
        isProcessing.current = false;
      }, 1500);
    }
  };

  const stars = starsFor(attempts);
  const godById = (id: number) => gods.find((g) => g.id === id)!;

  return (
    <section
      id="gods-memory-match"
      dir="ltr"
      className="bg-[#0A1628] border border-[#C9A84C]/40 rounded-2xl p-5 md:p-8 shadow-xl text-white"
    >
      <style>{`
        .gmm-card{width:80px;height:110px;perspective:800px}
        @media (min-width:640px){.gmm-card{width:100px;height:140px}}
        .gmm-inner{position:relative;width:100%;height:100%;transition:transform .5s;transform-style:preserve-3d}
        .gmm-inner.flipped{transform:rotateY(180deg)}
        .gmm-face{position:absolute;inset:0;border-radius:12px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
        .gmm-front{background:#0A1628;border:2px solid #C9A84C;box-shadow:0 0 10px rgba(201,168,76,.35);
          background-image:repeating-linear-gradient(45deg,rgba(201,168,76,.12) 0 2px,transparent 2px 10px),repeating-linear-gradient(-45deg,rgba(201,168,76,.08) 0 2px,transparent 2px 10px);
          background-size:20px 20px;animation:gmm-pattern 6s linear infinite;display:flex;align-items:center;justify-content:center}
        .gmm-wrap:hover .gmm-front{box-shadow:0 0 22px rgba(201,168,76,.9)}
        .gmm-wrap:hover:not(.gmm-locked){transform:scale(1.05)}
        .gmm-wrap{transition:transform .2s}
        .gmm-back{transform:rotateY(180deg);border:2px solid rgba(255,255,255,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:4px;text-align:center}
        .gmm-matched .gmm-back{border-color:#C9A84C;animation:gmm-glow 1.6s ease-in-out infinite}
        .gmm-matched{animation:gmm-float 2.4s ease-in-out infinite}
        .gmm-matched .gmm-back::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);background-size:200% 100%;animation:gmm-shimmer 2.2s linear infinite;pointer-events:none}
        .gmm-wrong{animation:gmm-shake .5s ease}
        @keyframes gmm-pattern{from{background-position:0 0}to{background-position:20px 20px}}
        @keyframes gmm-glow{0%,100%{box-shadow:0 0 8px rgba(201,168,76,.5)}50%{box-shadow:0 0 24px rgba(201,168,76,1)}}
        @keyframes gmm-float{0%,100%{translate:0 0}50%{translate:0 -4px}}
        @keyframes gmm-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
        @keyframes gmm-shake{0%,100%{translate:0}20%{translate:-6px}40%{translate:6px}60%{translate:-5px}80%{translate:5px}}
        @keyframes gmm-sparkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.25)}}
        @keyframes gmm-toast{0%{opacity:0;transform:translateY(10px)}20%,80%{opacity:1;transform:translateY(0)}100%{opacity:0}}
        @keyframes gmm-fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:.2}}
        @keyframes gmm-trophy{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.12)}}
        @keyframes gmm-star{0%{transform:scale(0) rotate(-90deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
      `}</style>

      <h2 className="text-2xl md:text-3xl font-bold text-[#C9A84C] text-center mb-1">
        <span className="inline-block" style={{ animation: 'gmm-sparkle 1.6s ease-in-out infinite' }}>🃏</span> Gods Memory Match{' '}
        <span className="inline-block" style={{ animation: 'gmm-sparkle 1.6s ease-in-out .5s infinite' }}>✨</span>
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6">Match the Egyptian gods! 🃏</p>

      {/* Difficulty selector */}
      {pairsCount === null && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-300 font-bold">Choose difficulty</p>
          <div className="flex flex-wrap justify-center gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                type="button"
                id={`gmm-difficulty-${d.key}`}
                onClick={() => startGame(d.pairs)}
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-[#C9A84C] hover:text-[#0A1628] border border-[#C9A84C]/60 text-[#C9A84C] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {d.label}
                <span className="block text-xs font-normal opacity-80">{d.pairs} pairs</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game */}
      {pairsCount !== null && (
        <div className="flex flex-col items-center gap-5 relative">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/30">
              Pairs: {matchedPairs}/{pairsCount}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/30">Attempts: {attempts}</span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/30">Time: {seconds} sec</span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/30 text-[#C9A84C]" aria-label={`${stars} stars`}>
              {'★'.repeat(stars)}
              <span className="text-gray-600">{'★'.repeat(3 - stars)}</span>
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/30">Score: {score}</span>
            <button
              type="button"
              onClick={backToMenu}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#C9A84C]/50 text-[#C9A84C] cursor-pointer transition-colors"
            >
              Change Level
            </button>
          </div>

          {toast && (
            <div
              className="absolute -top-2 z-10 px-5 py-2 rounded-full bg-[#C9A84C] text-[#0A1628] font-bold shadow-xl"
              style={{ animation: 'gmm-toast 1s ease forwards' }}
            >
              ✨ Amazing!
            </div>
          )}

          <div dir="ltr" className="grid grid-cols-4 gap-3 justify-center">
            {deck.map((card, index) => {
              const god = godById(card.godId);
              const isMatched = matched.includes(index);
              const isFlipped = isMatched || flipped.includes(index);
              const isWrong = wrong.includes(index);
              return (
                <button
                  type="button"
                  key={card.uid}
                  onClick={() => handleCardClick(index)}
                  aria-label={isFlipped ? god.nameEn : 'Hidden card'}
                  className={`gmm-wrap gmm-card p-0 bg-transparent border-0 cursor-pointer ${isFlipped ? 'gmm-locked' : ''} ${
                    isMatched ? 'gmm-matched' : ''
                  } ${isWrong ? 'gmm-wrong' : ''}`}
                >
                  <div className={`gmm-inner ${isFlipped ? 'flipped' : ''}`}>
                    <div className="gmm-face gmm-front">
                      <svg viewBox="0 0 64 40" width="52" height="34" aria-hidden="true">
                        <path d="M4 20 Q32 -4 60 20 Q32 44 4 20Z" fill="none" stroke="#C9A84C" strokeWidth="2.5" />
                        <circle cx="32" cy="20" r="8" fill="#C9A84C" />
                        <circle cx="32" cy="20" r="3.5" fill="#0A1628" />
                        <path d="M32 28 L26 38 M32 28 Q40 32 44 38" stroke="#C9A84C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div
                      className="gmm-face gmm-back"
                      style={{ background: `linear-gradient(160deg, ${god.color}, #0A1628 130%)` }}
                    >
                      {failedImages.includes(god.id) ? (
                        <div
                          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-1 sm:mb-2 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#C9A84C] border-2 border-[#C9A84C] bg-[#0A1628]/60"
                          aria-hidden="true"
                        >
                          {god.nameEn.charAt(0)}
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={god.image}
                          alt={god.nameEn}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-1 sm:mb-2"
                          onError={() => setFailedImages((prev) => (prev.includes(god.id) ? prev : [...prev, god.id]))}
                        />
                      )}
                      <span
                        className="font-bold text-sm sm:text-lg leading-tight"
                        style={{ color: god.id === 1 ? '#0A1628' : '#fff' }}
                      >
                        {god.nameEn}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs leading-tight"
                        dir="rtl"
                        style={{ color: god.id === 1 ? '#3a2f00' : 'rgba(255,255,255,.9)' }}
                      >
                        {god.name}
                      </span>
                      <span
                        className="text-[9px] sm:text-[10px] leading-tight"
                        style={{ color: god.id === 1 ? '#3a2f00' : 'rgba(255,255,255,.8)' }}
                      >
                        {god.description}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Win screen */}
      {won && (
        <div className="fixed inset-0 z-50 bg-[#0A1628]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 block rounded-sm"
              style={{
                left: `${(i * 89) % 100}%`,
                width: 6 + (i % 4) * 3,
                height: 10 + (i % 3) * 4,
                background: i % 2 ? '#C9A84C' : '#FFD700',
                animation: `gmm-fall ${3 + (i % 5) * 0.6}s linear ${(i % 9) * 0.3}s infinite`,
              }}
            />
          ))}
          <div className="text-7xl mb-3" style={{ animation: 'gmm-trophy 1.6s ease-in-out infinite' }}>🏆</div>
          <h3 className="text-2xl sm:text-4xl font-bold text-[#C9A84C] mb-4">You're a Champion! 🎉</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-4 text-sm font-bold">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/40">
              Pairs: {matchedPairs}/{pairsCount}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/40">Attempts: {attempts}</span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-[#C9A84C]/40">Time: {seconds} sec</span>
          </div>
          <p className="text-emerald-300 mb-3">
            Solved in {attempts} moves and {seconds} seconds
          </p>
          <div className="flex gap-2 text-5xl mb-4" dir="ltr">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                style={{
                  color: n <= stars ? '#FFD700' : '#374151',
                  textShadow: n <= stars ? '0 0 18px rgba(255,215,0,.9)' : 'none',
                  animation: n <= stars ? `gmm-star .5s ease ${n * 0.25}s both` : undefined,
                }}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xl text-white mb-6">{winMessage}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => pairsCount && startGame(pairsCount)}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#E2C974] text-[#0A1628] font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl"
            >
              Play Again 🔄
            </button>
            <button
              type="button"
              className="px-8 py-3 rounded-2xl bg-white/5 border border-[#C9A84C]/60 text-[#C9A84C] font-bold hover:bg-white/10 transition-all cursor-pointer"
            >
              Share Achievement 🎊
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

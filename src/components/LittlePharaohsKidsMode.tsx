"use client";

import React, { useState, useEffect, useCallback } from "react";

const PUZZLE_IMAGES = [
  {
    id: "sphinx",
    nameAr: "تمثال أبو الهول والأهرامات",
    nameEn: "Sphinx & Pyramids",
    url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80",
    fallback: "/sphinx.jpg"
  },
  {
    id: "giza",
    nameAr: "أهرامات الجيزة الخالدة",
    nameEn: "Giza Pyramids",
    url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=80",
    fallback: "/giza-puzzle.jpg"
  },
  {
    id: "karnak",
    nameAr: "معبد الكرنك العظيم",
    nameEn: "Karnak Temple",
    url: "https://images.unsplash.com/photo-1568322445389-f64ac25267f0?auto=format&fit=crop&w=1000&q=80",
    fallback: "/karnak-puzzle.jpg"
  }
];

export default function LittlePharaohsKidsMode() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [xp, setXp] = useState(140);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(["Pyramid Builder"]);

  const [selectedImg, setSelectedImg] = useState(PUZZLE_IMAGES[0].url);
  const [tiles, setTiles] = useState<number[]>([2, 0, 3, 1]); // 4 Large interlocking puzzle tiles
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null); // For tap/click swap support
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    try {
      const savedXp = localStorage.getItem("egyptx_kids_xp");
      const savedBadges = localStorage.getItem("egyptx_kids_badges");
      if (savedXp) setXp(parseInt(savedXp, 10));
      if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
    } catch (e) {
      console.warn("Storage restricted", e);
    }
  }, []);

  const saveProgress = (addedXp: number, badge: string) => {
    const newXp = xp + addedXp;
    setXp(newXp);
    localStorage.setItem("egyptx_kids_xp", newXp.toString());
    if (!earnedBadges.includes(badge)) {
      const updated = [...earnedBadges, badge];
      setEarnedBadges(updated);
      localStorage.setItem("egyptx_kids_badges", JSON.stringify(updated));
    }
  };

  const handleResetProgress = () => {
    setXp(0);
    setEarnedBadges([]);
    localStorage.removeItem("egyptx_kids_xp");
    localStorage.removeItem("egyptx_kids_badges");
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && scanResult !== "correct") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, scanResult]);

  const shuffleTiles = useCallback(() => {
    setTiles([2, 0, 3, 1]);
    setSelectedSlot(null);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
    setScanResult(null);
  }, []);

  const swapPieces = (fromIdx: number, toIdx: number) => {
    if (!isPlaying || isScanning || scanResult === "correct" || fromIdx === toIdx) return;
    const newTiles = [...tiles];
    const temp = newTiles[fromIdx];
    newTiles[fromIdx] = newTiles[toIdx];
    newTiles[toIdx] = temp;
    setTiles(newTiles);
    setMoves((prev) => prev + 1);
    setSelectedSlot(null);
  };

  // HTML5 Drag & Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!isPlaying || isScanning || scanResult === "correct") return;

    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;

    swapPieces(dragIndex, dropIndex);
  };

  // Tap/Click to swap support (works on mobile, tablet & desktop)
  const handlePieceClick = (slotIndex: number) => {
    if (!isPlaying) {
      shuffleTiles();
      return;
    }
    if (isScanning || scanResult === "correct") return;

    if (selectedSlot === null) {
      setSelectedSlot(slotIndex);
    } else if (selectedSlot === slotIndex) {
      setSelectedSlot(null);
    } else {
      swapPieces(selectedSlot, slotIndex);
    }
  };

  const handleVerifyPuzzle = () => {
    setIsScanning(true);
    setScanResult(null);
    setSelectedSlot(null);

    setTimeout(() => {
      setIsScanning(false);
      const isSolved = tiles[0] === 0 && tiles[1] === 1 && tiles[2] === 2 && tiles[3] === 3;
      if (isSolved) {
        setScanResult("correct");
        setIsPlaying(false);
        saveProgress(50, "Temple Master");
      } else {
        setScanResult("incorrect");
      }
    }, 1800);
  };

  // Reliable, cross-browser polygonal interlocking clip-paths
  const getJigsawClipPath = (pieceId: number) => {
    switch (pieceId) {
      case 0: // Top-Left: Flat top & left, right tab out, bottom tab out
        return "polygon(0% 0%, 100% 0%, 100% 35%, 108% 40%, 108% 60%, 100% 65%, 100% 100%, 65% 100%, 60% 108%, 40% 108%, 35% 100%, 0% 100%)";
      case 1: // Top-Right: Flat top & right, left notch in, bottom tab out
        return "polygon(0% 0%, 100% 0%, 100% 100%, 65% 100%, 60% 108%, 40% 108%, 35% 100%, 0% 100%, 0% 65%, 8% 60%, 8% 40%, 0% 35%)";
      case 2: // Bottom-Left: Flat bottom & left, top notch in, right tab out
        return "polygon(0% 0%, 35% 0%, 40% 8%, 60% 8%, 65% 0%, 100% 0%, 100% 35%, 108% 40%, 108% 60%, 100% 65%, 100% 100%, 0% 100%)";
      case 3: // Bottom-Right: Flat bottom & right, top notch in, left notch in
        return "polygon(0% 0%, 35% 0%, 40% 8%, 60% 8%, 65% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 65%, 8% 60%, 8% 40%, 0% 35%)";
      default:
        return "none";
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] text-[#F3F4F6] p-4 md:p-10 font-sans relative overflow-hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Header & Counter */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center bg-[#111C38] border border-[#D4AF37]/40 rounded-2xl p-6 mb-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-3xl border border-[#D4AF37]/50 shadow-inner">
            🦅
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#D4AF37]">
              {lang === "ar" ? "مغامرات الفراعنة الصغار — Little Pharaohs" : "Little Pharaohs Adventure"}
            </h1>
            <p className="text-xs text-gray-300">
              {lang === "ar" ? "بازل الصورة التشكيلية المتشابكة مع الخيال الشفاف" : "Interlocking Jigsaw Puzzle with Ghost Overlay"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-[#070D1F] px-5 py-3 rounded-xl border border-[#D4AF37]/30">
          <div>
            <span className="text-[10px] text-gray-400 block">{lang === "ar" ? "نقاط الخبرة (XP)" : "XP Points"}</span>
            <span className="text-lg font-bold text-[#D4AF37]">{xp} {lang === "ar" ? "نقطة" : "pts"}</span>
          </div>
          <div className="h-6 w-[1px] bg-gray-700"></div>
          <div>
            <span className="text-[10px] text-gray-400 block">{lang === "ar" ? "الشارات" : "Badges"}</span>
            <span className="text-lg font-bold text-teal-400">{earnedBadges.length}</span>
          </div>
          <button
            onClick={handleResetProgress}
            className="text-xs bg-rose-950/60 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-lg border border-rose-800 transition-colors cursor-pointer"
          >
            {lang === "ar" ? "🔄 مسح" : "🔄 Reset"}
          </button>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="text-xs bg-[#D4AF37] text-[#070D1F] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
          >
            {lang === "ar" ? "English" : "عربي"}
          </button>
        </div>
      </div>

      {/* Main Container - Extra Large Window */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Large Puzzle Stage (Takes 3 columns) */}
        <div className="lg:col-span-3 bg-[#111C38] border-2 border-[#D4AF37]/50 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-3 border-b border-gray-800">
            <h3 className="text-xl font-bold text-[#D4AF37] flex items-center gap-2">
              🧩 {lang === "ar" ? "بازل المعالم الفرعونية المكبر" : "Large Pharaonic Jigsaw Stage"}
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs text-gray-300">📊 {lang === "ar" ? "الحركات" : "Moves"}: <strong className="text-[#D4AF37] text-sm">{moves}</strong></span>
              <span className="text-xs text-gray-300">⏱️ {lang === "ar" ? "الوقت" : "Time"}: <strong className="text-teal-400 text-sm">{seconds}s</strong></span>
              <button
                onClick={shuffleTiles}
                className="bg-[#D4AF37] hover:bg-[#c29d30] text-[#070D1F] font-bold px-5 py-2 rounded-xl text-xs transition-transform hover:scale-105 shadow-md cursor-pointer"
              >
                {lang === "ar" ? "خلط وبدء التحدي 🎮" : "Shuffle & Start 🎮"}
              </button>
            </div>
          </div>

          {/* Image Selector */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {PUZZLE_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedImg(img.url);
                  setIsPlaying(false);
                  setScanResult(null);
                  setSelectedSlot(null);
                }}
                className={`p-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${selectedImg === img.url ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]' : 'border-gray-800 bg-[#070D1F] text-gray-400 hover:border-gray-600'}`}
              >
                <div
                  className="h-16 rounded-xl mb-1 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.url}), url(${img.fallback})` }}
                ></div>
                <span className="truncate block">{lang === "ar" ? img.nameAr : img.nameEn}</span>
              </button>
            ))}
          </div>

          {/* Extra Large Board Container */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 my-6">
            
            {/* AI Scan Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-[#070D1F]/95 z-30 flex flex-col items-center justify-center rounded-3xl backdrop-blur-md">
                <div className="w-20 h-20 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-[#D4AF37] font-bold animate-pulse text-center px-4">
                  {lang === "ar" ? "جارِ فحص تطابق القطع بالذكاء الاصطناعي..." : "AI scanning jigsaw alignment..."}
                </p>
              </div>
            )}

            {/* Large Puzzle Grid with Ghost Overlay Background */}
            <div 
              dir="ltr"
              className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-3xl border-4 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-black/80"
            >
              {/* Ghost Guide Overlay */}
              <div 
                className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none filter contrast-125"
                style={{ backgroundImage: `url(${selectedImg})` }}
              ></div>

              {/* 2x2 Slots Grid */}
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full relative z-10">
                {tiles.map((pieceVal, slotIndex) => {
                  const posX = (pieceVal % 2) * 100;
                  const posY = Math.floor(pieceVal / 2) * 100;
                  const isSlotSelected = selectedSlot === slotIndex;

                  return (
                    <div
                      key={slotIndex}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, slotIndex)}
                      onClick={() => handlePieceClick(slotIndex)}
                      className={`w-full h-full border border-white/10 relative flex items-center justify-center cursor-pointer transition-all ${
                        isSlotSelected ? "ring-4 ring-amber-400/90 z-20" : ""
                      }`}
                    >
                      <div
                        draggable={isPlaying && scanResult !== "correct"}
                        onDragStart={(e) => handleDragStart(e, slotIndex)}
                        className={`w-full h-full cursor-grab active:cursor-grabbing transition-transform hover:scale-[1.02] filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] border-2 border-amber-400/80 bg-no-repeat bg-cover ${
                          isSlotSelected ? "scale-[1.04]" : ""
                        }`}
                        style={{
                          backgroundImage: `url(${selectedImg})`,
                          backgroundPosition: `${posX}% ${posY}%`,
                          backgroundSize: '200% 200%',
                          clipPath: getJigsawClipPath(pieceVal)
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Small Circular Finish Button (Without text) */}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleVerifyPuzzle}
                title="إنهاء"
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-[#D4AF37] hover:scale-110 active:scale-95 shadow-2xl border-4 border-white flex items-center justify-center text-3xl text-white transition-all cursor-pointer animate-bounce"
              >
                ✓
              </button>
              <span className="text-xs text-gray-300 font-bold mt-3">
                {lang === "ar" ? "إنهاء" : "Finish"}
              </span>
            </div>

          </div>

          {!isPlaying && scanResult === null && (
            <p className="text-center text-xs text-gray-400 mt-2">
              {lang === "ar" ? "اضغط «خلط وبدء التحدي» ثم اسحب أو اضغط القطع لتبديل أماكنها" : "Click 'Shuffle & Start', then drag or tap pieces to swap them"}
            </p>
          )}

          {/* Exact Required Feedback Messages */}
          {scanResult === "correct" && (
            <div className="mt-6 p-5 bg-emerald-950/80 border-2 border-emerald-500/80 rounded-2xl text-center text-emerald-200 text-sm font-bold shadow-2xl animate-fade-in">
              عقلك المبدع بيكبر كل يوم! 🧠 (+50 XP)
            </div>
          )}
          {scanResult === "incorrect" && (
            <div className="mt-6 p-5 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl text-center text-rose-200 text-xs font-bold shadow-2xl animate-fade-in">
              الغلط بيساعدنا نتعلّم ونكبر! 🌱 (حاول مرة أخرى لتصحيح الأماكن)
            </div>
          )}

        </div>

        {/* Sidebar Museum */}
        <div className="space-y-6">
          <div className="bg-[#111C38] border border-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
              🏛️ {lang === "ar" ? "متحف الشارات" : "Badges Museum"}
            </h3>
            <div className="space-y-3">
              {["Pyramid Builder", "Temple Explorer", "Temple Master"].map((b, idx) => {
                const unlocked = earnedBadges.includes(b);
                return (
                  <div key={idx} className={`p-3.5 rounded-2xl border flex items-center gap-4 ${unlocked ? 'bg-[#070D1F] border-[#D4AF37]/50 text-white' : 'bg-gray-900/40 border-gray-800/60 text-gray-600'}`}>
                    <span className="text-2xl">{unlocked ? "🏅" : "🔒"}</span>
                    <div>
                      <span className={`text-xs font-bold block ${unlocked ? 'text-[#D4AF37]' : 'text-gray-500'}`}>{b}</span>
                      <span className="text-[10px] text-gray-400">{unlocked ? "مكتسب" : "مغلق"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

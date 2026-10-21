"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80";

interface Piece {
  id: number;
  correctRow: number;
  correctCol: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  isLocked: boolean;
  shapePath: Path2D;
}

export default function PharaonicJigsawGame() {
  const [isKidsMode, setIsKidsMode] = useState<boolean>(true);
  const [imageSrc, setImageSrc] = useState<string>(DEFAULT_IMAGE_URL);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  const rows = isKidsMode ? 2 : 3;
  const cols = isKidsMode ? 3 : 4;
  const snapTolerance = isKidsMode ? 55 : 30;

  const piecesRef = useRef<Piece[]>([]);
  const activePieceIndexRef = useRef<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const initGame = useCallback(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgElementRef.current = img;
      setupPuzzlePieces();
    };
  }, [imageSrc, isKidsMode]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const createPiecePath = (
    width: number,
    height: number,
    row: number,
    col: number,
    totalRows: number,
    totalCols: number
  ): Path2D => {
    const path = new Path2D();
    const x = 0;
    const y = 0;
    const tabSize = Math.min(width, height) * 0.22;

    path.moveTo(x, y);

    if (row === 0) {
      path.lineTo(x + width, y);
    } else {
      path.lineTo(x + width * 0.35, y);
      path.bezierCurveTo(
        x + width * 0.35, y - tabSize,
        x + width * 0.65, y - tabSize,
        x + width * 0.65, y
      );
      path.lineTo(x + width, y);
    }

    if (col === totalCols - 1) {
      path.lineTo(x + width, y + height);
    } else {
      path.lineTo(x + width, y + height * 0.35);
      path.bezierCurveTo(
        x + width + tabSize, y + height * 0.35,
        x + width + tabSize, y + height * 0.65,
        x + width, y + height * 0.65
      );
      path.lineTo(x + width, y + height);
    }

    if (row === totalRows - 1) {
      path.lineTo(x, y + height);
    } else {
      path.lineTo(x + width * 0.65, y + height);
      path.bezierCurveTo(
        x + width * 0.65, y + height + tabSize,
        x + width * 0.35, y + height + tabSize,
        x + width * 0.35, y + height
      );
      path.lineTo(x, y + height);
    }

    if (col === 0) {
      path.lineTo(x, y);
    } else {
      path.lineTo(x, y + height * 0.65);
      path.bezierCurveTo(
        x - tabSize, y + height * 0.65,
        x - tabSize, y + height * 0.35,
        x, y + height * 0.35
      );
      path.lineTo(x, y);
    }

    path.closePath();
    return path;
  };

  const setupPuzzlePieces = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElementRef.current) return;

    const boardWidth = canvas.width;
    const boardHeight = canvas.height;

    const targetWidth = boardWidth * 0.6;
    const targetHeight = boardHeight * 0.7;
    const targetStartX = (boardWidth - targetWidth) / 2;
    const targetStartY = (boardHeight - targetHeight) / 2;

    const pieceWidth = targetWidth / cols;
    const pieceHeight = targetHeight / rows;

    const newPieces: Piece[] = [];
    let id = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const targetX = targetStartX + c * pieceWidth;
        const targetY = targetStartY + r * pieceHeight;

        const isLeft = Math.random() > 0.5;
        const currentX = isLeft
          ? Math.random() * (targetStartX - pieceWidth - 20)
          : targetStartX + targetWidth + 20 + Math.random() * (boardWidth - (targetStartX + targetWidth) - pieceWidth - 20);
        const currentY = Math.random() * (boardHeight - pieceHeight - 20);

        const shapePath = createPiecePath(pieceWidth, pieceHeight, r, c, rows, cols);

        newPieces.push({
          id,
          correctRow: r,
          correctCol: c,
          currentX: Math.max(10, currentX),
          currentY: Math.max(10, currentY),
          targetX,
          targetY,
          isLocked: false,
          shapePath,
        });
        id++;
      }
    }

    piecesRef.current = newPieces;
    setIsGameCompleted(false);
    setMoves(0);
    drawBoard();
  };

  const drawBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imgElementRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const targetWidth = canvas.width * 0.6;
    const targetHeight = canvas.height * 0.7;
    const targetStartX = (canvas.width - targetWidth) / 2;
    const targetStartY = (canvas.height - targetHeight) / 2;

    ctx.save();
    ctx.fillStyle = "#eee5d3";
    ctx.roundRect(targetStartX, targetStartY, targetWidth, targetHeight, 20);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#D4AF37";
    ctx.stroke();

    ctx.globalAlpha = isKidsMode ? 0.55 : 0.35;
    ctx.drawImage(imgElementRef.current, targetStartX, targetStartY, targetWidth, targetHeight);
    ctx.restore();

    const pieceWidth = targetWidth / cols;
    const pieceHeight = targetHeight / rows;

    piecesRef.current.forEach((piece, index) => {
      ctx.save();
      ctx.translate(piece.currentX, piece.currentY);

      ctx.clip(piece.shapePath);

      const sourceX = (piece.correctCol / cols) * imgElementRef.current!.naturalWidth;
      const sourceY = (piece.correctRow / rows) * imgElementRef.current!.naturalHeight;
      const sourceW = imgElementRef.current!.naturalWidth / cols;
      const sourceH = imgElementRef.current!.naturalHeight / rows;

      ctx.drawImage(
        imgElementRef.current!,
        sourceX, sourceY, sourceW, sourceH,
        0, 0, pieceWidth, pieceHeight
      );

      if (!piece.isLocked) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = index === activePieceIndexRef.current ? 15 : 6;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
      }

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = piece.isLocked ? "#10B981" : "#D4AF37";
      ctx.stroke(piece.shapePath);

      ctx.restore();
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const mouseX = ((clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((clientY - rect.top) / rect.height) * canvas.height;

    for (let i = piecesRef.current.length - 1; i >= 0; i--) {
      const piece = piecesRef.current[i];
      if (piece.isLocked) continue;

      const pieceWidth = (canvas.width * 0.6) / cols;
      const pieceHeight = (canvas.height * 0.7) / rows;

      if (
        mouseX >= piece.currentX &&
        mouseX <= piece.currentX + pieceWidth &&
        mouseY >= piece.currentY &&
        mouseY <= piece.currentY + pieceHeight
      ) {
        activePieceIndexRef.current = i;
        dragOffsetRef.current = {
          x: mouseX - piece.currentX,
          y: mouseY - piece.currentY,
        };

        const [selectedPiece] = piecesRef.current.splice(i, 1);
        piecesRef.current.push(selectedPiece);
        activePieceIndexRef.current = piecesRef.current.length - 1;

        drawBoard();
        break;
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (activePieceIndexRef.current === null || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const mouseX = ((clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((clientY - rect.top) / rect.height) * canvas.height;

    const piece = piecesRef.current[activePieceIndexRef.current];
    piece.currentX = mouseX - dragOffsetRef.current.x;
    piece.currentY = mouseY - dragOffsetRef.current.y;

    drawBoard();
  };

  const handlePointerUp = () => {
    if (activePieceIndexRef.current === null) return;

    const piece = piecesRef.current[activePieceIndexRef.current];

    const distance = Math.hypot(
      piece.currentX - piece.targetX,
      piece.currentY - piece.targetY
    );

    if (distance <= snapTolerance) {
      piece.currentX = piece.targetX;
      piece.currentY = piece.targetY;
      piece.isLocked = true;
    }

    activePieceIndexRef.current = null;
    setMoves((prev) => prev + 1);

    const allLocked = piecesRef.current.every((p) => p.isLocked);
    if (allLocked) {
      setIsGameCompleted(true);
    }

    drawBoard();
  };

  return (
    <div className="w-full min-h-screen bg-[#070D1F] text-white p-4 md:p-8 font-sans flex flex-col items-center">
      
      {/* Control Bar */}
      <div className="w-full max-w-6xl bg-[#111C38] border border-[#D4AF37]/40 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-[#D4AF37] hover:bg-[#c29d30] text-[#070D1F] font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2">
            <span>📁</span>
            <span>ارفع صورتك</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={setupPuzzlePieces}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all"
          >
            🔄 بدء من جديد
          </button>
        </div>

        {/* Kids Mode Toggle */}
        <div className="flex items-center gap-3 bg-[#070D1F] px-4 py-2 rounded-xl border border-[#D4AF37]/30">
          <span className="text-xs font-bold text-[#D4AF37]">
            {isKidsMode ? "👶 Kids Mode" : "🎯 Normal Mode"}
          </span>
          <button
            onClick={() => setIsKidsMode(!isKidsMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isKidsMode ? "bg-emerald-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isKidsMode ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Main Large Jigsaw Stage */}
      <div
        ref={containerRef}
        className="w-full max-w-6xl bg-[#111C38] border-2 border-[#D4AF37]/50 rounded-3xl p-4 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="w-full h-auto max-h-[70vh] rounded-2xl cursor-grab active:cursor-grabbing touch-none"
        ></canvas>

        {/* Celebration Winner Banner */}
        {isGameCompleted && (
          <div className="absolute inset-0 bg-[#070D1F]/90 z-40 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-md">
            <div className="text-6xl mb-4 animate-bounce">🎉 🧠 🏆</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-2">
              عقلك المبدع بيكبر كل يوم! 🧠
            </h2>
            <p className="text-sm text-emerald-300 mb-6">
              تم تركيب جميع القطع بنجاح في {moves} حركة!
            </p>
            <button
              onClick={setupPuzzlePieces}
              className="bg-gradient-to-r from-amber-500 to-[#D4AF37] text-[#070D1F] font-bold px-8 py-3 rounded-2xl text-sm hover:scale-105 transition-all shadow-2xl"
            >
              العب مرة أخرى 🎮
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
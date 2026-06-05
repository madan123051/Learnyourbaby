import React, { useRef, useState, useCallback, useEffect } from 'react';

// ── Types ────────────────────────────────────────────────────────
type Point      = { x: number; y: number };
type LetterMode = 'off' | 'upper' | 'lower';

// ── Fun color palettes ──────────────────────────────────────────
const RAINBOW_COLORS = [
  '#FF6B6B','#FF9F43','#FECA57','#48DBFB',
  '#FF6FF2','#55EFC4','#A29BFE','#FD79A8',
  '#00D2D3','#FF9FF3','#54A0FF','#5F27CD',
];

const BRUSH_SIZES = [
  { label: '●',  size: 8,  emoji: '🔹' },
  { label: '●',  size: 16, emoji: '🔸' },
  { label: '●',  size: 28, emoji: '🟡' },
  { label: '●',  size: 48, emoji: '🟠' },
  { label: '●',  size: 76, emoji: '🔴' },
];

const UPPER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Fun colors per letter for the guide
const LETTER_COLORS = [
  '#FF6B6B','#FF9F43','#FECA57','#55EFC4','#48DBFB','#A29BFE','#FF6FF2',
  '#FD79A8','#00D2D3','#FF9FF3','#54A0FF','#5F27CD','#FF6B6B','#FF9F43',
  '#FECA57','#55EFC4','#48DBFB','#A29BFE','#FF6FF2','#FD79A8','#00D2D3',
  '#FF9FF3','#54A0FF','#5F27CD','#FF6B6B','#FF9F43',
];

// ── Confetti particle ───────────────────────────────────────────
interface ConfettiPiece { id: number; x: number; y: number; color: string; rot: number; scale: number; delay: number; }

let confettiId = 0;
const makeConfetti = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, () => ({
    id:    ++confettiId,
    x:     Math.random() * 100,
    y:     -10 - Math.random() * 20,
    color: RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)],
    rot:   Math.random() * 360,
    scale: 0.5 + Math.random() * 1,
    delay: Math.random() * 0.5,
  }));

// ── Props ────────────────────────────────────────────────────────
interface Props { onClose: () => void; }

// ── CSS keyframes (injected once) ────────────────────────────────
const ANIM_STYLE = `
@keyframes mc-confetti-fall {
  0%   { transform: translateY(0) rotate(0deg) scale(var(--s)); opacity: 1; }
  100% { transform: translateY(105vh) rotate(720deg) scale(var(--s)); opacity: 0; }
}
@keyframes mc-bounce-in {
  0%   { transform: scale(0); opacity: 0; }
  50%  { transform: scale(1.3); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes mc-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
@keyframes mc-rainbow-bg {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes mc-sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1) rotate(180deg); }
}
@keyframes mc-float {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-6px); }
}
@keyframes mc-star-pop {
  0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
  60%  { transform: scale(1.4) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
`;

// ── Component ────────────────────────────────────────────────────
export const MagicCanvasScreen: React.FC<Props> = ({ onClose }) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const lastPt     = useRef<Point | null>(null);
  const isDrawing  = useRef(false);

  const [color,      setColor]      = useState(RAINBOW_COLORS[4]); // pink
  const [brushIdx,   setBrushIdx]   = useState(2);
  const [isEraser,   setIsEraser]   = useState(false);
  const [history,    setHistory]    = useState<ImageData[]>([]);
  const [letterMode, setLetterMode] = useState<LetterMode>('off');
  const [letterIdx,  setLetterIdx]  = useState(0);
  const [tick,       setTick]       = useState(0);
  const [completed,  setCompleted]  = useState<Set<number>>(new Set());
  const [confetti,   setConfetti]   = useState<ConfettiPiece[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const brushSize     = BRUSH_SIZES[brushIdx].size;
  const letters       = letterMode === 'upper' ? UPPER_LETTERS
                      : letterMode === 'lower' ? LOWER_LETTERS : [];
  const currentLetter = letters[letterIdx] ?? '';
  const isLetterMode  = letterMode !== 'off';
  const letterColor   = LETTER_COLORS[letterIdx] || '#FF6B6B';

  // ── Inject keyframes ──────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById('mc-anim-styles')) return;
    const s = document.createElement('style');
    s.id = 'mc-anim-styles';
    s.textContent = ANIM_STYLE;
    document.head.appendChild(s);
    return () => { s.remove(); };
  }, []);

  // ── Clear canvas ──────────────────────────────────────────────
  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isLetterMode) {
      // Fun gradient background in free mode
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, '#ffecd2');
      g.addColorStop(0.5, '#fcb69f');
      g.addColorStop(1, '#ffecd2');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isLetterMode]);

  // ── Fill canvas on mount ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx, canvas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-clear when letter/mode changes ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx, canvas);
    setHistory([]);
    setTick(t => t + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterMode, letterIdx]);

  // ── Coord helper ──────────────────────────────────────────────
  const getPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left)  * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)   * (canvas.height / rect.height),
    };
  }, []);

  // ── Snapshots ─────────────────────────────────────────────────
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory(h => [...h.slice(-30), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const hardClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx, canvas);
    setHistory([]);
    setTick(t => t + 1);
  }, [clearCanvas]);

  const clear = useCallback(() => { saveSnapshot(); hardClear(); }, [saveSnapshot, hardClear]);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const canvas = canvasRef.current;
      if (!canvas) return h;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(h[h.length - 1], 0, 0);
      setTick(t => t + 1);
      return h.slice(0, -1);
    });
  }, []);

  // ── Drawing ───────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      saveSnapshot();
      const pt = getPoint(e);
      lastPt.current    = pt;
      isDrawing.current = true;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, brushSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    },
    [color, brushSize, isEraser, getPoint, saveSnapshot],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || !lastPt.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const pt  = getPoint(e);
      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(lastPt.current.x, lastPt.current.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth   = brushSize * 3;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.beginPath();
        ctx.moveTo(lastPt.current.x, lastPt.current.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = color;
        ctx.lineWidth   = brushSize;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
      }
      lastPt.current = pt;
    },
    [color, brushSize, isEraser, getPoint],
  );

  const onPointerUp = useCallback(() => {
    isDrawing.current = false;
    lastPt.current    = null;
  }, []);

  // ── Letter navigation with celebration ────────────────────────
  const markDoneAndNext = useCallback(() => {
    setCompleted(prev => new Set(prev).add(letterIdx));
    setConfetti(makeConfetti(40));
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setConfetti([]);
      if (letterIdx < 25) setLetterIdx(i => i + 1);
    }, 1500);
  }, [letterIdx]);

  const goToLetter = useCallback((idx: number) => setLetterIdx(idx), []);
  const prevLetter = useCallback(() => setLetterIdx(i => Math.max(i - 1, 0)), []);

  const cycleLetterMode = useCallback(() => {
    setLetterMode(m => m === 'off' ? 'upper' : m === 'upper' ? 'lower' : 'off');
    setLetterIdx(0);
    setCompleted(new Set());
  }, []);

  const modeBtnLabel = letterMode === 'off' ? '🔤 A–Z'
                     : letterMode === 'upper' ? '🔠 ABC' : '🔡 abc';

  const starsEarned = completed.size;
  const progressPct = isLetterMode ? ((starsEarned) / 26) * 100 : 0;

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background:    isLetterMode
          ? `linear-gradient(135deg, ${letterColor}15, #fff5f5, ${letterColor}10)`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop:    'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft:   'env(safe-area-inset-left)',
        paddingRight:  'env(safe-area-inset-right)',
      }}
    >
      {/* ── Confetti overlay ──────────────────────────────────── */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
          {confetti.map(c => (
            <div
              key={c.id}
              style={{
                position:  'absolute',
                left:      `${c.x}%`,
                top:       `${c.y}%`,
                width:     12 * c.scale,
                height:    12 * c.scale,
                background: c.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                // @ts-ignore
                '--s':     c.scale,
                animation: `mc-confetti-fall 2s ${c.delay}s ease-in forwards`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* ── Celebration overlay ───────────────────────────────── */}
      {showCelebration && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 99 }}
        >
          <div
            className="flex flex-col items-center gap-2"
            style={{ animation: 'mc-bounce-in 0.5s ease-out' }}
          >
            <span style={{ fontSize: '20vmin', animation: 'mc-pulse 0.6s ease-in-out infinite' }}>⭐</span>
            <span
              className="font-black text-white px-6 py-3 rounded-3xl"
              style={{
                fontSize:   '6vmin',
                background: 'linear-gradient(135deg, #FF6B6B, #FF9F43, #FECA57)',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                animation:  'mc-bounce-in 0.5s 0.2s ease-out both',
              }}
            >
              {letterIdx === 25 ? '🎉 All Done! Amazing! 🎉' : `Great job! ✨`}
            </span>
          </div>
        </div>
      )}

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{
          background: isLetterMode
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          borderBottom:   isLetterMode
            ? `3px solid ${letterColor}40`
            : '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ animation: 'mc-float 2s ease-in-out infinite' }}>🎨</span>
          <div>
            <p
              className="font-black text-base leading-none"
              style={{
                color: isLetterMode ? '#2d3436' : '#fff',
                background: isLetterMode ? `linear-gradient(90deg, ${letterColor}, #FF6FF2)` : 'none',
                WebkitBackgroundClip: isLetterMode ? 'text' : 'unset',
                WebkitTextFillColor: isLetterMode ? 'transparent' : 'unset',
              } as React.CSSProperties}
            >
              Magic Canvas
            </p>
            <p
              className="text-xs font-bold mt-0.5"
              style={{ color: isLetterMode ? '#636e72' : 'rgba(255,255,255,0.7)' }}
            >
              {isLetterMode
                ? `✏️ Trace the letter — you got this! 💪`
                : '✨ Draw anything you imagine!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={cycleLetterMode}
            className="px-4 py-2 rounded-2xl text-sm font-black transition-all active:scale-95"
            style={{
              background:    isLetterMode
                ? `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 3) % 26]})`
                : 'rgba(255,255,255,0.25)',
              color:         '#fff',
              boxShadow:     isLetterMode ? `0 4px 15px ${letterColor}60` : 'none',
            }}
          >
            {modeBtnLabel}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold active:scale-95 transition-all"
            style={{
              background: isLetterMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
              color:      isLetterMode ? '#636e72' : '#fff',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Progress bar + stars (letter mode) ───────────────── */}
      {isLetterMode && (
        <div className="shrink-0 px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.6)' }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width:      `${progressPct}%`,
                  background: `linear-gradient(90deg, ${LETTER_COLORS[0]}, ${LETTER_COLORS[6]}, ${LETTER_COLORS[12]}, ${LETTER_COLORS[18]}, ${LETTER_COLORS[24]})`,
                  backgroundSize: '200% 100%',
                  animation:  'mc-rainbow-bg 3s ease infinite',
                }}
              />
            </div>
            <span className="font-black text-sm" style={{ color: '#2d3436' }}>
              ⭐ {starsEarned}/26
            </span>
          </div>
        </div>
      )}

      {/* ── Letter selector strip ─────────────────────────────── */}
      {isLetterMode && (
        <div
          className="shrink-0 flex items-center gap-2 px-3 py-2"
          style={{
            background:   'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
            borderBottom: `2px solid ${letterColor}30`,
          }}
        >
          <button
            onClick={prevLetter}
            disabled={letterIdx === 0}
            className="w-10 h-10 rounded-xl font-black text-xl flex items-center justify-center disabled:opacity-20 active:scale-95 transition-all shrink-0"
            style={{ background: `${letterColor}20`, color: letterColor }}
          >
            ‹
          </button>

          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
            {letters.map((ltr, i) => {
              const lc = LETTER_COLORS[i];
              const isCurrent = i === letterIdx;
              const isDone    = completed.has(i);
              return (
                <button
                  key={ltr}
                  onClick={() => goToLetter(i)}
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all active:scale-110 relative"
                  style={{
                    background: isCurrent
                      ? `linear-gradient(135deg, ${lc}, ${LETTER_COLORS[(i + 3) % 26]})`
                      : isDone ? `${lc}25` : 'rgba(0,0,0,0.05)',
                    color:   isCurrent ? '#fff' : isDone ? lc : '#aaa',
                    transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isCurrent ? `0 4px 12px ${lc}50` : 'none',
                    border:    isDone && !isCurrent ? `2px solid ${lc}60` : 'none',
                  }}
                >
                  {ltr}
                  {isDone && !isCurrent && (
                    <span
                      className="absolute -top-1 -right-1 text-xs"
                      style={{ animation: 'mc-star-pop 0.4s ease-out' }}
                    >
                      ⭐
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { if (letterIdx < 25) setLetterIdx(i => i + 1); }}
            disabled={letterIdx === 25}
            className="w-10 h-10 rounded-xl font-black text-xl flex items-center justify-center disabled:opacity-20 active:scale-95 transition-all shrink-0"
            style={{ background: `${letterColor}20`, color: letterColor }}
          >
            ›
          </button>
        </div>
      )}

      {/* ── Canvas area ──────────────────────────────────────── */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{
          background: isLetterMode ? '#fff' : 'transparent',
          borderRadius: isLetterMode ? '20px' : 0,
          margin:       isLetterMode ? '6px 8px' : 0,
          boxShadow:    isLetterMode ? `0 4px 30px ${letterColor}25, inset 0 0 60px ${letterColor}08` : 'none',
          border:       isLetterMode ? `3px solid ${letterColor}30` : 'none',
        }}
      >
        {/* ── Fun guide lines (letter mode) ──────────────────── */}
        {isLetterMode && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            preserveAspectRatio="none"
          >
            {/* Dashed guide lines like ruled paper */}
            {[25, 50, 75].map(pct => (
              <line
                key={pct}
                x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
                stroke={`${letterColor}20`}
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />
            ))}
            {/* Baseline */}
            <line
              x1="0" y1="73%" x2="100%" y2="73%"
              stroke={`${letterColor}35`}
              strokeWidth="2"
            />
          </svg>
        )}

        {/* ── Ghost/guide letter ──────────────────────────────── */}
        {isLetterMode && currentLetter && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ zIndex: 1 }}
          >
            {/* Big colorful faint letter */}
            <span
              className="absolute"
              style={{
                fontSize:    '55vmin',
                fontWeight:  900,
                fontFamily:  '"Arial Rounded MT Bold", "Nunito", "Comic Sans MS", Arial, sans-serif',
                lineHeight:  1,
                userSelect:  'none',
                color:       `${letterColor}12`,
              }}
            >
              {currentLetter}
            </span>
            {/* Dotted outline — tracing guide */}
            <span
              className="absolute"
              style={{
                fontSize:         '55vmin',
                fontWeight:       900,
                fontFamily:       '"Arial Rounded MT Bold", "Nunito", "Comic Sans MS", Arial, sans-serif',
                lineHeight:       1,
                userSelect:       'none',
                color:            'transparent',
                WebkitTextStroke: `8px ${letterColor}40`,
              }}
            >
              {currentLetter}
            </span>
          </div>
        )}

        {/* ── Sparkle decorations in corners ──────────────────── */}
        {isLetterMode && (
          <>
            {[
              { top: '8%', left: '5%', delay: '0s', size: '24px' },
              { top: '12%', right: '8%', delay: '0.5s', size: '18px' },
              { bottom: '15%', left: '10%', delay: '1s', size: '20px' },
              { bottom: '10%', right: '5%', delay: '1.5s', size: '22px' },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  ...pos,
                  fontSize:  pos.size,
                  zIndex:    1,
                  animation: `mc-sparkle 2s ${pos.delay} ease-in-out infinite`,
                } as React.CSSProperties}
              >
                ✨
              </div>
            ))}
          </>
        )}

        {/* ── Drawing canvas ──────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          width={2048}
          height={1536}
          className="absolute inset-0 w-full h-full touch-none"
          style={{
            zIndex:     2,
            cursor:     isEraser ? 'cell' : 'crosshair',
            background: 'transparent',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {/* ── "Done ✓ Next" floating button ──────────────────── */}
        {isLetterMode && letterIdx <= 25 && !showCelebration && (
          <button
            onClick={markDoneAndNext}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-5 py-3.5 rounded-2xl font-black text-white text-base active:scale-95 transition-all"
            style={{
              zIndex:     3,
              background: `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 5) % 26]})`,
              boxShadow:  `0 6px 25px ${letterColor}50`,
              animation:  'mc-float 2s ease-in-out infinite',
            }}
          >
            {letterIdx === 25
              ? <>🎉 Finish!</>
              : <>Done ✓ Next {letters[letterIdx + 1]} →</>
            }
          </button>
        )}

        {/* ── Current letter indicator (big, top-left) ────────── */}
        {isLetterMode && (
          <div
            className="absolute top-3 left-3 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl"
            style={{
              zIndex:     3,
              background: `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 4) % 26]})`,
              color:      '#fff',
              boxShadow:  `0 4px 15px ${letterColor}40`,
              animation:  'mc-pulse 2s ease-in-out infinite',
            }}
          >
            {currentLetter}
          </div>
        )}
      </div>

      {/* ── Bottom toolbar ────────────────────────────────────── */}
      <div
        className="shrink-0 px-4 pt-2.5 pb-3"
        style={{
          background:    isLetterMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)',
          borderTop:     isLetterMode ? `2px solid ${letterColor}25` : '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* Color row */}
        <div className="flex items-center justify-center gap-2 mb-2.5 flex-wrap">
          {RAINBOW_COLORS.map((c, i) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className="rounded-full transition-all active:scale-125"
              style={{
                width:         !isEraser && color === c ? 40 : 32,
                height:        !isEraser && color === c ? 40 : 32,
                background:    `linear-gradient(135deg, ${c}, ${RAINBOW_COLORS[(i + 3) % RAINBOW_COLORS.length]})`,
                outline:       !isEraser && color === c
                                 ? `3px solid ${c}`
                                 : 'none',
                outlineOffset: '3px',
                boxShadow:     !isEraser && color === c
                                 ? `0 0 12px ${c}60`
                                 : `0 2px 6px ${c}30`,
              }}
            />
          ))}
        </div>

        {/* Brush + tools row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brush sizes */}
          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((b, i) => (
              <button
                key={b.size}
                onClick={() => { setBrushIdx(i); setIsEraser(false); }}
                className="rounded-full flex items-center justify-center transition-all active:scale-110"
                style={{
                  width:         36,
                  height:        36,
                  background:    !isEraser && brushIdx === i
                                   ? `linear-gradient(135deg, ${color}, ${RAINBOW_COLORS[(RAINBOW_COLORS.indexOf(color) + 3) % RAINBOW_COLORS.length]})`
                                   : isLetterMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
                  boxShadow:     !isEraser && brushIdx === i ? `0 3px 10px ${color}50` : 'none',
                  outline:       !isEraser && brushIdx === i ? '2px solid rgba(255,255,255,0.8)' : 'none',
                  outlineOffset: '2px',
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width:      6 + i * 5,
                    height:     6 + i * 5,
                    background: !isEraser && brushIdx === i ? '#fff' : (isLetterMode ? '#999' : 'rgba(255,255,255,0.5)'),
                  }}
                />
              </button>
            ))}
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEraser(e => !e)}
              className="px-3 py-2 rounded-2xl text-base font-bold transition-all active:scale-95"
              style={{
                background: isEraser
                  ? 'linear-gradient(135deg, #FF6B6B, #ee5a24)'
                  : isLetterMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
                boxShadow:  isEraser ? '0 3px 10px rgba(255,107,107,0.4)' : 'none',
                color:       isLetterMode && !isEraser ? '#636e72' : '#fff',
              }}
            >
              🧹
            </button>
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="px-3 py-2 rounded-2xl text-base font-bold disabled:opacity-25 active:scale-95 transition-all"
              style={{
                background: isLetterMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
                color:      isLetterMode ? '#636e72' : '#fff',
              }}
            >
              ↩️
            </button>
            <button
              onClick={clear}
              className="px-3 py-2 rounded-2xl text-base font-bold active:scale-95 transition-all"
              style={{
                background: isLetterMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
                color:      isLetterMode ? '#636e72' : '#fff',
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

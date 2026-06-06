import React, { useRef, useState, useCallback, useEffect } from 'react';

// ── Types ────────────────────────────────────────────────────────
type Point      = { x: number; y: number };
type LetterMode = 'off' | 'upper' | 'lower';

// ── Palettes ─────────────────────────────────────────────────────
const RAINBOW_COLORS = [
  '#FF6B6B','#FF9F43','#FECA57','#48DBFB',
  '#FF6FF2','#55EFC4','#A29BFE','#FD79A8',
  '#00D2D3','#FF9FF3','#54A0FF','#5F27CD',
];

const BRUSH_SIZES = [8, 16, 28, 48, 76];

const UPPER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const LETTER_COLORS = [
  '#FF6B6B','#FF9F43','#FECA57','#55EFC4','#48DBFB','#A29BFE','#FF6FF2',
  '#FD79A8','#00D2D3','#FF9FF3','#54A0FF','#5F27CD','#FF6B6B','#FF9F43',
  '#FECA57','#55EFC4','#48DBFB','#A29BFE','#FF6FF2','#FD79A8','#00D2D3',
  '#FF9FF3','#54A0FF','#5F27CD','#FF6B6B','#FF9F43',
];

// Minimum canvas-space stroke length to consider letter "done"
// Canvas is 2048×1536 — a typical letter trace is ~3000px worth of distance
const AUTO_COMPLETE_STROKE = 2800;

// ── Confetti ──────────────────────────────────────────────────────
interface ConfettiPiece { id: number; x: number; y: number; color: string; rot: number; scale: number; delay: number; }
let confettiId = 0;
const makeConfetti = (n: number): ConfettiPiece[] =>
  Array.from({ length: n }, () => ({
    id:    ++confettiId,
    x:     Math.random() * 100,
    y:     -10 - Math.random() * 20,
    color: RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)],
    rot:   Math.random() * 360,
    scale: 0.5 + Math.random() * 1,
    delay: Math.random() * 0.5,
  }));

// ── Keyframes ─────────────────────────────────────────────────────
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
  50%      { transform: scale(1.08); }
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
  50%      { transform: translateY(-5px); }
}
@keyframes mc-star-pop {
  0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
  60%  { transform: scale(1.4) rotate(10deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes mc-progress-ring {
  from { stroke-dashoffset: 226; }
}
`;

// ── Props ─────────────────────────────────────────────────────────
interface Props { onClose: () => void; }

// ── Component ─────────────────────────────────────────────────────
export const MagicCanvasScreen: React.FC<Props> = ({ onClose }) => {
  const canvasRef           = useRef<HTMLCanvasElement>(null);
  const lastPt              = useRef<Point | null>(null);
  const isDrawing           = useRef(false);
  const strokeLength        = useRef(0);          // accumulated drawing distance this letter
  const autoCompleteTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [color,            setColor]           = useState(RAINBOW_COLORS[4]);
  const [brushIdx,         setBrushIdx]        = useState(2);
  const [isEraser,         setIsEraser]        = useState(false);
  const [history,          setHistory]         = useState<ImageData[]>([]);
  const [letterMode,       setLetterMode]      = useState<LetterMode>('off');
  const [letterIdx,        setLetterIdx]       = useState(0);
  const [tick,             setTick]            = useState(0);
  const [completed,        setCompleted]       = useState<Set<number>>(new Set());
  const [confetti,         setConfetti]        = useState<ConfettiPiece[]>([]);
  const [showCelebration,  setShowCelebration] = useState(false);
  const [strokePct,        setStrokePct]       = useState(0); // 0–100% fill indicator

  const brushSize     = BRUSH_SIZES[brushIdx];
  const letters       = letterMode === 'upper' ? UPPER_LETTERS
                      : letterMode === 'lower' ? LOWER_LETTERS : [];
  const currentLetter = letters[letterIdx] ?? '';
  const isLetterMode  = letterMode !== 'off';
  const letterColor   = LETTER_COLORS[letterIdx] || '#FF6B6B';
  const starsEarned   = completed.size;
  const progressPct   = isLetterMode ? (starsEarned / 26) * 100 : 0;

  // ── Inject keyframes once ─────────────────────────────────────
  useEffect(() => {
    if (document.getElementById('mc-anim')) return;
    const s = document.createElement('style');
    s.id = 'mc-anim';
    s.textContent = ANIM_STYLE;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  // ── Canvas helpers ────────────────────────────────────────────
  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) clearCanvas(ctx, canvas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reset stroke tracking on letter/mode change ───────────────
  useEffect(() => {
    if (autoCompleteTimer.current) { clearTimeout(autoCompleteTimer.current); autoCompleteTimer.current = null; }
    strokeLength.current = 0;
    setStrokePct(0);
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

  // ── Undo snapshots ────────────────────────────────────────────
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory(h => [...h.slice(-30), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  // ── Auto-complete trigger ──────────────────────────────────────
  const triggerAutoComplete = useCallback(() => {
    if (showCelebration) return; // already celebrating
    setCompleted(prev => new Set(prev).add(letterIdx));
    setConfetti(makeConfetti(45));
    setShowCelebration(true);
    strokeLength.current = 0;
    setStrokePct(0);
    setTimeout(() => {
      setShowCelebration(false);
      setConfetti([]);
      if (letterIdx < 25) setLetterIdx(i => i + 1);
    }, 2000);
  }, [letterIdx, showCelebration]);

  // ── Drawing handlers ──────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (showCelebration) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      saveSnapshot();
      // Cancel pending auto-complete if user touches again
      if (autoCompleteTimer.current) { clearTimeout(autoCompleteTimer.current); autoCompleteTimer.current = null; }
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
    [color, brushSize, isEraser, getPoint, saveSnapshot, showCelebration],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || !lastPt.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const pt  = getPoint(e);

      // ── Accumulate stroke length for auto-complete ──
      if (!isEraser && isLetterMode) {
        const dx = pt.x - lastPt.current.x;
        const dy = pt.y - lastPt.current.y;
        strokeLength.current += Math.sqrt(dx * dx + dy * dy);
        const pct = Math.min(100, (strokeLength.current / AUTO_COMPLETE_STROKE) * 100);
        setStrokePct(pct);

        // When enough is drawn, start 1.5s auto-complete timer
        if (strokeLength.current >= AUTO_COMPLETE_STROKE && !autoCompleteTimer.current) {
          autoCompleteTimer.current = setTimeout(() => {
            triggerAutoComplete();
            autoCompleteTimer.current = null;
          }, 1500);
        }
      }

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
    [color, brushSize, isEraser, getPoint, isLetterMode, triggerAutoComplete],
  );

  const onPointerUp = useCallback(() => {
    isDrawing.current = false;
    lastPt.current    = null;
  }, []);

  // ── Manual Done ───────────────────────────────────────────────
  const manualDone = useCallback(() => {
    if (autoCompleteTimer.current) { clearTimeout(autoCompleteTimer.current); autoCompleteTimer.current = null; }
    triggerAutoComplete();
  }, [triggerAutoComplete]);

  // ── Other nav ─────────────────────────────────────────────────
  const hardClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx, canvas);
    strokeLength.current = 0;
    setStrokePct(0);
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

  const cycleLetterMode = useCallback(() => {
    setLetterMode(m => m === 'off' ? 'upper' : m === 'upper' ? 'lower' : 'off');
    setLetterIdx(0);
    setCompleted(new Set());
  }, []);

  const modeBtnLabel = letterMode === 'off'   ? '🔤 A–Z'
                     : letterMode === 'upper' ? '🔠 ABC' : '🔡 abc';

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background:    isLetterMode
          ? `linear-gradient(135deg, ${letterColor}15, #fff8f8, ${letterColor}10)`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop:    'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft:   'env(safe-area-inset-left)',
        paddingRight:  'env(safe-area-inset-right)',
      }}
    >
      {/* ── Confetti ──────────────────────────────────────────── */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 200 }}>
          {confetti.map(c => (
            <div key={c.id} style={{
              position: 'absolute', left: `${c.x}%`, top: `${c.y}%`,
              width: 12 * c.scale, height: 12 * c.scale, background: c.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              // @ts-ignore
              '--s': c.scale,
              animation: `mc-confetti-fall 2s ${c.delay}s ease-in forwards`,
            } as React.CSSProperties} />
          ))}
        </div>
      )}

      {/* ── Celebration ───────────────────────────────────────── */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 199 }}>
          <div className="flex flex-col items-center gap-3" style={{ animation: 'mc-bounce-in 0.5s ease-out' }}>
            <span style={{ fontSize: '22vmin', animation: 'mc-pulse 0.5s ease-in-out infinite' }}>⭐</span>
            <span className="font-black text-white px-8 py-4 rounded-3xl text-center"
              style={{
                fontSize: '6vmin',
                background: `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 5) % 26]})`,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                animation: 'mc-bounce-in 0.4s 0.2s ease-out both',
              }}
            >
              {letterIdx === 25 ? '🎉 Sab ho gaya! Amazing! 🎉' : `Sahi hai! ✨ ${currentLetter} seekh liya!`}
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{
          background:     'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom:   isLetterMode ? `3px solid ${letterColor}40` : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ animation: 'mc-float 2.5s ease-in-out infinite' }}>🎨</span>
          <div>
            <p className="font-black text-base leading-none"
              style={{
                background: `linear-gradient(90deg, ${isLetterMode ? letterColor : '#667eea'}, #FF6FF2)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              } as React.CSSProperties}
            >
              Magic Canvas
            </p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#888' }}>
              {isLetterMode ? `✏️ Trace karo — you got this! 💪` : '✨ Kuch bhi banao!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ABC mode toggle */}
          <button onClick={cycleLetterMode}
            className="px-4 py-2 rounded-2xl text-sm font-black active:scale-95 transition-all"
            style={{
              background: isLetterMode
                ? `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 3) % 26]})`
                : 'rgba(0,0,0,0.08)',
              color: isLetterMode ? '#fff' : '#555',
              boxShadow: isLetterMode ? `0 4px 15px ${letterColor}50` : 'none',
            }}
          >
            {modeBtnLabel}
          </button>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold active:scale-95 transition-all"
            style={{ background: 'rgba(0,0,0,0.08)', color: '#555' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PROGRESS BAR (letter mode)
      ══════════════════════════════════════════════════════════ */}
      {isLetterMode && (
        <div className="shrink-0 px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.75)' }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${LETTER_COLORS[0]}, ${LETTER_COLORS[8]}, ${LETTER_COLORS[16]}, ${LETTER_COLORS[24]})`,
                  backgroundSize: '200% 100%',
                  animation: 'mc-rainbow-bg 3s ease infinite',
                }}
              />
            </div>
            <span className="font-black text-sm" style={{ color: '#2d3436' }}>⭐ {starsEarned}/26</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          LETTER STRIP (letter mode)
      ══════════════════════════════════════════════════════════ */}
      {isLetterMode && (
        <div className="shrink-0 flex items-center gap-2 px-3 py-2"
          style={{
            background:   'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            borderBottom: `2px solid ${letterColor}25`,
          }}
        >
          <button onClick={() => setLetterIdx(i => Math.max(i - 1, 0))} disabled={letterIdx === 0}
            className="w-10 h-10 rounded-xl font-black text-xl flex items-center justify-center shrink-0 disabled:opacity-20 active:scale-95 transition-all"
            style={{ background: `${letterColor}20`, color: letterColor }}
          >‹</button>

          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
            {letters.map((ltr, i) => {
              const lc        = LETTER_COLORS[i];
              const isCurrent = i === letterIdx;
              const isDone    = completed.has(i);
              return (
                <button key={ltr} onClick={() => setLetterIdx(i)}
                  className="shrink-0 w-10 h-10 rounded-xl font-black text-sm active:scale-110 transition-all relative"
                  style={{
                    background: isCurrent
                      ? `linear-gradient(135deg, ${lc}, ${LETTER_COLORS[(i + 3) % 26]})`
                      : isDone ? `${lc}25` : 'rgba(0,0,0,0.05)',
                    color:     isCurrent ? '#fff' : isDone ? lc : '#aaa',
                    transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isCurrent ? `0 4px 12px ${lc}50` : 'none',
                    border:    isDone && !isCurrent ? `2px solid ${lc}60` : 'none',
                  }}
                >
                  {ltr}
                  {isDone && !isCurrent && (
                    <span className="absolute -top-1 -right-1 text-xs" style={{ animation: 'mc-star-pop 0.4s ease-out' }}>⭐</span>
                  )}
                </button>
              );
            })}
          </div>

          <button onClick={() => { if (letterIdx < 25) setLetterIdx(i => i + 1); }} disabled={letterIdx === 25}
            className="w-10 h-10 rounded-xl font-black text-xl flex items-center justify-center shrink-0 disabled:opacity-20 active:scale-95 transition-all"
            style={{ background: `${letterColor}20`, color: letterColor }}
          >›</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          CANVAS AREA — fills ALL remaining space
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 relative overflow-hidden"
        style={{
          background: '#fff',
          // subtle shadow inset to look like paper
          boxShadow: isLetterMode ? `inset 0 0 60px ${letterColor}08` : 'none',
        }}
      >
        {/* Ruled guide lines */}
        {isLetterMode && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} preserveAspectRatio="none">
            {[25, 50, 75].map(pct => (
              <line key={pct} x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
                stroke={`${letterColor}18`} strokeWidth="1.5" strokeDasharray="8 6" />
            ))}
            <line x1="0" y1="73%" x2="100%" y2="73%" stroke={`${letterColor}30`} strokeWidth="2" />
          </svg>
        )}

        {/* Ghost letter guide — CSS overlay behind canvas */}
        {isLetterMode && currentLetter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 1 }}>
            {/* Solid faint fill */}
            <span className="absolute" style={{
              fontSize: '60vmin',
              fontWeight: 900,
              fontFamily: '"Arial Rounded MT Bold", "Nunito", "Comic Sans MS", Arial, sans-serif',
              lineHeight: 1,
              userSelect: 'none',
              color: `${letterColor}10`,
            }}>{currentLetter}</span>
            {/* Dotted stroke outline */}
            <span className="absolute" style={{
              fontSize: '60vmin',
              fontWeight: 900,
              fontFamily: '"Arial Rounded MT Bold", "Nunito", "Comic Sans MS", Arial, sans-serif',
              lineHeight: 1,
              userSelect: 'none',
              color: 'transparent',
              WebkitTextStroke: `8px ${letterColor}35`,
            }}>{currentLetter}</span>
          </div>
        )}

        {/* Sparkle corners */}
        {isLetterMode && [
          { top: '6%', left: '4%',  delay: '0s',   size: '22px' },
          { top: '8%', right: '6%', delay: '0.6s', size: '18px' },
          { bottom: '12%', left: '8%',  delay: '1.1s', size: '20px' },
          { bottom: '8%',  right: '4%', delay: '1.7s', size: '24px' },
        ].map((pos, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ ...pos, fontSize: pos.size, zIndex: 1, animation: `mc-sparkle 2.5s ${pos.delay} ease-in-out infinite` } as React.CSSProperties}
          >✨</div>
        ))}

        {/* Drawing canvas — absolutely fills container */}
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

        {/* ── Top-left: current letter badge ── */}
        {isLetterMode && (
          <div className="absolute top-3 left-3 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl"
            style={{
              zIndex: 3,
              background: `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 4) % 26]})`,
              color: '#fff',
              boxShadow: `0 4px 15px ${letterColor}50`,
              animation: 'mc-pulse 2.5s ease-in-out infinite',
            }}
          >{currentLetter}</div>
        )}

        {/* ── Stroke progress ring (top-right) ── */}
        {isLetterMode && !showCelebration && (
          <div className="absolute top-3 right-3" style={{ zIndex: 3 }}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              {/* Background circle */}
              <circle cx="26" cy="26" r="22" fill="rgba(255,255,255,0.8)" stroke={`${letterColor}20`} strokeWidth="4" />
              {/* Progress arc */}
              <circle
                cx="26" cy="26" r="18"
                fill="none"
                stroke={`url(#prog-${letterIdx})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * strokePct / 100)}
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
              <defs>
                <linearGradient id={`prog-${letterIdx}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={letterColor} />
                  <stop offset="100%" stopColor={LETTER_COLORS[(letterIdx + 5) % 26]} />
                </linearGradient>
              </defs>
              {/* Pencil icon */}
              <text x="26" y="31" textAnchor="middle" fontSize="14">✏️</text>
            </svg>
            {/* "Draw more!" hint when just started */}
            {strokePct < 20 && (
              <div className="absolute -bottom-6 right-0 whitespace-nowrap text-xs font-bold rounded-full px-2 py-0.5"
                style={{ background: `${letterColor}20`, color: letterColor, animation: 'mc-pulse 1.5s ease-in-out infinite' }}
              >
                Likho! ✏️
              </div>
            )}
          </div>
        )}

        {/* ── Manual "Done" button — only visible once enough drawn (50%+) ── */}
        {isLetterMode && strokePct >= 50 && !showCelebration && (
          <button
            onClick={manualDone}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-base active:scale-95 transition-all"
            style={{
              zIndex:     3,
              background: `linear-gradient(135deg, ${letterColor}, ${LETTER_COLORS[(letterIdx + 5) % 26]})`,
              boxShadow:  `0 6px 25px ${letterColor}55`,
              animation:  'mc-float 2s ease-in-out infinite',
            }}
          >
            {strokePct >= 100
              ? <>✅ Done!</>
              : <>{letterIdx === 25 ? '🎉 Finish!' : `Done ✓ Next ${letters[letterIdx + 1] ?? ''} →`}</>
            }
          </button>
        )}

        {/* Free draw — floating emoji hints */}
        {!isLetterMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
            <span className="font-black text-white/20 text-2xl text-center px-8">
              ✨ Kuch bhi banao!<br/>🌈 Draw anything!
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM TOOLBAR
      ══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 px-4 pt-2.5 pb-2"
        style={{
          background:    'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop:     `2px solid ${isLetterMode ? letterColor + '25' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {/* Color row */}
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          {RAINBOW_COLORS.map((c, i) => (
            <button key={c} onClick={() => { setColor(c); setIsEraser(false); }}
              className="rounded-full transition-all active:scale-125"
              style={{
                width:         !isEraser && color === c ? 38 : 30,
                height:        !isEraser && color === c ? 38 : 30,
                background:    `linear-gradient(135deg, ${c}, ${RAINBOW_COLORS[(i + 3) % RAINBOW_COLORS.length]})`,
                outline:       !isEraser && color === c ? `3px solid ${c}` : 'none',
                outlineOffset: '3px',
                boxShadow:     !isEraser && color === c ? `0 0 12px ${c}70` : `0 2px 6px ${c}30`,
              }}
            />
          ))}
        </div>

        {/* Brush + tools row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((sz, i) => (
              <button key={sz} onClick={() => { setBrushIdx(i); setIsEraser(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-110"
                style={{
                  background: !isEraser && brushIdx === i
                    ? `linear-gradient(135deg, ${color}, ${RAINBOW_COLORS[(RAINBOW_COLORS.indexOf(color) + 3) % RAINBOW_COLORS.length]})`
                    : 'rgba(0,0,0,0.06)',
                  boxShadow: !isEraser && brushIdx === i ? `0 3px 10px ${color}50` : 'none',
                  outline: !isEraser && brushIdx === i ? '2px solid rgba(255,255,255,0.9)' : 'none',
                  outlineOffset: '2px',
                }}
              >
                <div className="rounded-full" style={{
                  width: 5 + i * 4, height: 5 + i * 4,
                  background: !isEraser && brushIdx === i ? '#fff' : '#999',
                }} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsEraser(e => !e)}
              className="px-3 py-2 rounded-2xl text-base font-bold active:scale-95 transition-all"
              style={{
                background: isEraser ? 'linear-gradient(135deg, #FF6B6B, #ee5a24)' : 'rgba(0,0,0,0.06)',
                boxShadow:  isEraser ? '0 3px 10px rgba(255,107,107,0.5)' : 'none',
                color:      isEraser ? '#fff' : '#666',
              }}
            >🧹</button>
            <button onClick={undo} disabled={history.length === 0}
              className="px-3 py-2 rounded-2xl text-base font-bold disabled:opacity-25 active:scale-95 transition-all"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}
            >↩️</button>
            <button onClick={clear}
              className="px-3 py-2 rounded-2xl text-base font-bold active:scale-95 transition-all"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}
            >🗑️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

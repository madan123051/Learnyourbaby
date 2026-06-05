import React, { useRef, useState, useCallback, useEffect } from 'react';

// ── Types ────────────────────────────────────────────────────────
type Point      = { x: number; y: number };
type LetterMode = 'off' | 'upper' | 'lower';

// ── Constants ────────────────────────────────────────────────────
const COLORS = [
  '#7B68EE','#FF6B6B','#FF9F43','#FFD700',
  '#55EFC4','#74B9FF','#FD79A8','#00B894',
  '#E17055','#6C5CE7','#2D3436','#FFFFFF',
];

const BRUSH_SIZES = [
  { label: 'XS', size: 6  },
  { label: 'S',  size: 14 },
  { label: 'M',  size: 26 },
  { label: 'L',  size: 48 },
  { label: 'XL', size: 80 },
];

const UPPER_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const BG_COLOR = '#FDF5E6'; // warm cream

// ── Props ────────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────
export const MagicCanvasScreen: React.FC<Props> = ({ onClose }) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const lastPt     = useRef<Point | null>(null);
  const isDrawing  = useRef(false);

  const [color,      setColor]      = useState(COLORS[5]); // sky blue default
  const [brushIdx,   setBrushIdx]   = useState(2);          // M default
  const [isEraser,   setIsEraser]   = useState(false);
  const [history,    setHistory]    = useState<ImageData[]>([]);
  const [letterMode, setLetterMode] = useState<LetterMode>('off');
  const [letterIdx,  setLetterIdx]  = useState(0);
  const [tick,       setTick]       = useState(0); // force re-render

  const brushSize     = BRUSH_SIZES[brushIdx].size;
  const letters       = letterMode === 'upper' ? UPPER_LETTERS
                      : letterMode === 'lower' ? LOWER_LETTERS : [];
  const currentLetter = letters[letterIdx] ?? '';
  const isLetterMode  = letterMode !== 'off';

  // ── Clear canvas (transparent when letter mode, cream otherwise) ──
  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (isLetterMode) {
      // transparent — guide letter CSS overlay shows through
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isLetterMode]);

  // ── Fill canvas on mount ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Re-clear when letter mode changes ────────────────────────
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

  // ── Coord helper: CSS px → canvas px ─────────────────────────
  const getPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left)  * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)   * (canvas.height / rect.height),
    };
  }, []);

  // ── Save undo snapshot ────────────────────────────────────────
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(h => [...h.slice(-30), snap]);
  }, []);

  // ── Hard clear ────────────────────────────────────────────────
  const hardClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx, canvas);
    setHistory([]);
    setTick(t => t + 1);
  }, [clearCanvas]);

  // ── Undo-aware clear ──────────────────────────────────────────
  const clear = useCallback(() => {
    saveSnapshot();
    hardClear();
  }, [saveSnapshot, hardClear]);

  // ── Undo ─────────────────────────────────────────────────────
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

  // ── Pointer events ────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      saveSnapshot();
      const pt  = getPoint(e);
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

  // ── Letter navigation ─────────────────────────────────────────
  const goToLetter = useCallback((idx: number) => setLetterIdx(idx), []);
  const prevLetter = useCallback(() => setLetterIdx(i => Math.max(i - 1, 0)),   []);
  const nextLetter = useCallback(() => setLetterIdx(i => Math.min(i + 1, 25)), []);

  // ── Cycle letter mode: off → ABC → abc → off ─────────────────
  const cycleLetterMode = useCallback(() => {
    setLetterMode(m =>
      m === 'off' ? 'upper' : m === 'upper' ? 'lower' : 'off'
    );
    setLetterIdx(0);
  }, []);

  // ── Derived style vars ────────────────────────────────────────
  const accentColor   = letterMode === 'upper' ? '#6C5CE7' : '#00B894';
  const modeBtnLabel  = letterMode === 'off'   ? '🔤 A–Z'
                      : letterMode === 'upper' ? '🔠 ABC'
                      :                          '🔡 abc';

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background:    '#0f0e17',
        paddingTop:    'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft:   'env(safe-area-inset-left)',
        paddingRight:  'env(safe-area-inset-right)',
      }}
    >
      {/* ── Top bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0"
           style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <p className="text-white font-black text-base leading-none">Magic Canvas</p>
            <p className="text-white/40 text-xs font-medium mt-0.5">
              {isLetterMode
                ? `✏️ Trace: ${currentLetter}  (${letterIdx + 1} / 26)`
                : 'Free draw — anything!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ABC toggle */}
          <button
            onClick={cycleLetterMode}
            className="px-3 py-1.5 rounded-2xl text-white text-sm font-black transition-all active:scale-95"
            style={{
              background:  isLetterMode ? accentColor : 'rgba(255,255,255,0.12)',
              outline:     isLetterMode ? '2px solid rgba(255,255,255,0.35)' : 'none',
              outlineOffset: '2px',
            }}
          >
            {modeBtnLabel}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg font-bold active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Letter selector strip ─────────────────────────────── */}
      {isLetterMode && (
        <div
          className="shrink-0 flex items-center gap-2 px-3 py-2"
          style={{ background: '#12122a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Prev */}
          <button
            onClick={prevLetter}
            disabled={letterIdx === 0}
            className="w-10 h-10 rounded-xl text-white font-black text-xl flex items-center justify-center disabled:opacity-20 active:scale-95 transition-all shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            ‹
          </button>

          {/* Letter pills */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
            {letters.map((ltr, i) => (
              <button
                key={ltr}
                onClick={() => goToLetter(i)}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all active:scale-110"
                style={{
                  background:    i === letterIdx ? accentColor : 'rgba(255,255,255,0.07)',
                  color:         i === letterIdx ? '#fff'       : 'rgba(255,255,255,0.4)',
                  transform:     i === letterIdx ? 'scale(1.18)' : 'scale(1)',
                  outline:       i === letterIdx ? '2px solid rgba(255,255,255,0.4)' : 'none',
                  outlineOffset: '2px',
                }}
              >
                {ltr}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={nextLetter}
            disabled={letterIdx === 25}
            className="w-10 h-10 rounded-xl text-white font-black text-xl flex items-center justify-center disabled:opacity-20 active:scale-95 transition-all shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            ›
          </button>
        </div>
      )}

      {/* ── Canvas + guide letter ─────────────────────────────── */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ background: BG_COLOR }}
      >
        {/* ── Copybook lines (letter mode only) ──────────────── */}
        {isLetterMode && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            preserveAspectRatio="none"
          >
            {/* horizontal guide lines like a school copy */}
            {[25, 50, 75].map(pct => (
              <line
                key={pct}
                x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
                stroke="rgba(180,160,220,0.25)"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
            ))}
            {/* baseline */}
            <line
              x1="0" y1="73%" x2="100%" y2="73%"
              stroke="rgba(108,92,231,0.25)"
              strokeWidth="1.5"
            />
          </svg>
        )}

        {/* ── Ghost/guide letter ──────────────────────────────── */}
        {isLetterMode && currentLetter && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ zIndex: 1 }}
          >
            {/* Outer faint fill for shape */}
            <span
              className="absolute"
              style={{
                fontSize:        '58vmin',
                fontWeight:      900,
                fontFamily:      '"Arial Rounded MT Bold", "Nunito", "Comic Sans MS", Arial, sans-serif',
                lineHeight:      1,
                userSelect:      'none',
                color:           accentColor === '#6C5CE7'
                                   ? 'rgba(108,92,231,0.08)'
                                   : 'rgba(0,184,148,0.08)',
                letterSpacing:   '-0.02em',
              }}
            >
              {currentLetter}
            </span>
            {/* Dotted outline — the tracing guide */}
            <span
              className="absolute"
              style={{
                fontSize:         '58vmin',
                fontWeight:       900,
                fontFamily:       '"Arial Rounded MT Bold", "Nunito", "Comic Sans MS", Arial, sans-serif',
                lineHeight:       1,
                userSelect:       'none',
                color:            'transparent',
                WebkitTextStroke: accentColor === '#6C5CE7'
                                    ? '10px rgba(108,92,231,0.35)'
                                    : '10px rgba(0,184,148,0.35)',
                letterSpacing:    '-0.02em',
              }}
            >
              {currentLetter}
            </span>
          </div>
        )}

        {/* ── Drawing canvas (transparent bg) ────────────────── */}
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

        {/* ── "Next letter" floating button ──────────────────── */}
        {isLetterMode && letterIdx < 25 && (
          <button
            onClick={() => { nextLetter(); }}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-white text-base shadow-2xl active:scale-95 transition-all"
            style={{
              zIndex:     3,
              background: accentColor,
              boxShadow:  `0 4px 20px ${accentColor}88`,
            }}
          >
            Next {letters[letterIdx + 1]} →
          </button>
        )}

        {/* ── "All done!" badge at Z ──────────────────────────── */}
        {isLetterMode && letterIdx === 25 && (
          <div
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-white text-base shadow-2xl"
            style={{ zIndex: 3, background: '#FFD700', color: '#1a1a2e' }}
          >
            🌟 All done!
          </div>
        )}
      </div>

      {/* ── Bottom toolbar ──────────────────────────────────────── */}
      <div
        className="shrink-0 px-4 pt-2.5 pb-3"
        style={{ background: '#1a1a2e', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Color row */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className="rounded-full transition-all active:scale-110"
              style={{
                width:         !isEraser && color === c ? 38 : 30,
                height:        !isEraser && color === c ? 38 : 30,
                background:    c,
                outline:       !isEraser && color === c
                                 ? '3px solid #fff'
                                 : '2px solid rgba(255,255,255,0.15)',
                outlineOffset: '2px',
                boxShadow:     c === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Brush + tools row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brush sizes */}
          <div className="flex items-center gap-1">
            {BRUSH_SIZES.map((b, i) => (
              <button
                key={b.label}
                onClick={() => { setBrushIdx(i); setIsEraser(false); }}
                className="rounded-full flex items-center justify-center font-black text-[11px] transition-all active:scale-110"
                style={{
                  width:         34,
                  height:        34,
                  background:    !isEraser && brushIdx === i
                                   ? color
                                   : 'rgba(255,255,255,0.1)',
                  color:         '#fff',
                  outline:       !isEraser && brushIdx === i
                                   ? '2px solid rgba(255,255,255,0.6)'
                                   : 'none',
                  outlineOffset: '2px',
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Eraser / Undo / Clear */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEraser(e => !e)}
              className="px-2.5 py-2 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: isEraser ? '#FF6B6B' : 'rgba(255,255,255,0.1)' }}
            >
              🧹
            </button>
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="px-2.5 py-2 rounded-2xl text-sm font-bold text-white bg-white/10 disabled:opacity-30 active:scale-95 transition-all"
            >
              ↩️
            </button>
            <button
              onClick={clear}
              className="px-2.5 py-2 rounded-2xl text-sm font-bold text-white bg-white/10 active:bg-red-500/60 active:scale-95 transition-all"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

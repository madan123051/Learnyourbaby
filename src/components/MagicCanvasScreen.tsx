import React, { useRef, useState, useCallback, useEffect } from 'react';

// ── Types ────────────────────────────────────────────────────────
type Point = { x: number; y: number };

// ── Constants ────────────────────────────────────────────────────
const COLORS = [
  '#7B68EE', // purple
  '#FF6B6B', // red
  '#FF9F43', // orange
  '#FFD700', // yellow
  '#55EFC4', // mint
  '#74B9FF', // sky blue
  '#FD79A8', // pink
  '#00B894', // teal
  '#E17055', // coral
  '#6C5CE7', // indigo
  '#2D3436', // dark
  '#FFFFFF', // white
];

const BRUSH_SIZES = [
  { label: 'XS', size: 4 },
  { label: 'S',  size: 10 },
  { label: 'M',  size: 20 },
  { label: 'L',  size: 40 },
  { label: 'XL', size: 70 },
];

const BG_COLOR = '#FDF5E6'; // warm cream canvas

// ── Props ────────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────
export const MagicCanvasScreen: React.FC<Props> = ({ onClose }) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const lastPt     = useRef<Point | null>(null);
  const isDrawing  = useRef(false);

  const [color,     setColor]     = useState(COLORS[0]);
  const [brushIdx,  setBrushIdx]  = useState(2); // 'M' default
  const [isEraser,  setIsEraser]  = useState(false);
  const [history,   setHistory]   = useState<ImageData[]>([]);
  const [, forceUpdate] = useState(0);

  const brushSize = BRUSH_SIZES[brushIdx].size;

  // ── Fill canvas on mount ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Coord helper: CSS pixels → canvas pixels ──────────────────
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

  // ── Pointer events ────────────────────────────────────────────
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
      const drawColor = isEraser ? BG_COLOR : color;
      const drawSize  = isEraser ? brushSize * 2.5 : brushSize;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, drawSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = drawColor;
      ctx.fill();
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
      const drawColor = isEraser ? BG_COLOR : color;
      const drawSize  = isEraser ? brushSize * 2.5 : brushSize;

      ctx.beginPath();
      ctx.moveTo(lastPt.current.x, lastPt.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = drawColor;
      ctx.lineWidth   = drawSize;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
      lastPt.current = pt;
    },
    [color, brushSize, isEraser, getPoint],
  );

  const onPointerUp = useCallback(() => {
    isDrawing.current = false;
    lastPt.current    = null;
  }, []);

  // ── Undo ─────────────────────────────────────────────────────
  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const canvas = canvasRef.current;
      if (!canvas) return h;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(h[h.length - 1], 0, 0);
      forceUpdate(n => n + 1);
      return h.slice(0, -1);
    });
  }, []);

  // ── Clear ────────────────────────────────────────────────────
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    saveSnapshot();
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    forceUpdate(n => n + 1);
  }, [saveSnapshot]);

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
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a2e] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎨</span>
          <div>
            <p className="text-white font-black text-lg leading-none">Magic Canvas</p>
            <p className="text-white/40 text-xs font-medium">Draw anything!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold active:bg-white/20 transition-all"
          aria-label="Close canvas"
        >
          ✕
        </button>
      </div>

      {/* ── Canvas area ─────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={2048}
          height={1536}
          className="w-full h-full touch-none block"
          style={{ cursor: isEraser ? 'cell' : 'crosshair' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>

      {/* ── Bottom toolbar ──────────────────────────────────── */}
      <div className="shrink-0 bg-[#1a1a2e] border-t border-white/10 px-4 pt-3 pb-3">
        {/* Color swatches */}
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className="rounded-full transition-all active:scale-110"
              style={{
                width:        !isEraser && color === c ? 40 : 32,
                height:       !isEraser && color === c ? 40 : 32,
                background:   c,
                outline:      !isEraser && color === c ? '3px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                outlineOffset: '2px',
                boxShadow:    c === '#FFFFFF' ? '0 0 0 1px rgba(255,255,255,0.3)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Brush sizes + action buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Brush sizes */}
          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((b, i) => (
              <button
                key={b.label}
                onClick={() => { setBrushIdx(i); setIsEraser(false); }}
                className="rounded-full flex items-center justify-center font-black text-[11px] transition-all active:scale-110"
                style={{
                  width:   36,
                  height:  36,
                  background: !isEraser && brushIdx === i
                    ? color
                    : 'rgba(255,255,255,0.12)',
                  color:   '#fff',
                  outline: !isEraser && brushIdx === i ? '2px solid rgba(255,255,255,0.6)' : 'none',
                  outlineOffset: '2px',
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Eraser / Undo / Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEraser(e => !e)}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: isEraser ? '#FF6B6B' : 'rgba(255,255,255,0.12)' }}
            >
              🧹 <span className="hidden sm:inline">Erase</span>
            </button>
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-sm font-bold text-white bg-white/10 disabled:opacity-30 active:scale-95 transition-all"
            >
              ↩️ <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={clear}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-sm font-bold text-white bg-white/10 active:bg-red-500/60 active:scale-95 transition-all"
            >
              🗑️ <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

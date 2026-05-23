import React, { useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };
type Stroke = Point[];

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export const MagicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [drawing, setDrawing] = useState<Stroke>([]);
  const [recognized, setRecognized] = useState<string>('Draw a big letter ✍️');

  const totalLength = useMemo(() => {
    return strokes.flatMap(s => s.slice(1).map((p, i) => distance(s[i], p))).reduce((a, b) => a + b, 0);
  }, [strokes]);

  const redraw = (allStrokes: Stroke[], current: Stroke = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FDF5E6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderStroke = (stroke: Stroke) => {
      if (stroke.length < 2) return;
      ctx.strokeStyle = '#7B68EE';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    };

    allStrokes.forEach(renderStroke);
    renderStroke(current);
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing([getPoint(e)]);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.length) return;
    const next = [...drawing, getPoint(e)];
    setDrawing(next);
    redraw(strokes, next);
  };

  const mockRecognize = (nextStrokes: Stroke[]) => {
    const segments = nextStrokes.reduce((acc, s) => acc + Math.max(s.length - 1, 0), 0);
    if (segments < 5) return 'Try a bigger letter 👀';
    const guess = letters[(Math.floor(totalLength + segments) + segments) % letters.length];
    return `Great! I think this is: ${guess}`;
  };

  const onUp = () => {
    if (!drawing.length) return;
    const next = [...strokes, drawing];
    setStrokes(next);
    setDrawing([]);
    redraw(next);
    setRecognized(mockRecognize(next));
  };

  const clearAll = () => {
    setStrokes([]);
    setDrawing([]);
    setRecognized('Draw a big letter ✍️');
    redraw([]);
  };

  return (
    <div className="h-full overflow-auto p-4 md:p-6 bg-[#fff8ed]">
      <div className="max-w-4xl mx-auto bg-white/80 rounded-[24px] p-4 shadow-sm border border-white/60">
        <h2 className="text-2xl font-black text-[#7B68EE] mb-2">Magic Canvas</h2>
        <p className="text-sm font-semibold text-slate-600 mb-4">{recognized}</p>
        <canvas
          ref={node => {
            canvasRef.current = node;
            if (node) redraw(strokes, drawing);
          }}
          width={900}
          height={420}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="w-full rounded-[24px] border-4 border-[#98FF98] touch-none bg-[#FDF5E6]"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={clearAll} className="px-4 py-2 rounded-full bg-[#FFB6C1] text-[#5a3d8e] font-bold">Clear</button>
          <button onClick={() => setRecognized(mockRecognize(strokes))} className="px-4 py-2 rounded-full bg-[#87CEEB] text-[#5a3d8e] font-bold">Recognize</button>
        </div>
      </div>
    </div>
  );
};

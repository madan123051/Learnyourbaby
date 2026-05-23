import React, { useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };
type Stroke = Point[];

const LETTER_PATTERNS: Record<string, RegExp> = {
  A: /^a(pple)?$/i,
  B: /^b(all)?$/i,
  C: /^c(at)?$/i,
};

export const MagicCanvasScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<Stroke>([]);
  const [input, setInput] = useState('');
  const [recognized, setRecognized] = useState<string | null>(null);

  const allStrokes = useMemo(() => (activeStroke.length ? [...strokes, activeStroke] : strokes), [strokes, activeStroke]);

  const draw = (nextStrokes: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FDF5E6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#7B68EE';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    nextStrokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i += 1) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    });
  };

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = pointFromEvent(e);
    setActiveStroke([start]);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStroke.length) return;
    const next = [...activeStroke, pointFromEvent(e)];
    setActiveStroke(next);
    draw([...strokes, next]);
  };

  const onPointerUp = () => {
    if (!activeStroke.length) return;
    const updated = [...strokes, activeStroke];
    setStrokes(updated);
    setActiveStroke([]);
    draw(updated);
  };

  const clearBoard = () => {
    setStrokes([]);
    setActiveStroke([]);
    setRecognized(null);
    setInput('');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FDF5E6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const runRecognition = () => {
    const cleaned = input.trim().toLowerCase();
    const hit = Object.entries(LETTER_PATTERNS).find(([, pattern]) => pattern.test(cleaned));
    setRecognized(hit ? hit[0] : 'Unknown');
  };

  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-[#87CEEB]/20">
      <div className="rounded-3xl bg-white/80 p-4 shadow">
        <h2 className="font-black text-xl text-[#7B68EE]">✨ Magic Canvas</h2>
        <p className="text-sm text-slate-600">Draw on canvas, then type what child drew to simulate ML recognition flow.</p>
      </div>

      <canvas
        ref={canvasRef}
        width={900}
        height={420}
        className="w-full rounded-3xl border-4 border-[#98FF98] touch-none"
        style={{ backgroundColor: '#FDF5E6' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />

      <div className="grid md:grid-cols-3 gap-3">
        <input
          className="input input-bordered md:col-span-2 rounded-2xl"
          placeholder="Type recognized word e.g. apple"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn rounded-2xl bg-[#FFB6C1] border-none text-[#4b2354]" onClick={runRecognition}>Recognize</button>
      </div>

      <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow">
        <span className="font-bold text-[#7B68EE]">Result: {recognized ?? 'Waiting...'}</span>
        <button className="btn btn-outline rounded-2xl" onClick={clearBoard}>Clear</button>
      </div>
    </div>
  );
};

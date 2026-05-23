import React, { useEffect, useRef, useState } from 'react';

type Bubble = { id: number; x: number; y: number; dx: number; dy: number; size: number; emoji: string };
const emojis = ['🍎', '🐱', '🫧', '🍓', '🐼', '🍊', '🐸'];

export const FloatingPlayground: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const idRef = useRef(1);

  useEffect(() => {
    setBubbles(
      Array.from({ length: 12 }).map(() => ({
        id: idRef.current++,
        x: Math.random() * 85,
        y: Math.random() * 70,
        dx: (Math.random() - 0.5) * 0.18,
        dy: (Math.random() - 0.5) * 0.18,
        size: 46 + Math.random() * 24,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }))
    );
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setBubbles(prev =>
        prev.map(b => {
          const nx = b.x + b.dx;
          const ny = b.y + b.dy;
          return {
            ...b,
            x: nx < 0 || nx > 95 ? b.x - b.dx : nx,
            y: ny < 0 || ny > 85 ? b.y - b.dy : ny,
            dx: nx < 0 || nx > 95 ? -b.dx : b.dx,
            dy: ny < 0 || ny > 85 ? -b.dy : b.dy,
          };
        })
      );
    }, 16);
    return () => clearInterval(t);
  }, []);

  const pop = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div className="h-full p-4 md:p-6 bg-[#87CEEB] relative overflow-hidden">
      <div className="max-w-5xl mx-auto h-full rounded-[24px] bg-white/20 border border-white/40 backdrop-blur relative overflow-hidden">
        <div className="absolute top-3 left-3 z-10 bg-white/80 rounded-full px-4 py-2 font-black text-[#5a3d8e]">Pop Score: {score}</div>
        {bubbles.map(b => (
          <button
            key={b.id}
            onClick={() => pop(b.id)}
            className="absolute rounded-full bg-white/80 shadow-md hover:scale-105 transition"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, fontSize: b.size * 0.5 }}
            aria-label="bubble"
          >
            {b.emoji}
          </button>
        ))}
        {bubbles.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-black text-white">Amazing! All popped 🎉</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-full bg-[#FFB6C1] text-[#5a3d8e] font-black"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

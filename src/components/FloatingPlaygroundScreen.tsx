import React, { useEffect, useMemo, useState } from 'react';

type Bubble = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
};

const EMOJIS = ['🍎', '🐻', '🍌', '🐱', '🍓', '🐸', '🍊', '🐤'];

export const FloatingPlaygroundScreen: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      size: Math.floor(Math.random() * 26) + 42,
    })),
  );
  const [score, setScore] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          let nextX = b.x + b.dx;
          let nextY = b.y + b.dy;
          let nextDx = b.dx;
          let nextDy = b.dy;
          if (nextX < 3 || nextX > 93) nextDx *= -1;
          if (nextY < 6 || nextY > 88) nextDy *= -1;
          nextX = Math.max(3, Math.min(93, nextX));
          nextY = Math.max(6, Math.min(88, nextY));
          return { ...b, x: nextX, y: nextY, dx: nextDx, dy: nextDy };
        }),
      );
    }, 24);
    return () => window.clearInterval(id);
  }, []);

  const handlePop = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 5);
  };

  const finished = useMemo(() => bubbles.length === 0, [bubbles.length]);

  return (
    <div className="h-full p-4 flex flex-col gap-4 bg-gradient-to-b from-[#87CEEB] to-[#ccefff]">
      <div className="flex justify-between items-center rounded-3xl bg-white/75 p-4">
        <h2 className="font-black text-[#7B68EE] text-xl">🎈 Floating Playground</h2>
        <span className="font-bold">⭐ {score}</span>
      </div>

      <div className="relative flex-1 rounded-3xl border-4 border-white/70 bg-[#87CEEB]/50 overflow-hidden">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            className="absolute rounded-full bg-white/85 shadow-lg transition-transform hover:scale-110"
            style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, width: bubble.size, height: bubble.size, transform: 'translate(-50%, -50%)' }}
            onClick={() => handlePop(bubble.id)}
          >
            <span style={{ fontSize: bubble.size * 0.45 }}>{bubble.emoji}</span>
          </button>
        ))}

        {finished && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-3xl bg-white p-6 text-center shadow-xl">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-black text-[#7B68EE]">All popped!</p>
              <button className="btn mt-3 rounded-2xl" onClick={() => window.location.reload()}>Restart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

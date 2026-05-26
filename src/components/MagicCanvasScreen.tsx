import React, { useRef, useState, useCallback, useEffect } from 'react';

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; width: number };
type Stamp = { emoji: string; x: number; y: number; id: number; size: number };

// ============================================================
// PALETTE
// ============================================================
const COLORS = [
  '#E74C3C', '#E67E22', '#F1C40F', '#2ECC71',
  '#3498DB', '#9B59B6', '#1ABC9C', '#E91E63',
  '#FF5722', '#795548', '#000000', '#FFFFFF',
];

const BG_COLORS = [
  '#FFFDE7', '#E8F5E9', '#E3F2FD', '#FCE4EC',
  '#F3E5F5', '#FFF3E0', '#E0F2F1', '#1a1a2e',
];

const BRUSH_SIZES = [4, 8, 14, 22];

const STAMPS = [
  '⭐','❤️','🌟','🌸','🎈','🦋','🌈','☀️',
  '🐶','🐱','🐸','🦁','🐘','🦊','🐰','🐙',
  '🍎','🍌','🍓','🍕','🍰','🌺','🌻','🎵',
  'A','B','C','1','2','3',
];

// ============================================================
// VOICE RESPONSE DATABASE
// ============================================================
const DRAWING_RESPONSES: { keywords: string[]; message: string; emoji: string }[] = [
  { keywords: ['dog','puppy','woof'], message: '🐶 A dog! いぬ (Inu) in Japanese! Woof woof! 🐾', emoji: '🐶' },
  { keywords: ['cat','kitty','meow'], message: '🐱 A cat! ねこ (Neko) in Japanese! Nyaa nyaa! 🐾', emoji: '🐱' },
  { keywords: ['sun','sunny','sunshine'], message: '☀️ The sun! たいよう (Taiyou) in Japanese! So bright and warm! 🌞', emoji: '☀️' },
  { keywords: ['moon','luna'], message: '🌙 The moon! つき (Tsuki) in Japanese! It lights up the night! ⭐', emoji: '🌙' },
  { keywords: ['star','stars'], message: '⭐ Stars! ほし (Hoshi) in Japanese! You\'re a shining star! 🌟', emoji: '⭐' },
  { keywords: ['tree','forest'], message: '🌳 A tree! き (Ki) in Japanese! Trees give us clean air! 🌿', emoji: '🌳' },
  { keywords: ['flower','rose','petal'], message: '🌸 A flower! はな (Hana) in Japanese! So beautiful! 🌺', emoji: '🌸' },
  { keywords: ['house','home','building'], message: '🏠 A house! いえ (Ie) in Japanese! Home sweet home! 🏡', emoji: '🏠' },
  { keywords: ['fish','ocean','sea'], message: '🐟 A fish! さかな (Sakana) in Japanese! Swim swim glub glub! 🌊', emoji: '🐟' },
  { keywords: ['bird','fly','wing'], message: '🐦 A bird! とり (Tori) in Japanese! Tweet tweet! Can you fly? 🌤️', emoji: '🐦' },
  { keywords: ['rainbow'], message: '🌈 A rainbow! にじ (Niji) in Japanese! 7 beautiful colors! 🎨', emoji: '🌈' },
  { keywords: ['heart','love'], message: '❤️ A heart! こころ (Kokoro) in Japanese! Full of love! 💕', emoji: '❤️' },
  { keywords: ['apple','fruit'], message: '🍎 An apple! りんご (Ringo) in Japanese! Yummy and red! 😋', emoji: '🍎' },
  { keywords: ['car','truck','vehicle'], message: '🚗 A car! くるま (Kuruma) in Japanese! Vroom vroom! 🏁', emoji: '🚗' },
  { keywords: ['ball','circle','round'], message: '⚽ A ball! ボール (Booru) in Japanese! Kick it! ⚽🏀', emoji: '⚽' },
  { keywords: ['elephant'], message: '🐘 An elephant! ぞう (Zou) in Japanese! So BIG and strong! 💪', emoji: '🐘' },
  { keywords: ['cloud','sky'], message: '☁️ Clouds! くも (Kumo) in Japanese! So fluffy! Float away! 🌤️', emoji: '☁️' },
  { keywords: ['person','people','man','woman','boy','girl','child'], message: '🧒 A person! ひと (Hito) in Japanese! Is that you? 😊', emoji: '🧒' },
  { keywords: ['butterfly','bug','insect'], message: '🦋 A butterfly! ちょう (Chou) in Japanese! Flutter flutter! 🌸', emoji: '🦋' },
  { keywords: ['boat','ship','water'], message: '⛵ A boat! ふね (Fune) in Japanese! Sail sail on the ocean! 🌊', emoji: '⛵' },
  { keywords: ['snake','dragon','worm'], message: '🐍 A snake or dragon! ヘビ (Hebi) in Japanese! So cool! 🔥', emoji: '🐍' },
  { keywords: ['mountain','hill'], message: '⛰️ A mountain! やま (Yama) in Japanese! So tall! Can you climb it? 🧗', emoji: '⛰️' },
  { keywords: ['banana'], message: '🍌 A banana! バナナ (Banana) in Japanese! Yellow and yummy! 🌟', emoji: '🍌' },
  { keywords: ['cake','birthday'], message: '🎂 A cake! ケーキ (Keeki) in Japanese! Happy birthday! 🎉🎂', emoji: '🎂' },
  { keywords: ['rocket','space','planet'], message: '🚀 A rocket! ロケット (Roketto) in Japanese! Zoom to the moon! 🌙⭐', emoji: '🚀' },
];

const getDrawingResponse = (text: string): { message: string; emoji: string } => {
  const lower = text.toLowerCase();
  for (const r of DRAWING_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return { message: r.message, emoji: r.emoji };
  }
  const funs = [
    { message: `✨ Amazing "${text}" drawing! とても上手！(Totemo jouzu!) So talented! 🌟`, emoji: '🎨' },
    { message: `🌟 Wow "${text}"! すごい！(Sugoi!) That's INCREDIBLE art! Keep drawing! 🖌️`, emoji: '🌟' },
    { message: `🎉 Beautiful "${text}"! You're a real artist! アーティスト (Aatisuto)! 🎨`, emoji: '🎉' },
  ];
  return funs[Math.floor(Math.random() * funs.length)];
};

// ============================================================
// MAGIC CANVAS COMPONENT
// ============================================================
export const MagicCanvasScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<Stroke | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedBrush, setSelectedBrush] = useState(BRUSH_SIZES[1]);
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const [isErasing, setIsErasing] = useState(false);
  const [recognized, setRecognized] = useState<{ message: string; emoji: string } | null>(null);
  const [listening, setListening] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const recRef = useRef<SpeechRecognition | null>(null);

  const redraw = useCallback((strokeList: Stroke[], bg: string, stampList: Stamp[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw stamps
    ctx.font = '38px serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    stampList.forEach((s) => ctx.fillText(s.emoji, s.x, s.y));
    // Draw strokes
    strokeList.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      ctx.stroke();
    });
  }, []);

  useEffect(() => { redraw(strokes, bgColor, stamps); }, [bgColor]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPoint(e);
    setActiveStroke({ points: [pt], color: isErasing ? bgColor : selectedColor, width: isErasing ? selectedBrush * 3 : selectedBrush });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStroke) return;
    const updated = { ...activeStroke, points: [...activeStroke.points, getPoint(e)] };
    setActiveStroke(updated);
    redraw([...strokes, updated], bgColor, stamps);
  };

  const onPointerUp = () => {
    if (!activeStroke) return;
    const updated = [...strokes, activeStroke];
    setStrokes(updated);
    setActiveStroke(null);
    redraw(updated, bgColor, stamps);
  };

  const undo = () => {
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    redraw(updated, bgColor, stamps);
  };

  const clearAll = () => {
    setStrokes([]); setActiveStroke(null); setStamps([]); setRecognized(null);
    redraw([], bgColor, []);
  };

  const handleBgChange = (c: string) => {
    setBgColor(c);
    redraw(strokes, c, stamps);
  };

  const placeStamp = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
    const y = Math.random() * canvas.height * 0.7 + canvas.height * 0.15;
    const newStamp: Stamp = { emoji, x, y, id: Date.now(), size: 38 };
    const updated = [...stamps, newStamp];
    setStamps(updated);
    redraw(strokes, bgColor, updated);
    setShowStamps(false);
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Use Chrome or Safari for voice! 🎤'); return; }
    try {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.onstart = () => setListening(true);
      rec.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        setRecognized(getDrawingResponse(text));
        setListening(false);
        // Speak the response
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const res = getDrawingResponse(text);
          const utter = new SpeechSynthesisUtterance(res.message.replace(/[^\w\s!?.,']/g, ' '));
          utter.rate = 0.9; utter.pitch = 1.2;
          window.speechSynthesis.speak(utter);
        }
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
      rec.start();
    } catch (e) { setListening(false); }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #e8f5ff 0%, #fff0f9 100%)' }}
    >
      {/* TOP TOOLBAR */}
      <div className="flex-none px-3 pt-3 pb-2 space-y-2">

        {/* Row 1: Title + Actions */}
        <div className="flex items-center justify-between">
          <h2 className="font-black text-base" style={{ color: '#7B68EE' }}>✨ Magic Canvas</h2>
          <div className="flex gap-1.5">
            <button onClick={undo}
              className="w-9 h-9 rounded-xl bg-white shadow flex items-center justify-center text-base active:scale-90 transition-all"
              title="Undo">↩️</button>
            <button onClick={clearAll}
              className="w-9 h-9 rounded-xl bg-white shadow flex items-center justify-center text-base active:scale-90 transition-all"
              title="Clear all">🗑️</button>
            <button onClick={() => setShowStamps(!showStamps)}
              className={`w-9 h-9 rounded-xl shadow flex items-center justify-center text-base active:scale-90 transition-all ${showStamps ? 'bg-yellow-200' : 'bg-white'}`}
              title="Stamps">🎨</button>
          </div>
        </div>

        {/* Row 2: Colors */}
        <div className="flex gap-1.5 flex-wrap items-center">
          {COLORS.map((c) => (
            <button key={c} onClick={() => { setSelectedColor(c); setIsErasing(false); }}
              className="rounded-full border-4 transition-all active:scale-90"
              style={{
                width: 26, height: 26,
                backgroundColor: c,
                borderColor: selectedColor === c && !isErasing ? '#7B68EE' : 'rgba(0,0,0,0.1)',
                transform: selectedColor === c && !isErasing ? 'scale(1.25)' : 'scale(1)',
                boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : 'none',
              }}
            />
          ))}
          <button onClick={() => setIsErasing(!isErasing)}
            className={`px-2.5 rounded-full text-xs font-bold h-7 transition-all ${isErasing ? 'bg-gray-700 text-white' : 'bg-white text-gray-600 border-2 border-gray-200'}`}>
            ⬜ Erase
          </button>
        </div>

        {/* Row 3: Brush sizes */}
        <div className="flex gap-1.5 items-center">
          <span className="text-xs font-bold text-gray-400 mr-1">Size:</span>
          {BRUSH_SIZES.map((s) => (
            <button key={s} onClick={() => setSelectedBrush(s)}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-all active:scale-90"
              style={{ border: `3px solid ${selectedBrush === s ? '#7B68EE' : '#ddd'}` }}>
              <div className="rounded-full"
                style={{
                  width: Math.min(s * 0.9, 20),
                  height: Math.min(s * 0.9, 20),
                  backgroundColor: isErasing ? '#bbb' : selectedColor,
                }}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-gray-400 ml-2">BG:</span>
          {BG_COLORS.map((c) => (
            <button key={c} onClick={() => handleBgChange(c)}
              className="w-5 h-5 rounded-md border-2 transition-all active:scale-90"
              style={{ backgroundColor: c, borderColor: bgColor === c ? '#7B68EE' : 'rgba(0,0,0,0.15)' }}
            />
          ))}
        </div>

        {/* Stamps Panel */}
        {showStamps && (
          <div className="p-2 bg-white rounded-2xl shadow-lg border border-purple-100">
            <p className="text-xs font-bold text-purple-400 mb-1.5">🎨 Tap to place a stamp!</p>
            <div className="flex flex-wrap gap-1">
              {STAMPS.map((s) => (
                <button key={s} onClick={() => placeStamp(s)}
                  className="w-9 h-9 text-xl flex items-center justify-center rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-90 transition-all font-bold"
                  style={{ fontFamily: s.length === 1 && s >= 'A' ? 'Arial Black, sans-serif' : 'inherit' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CANVAS */}
      <div className="flex-1 px-3 min-h-0">
        <canvas
          ref={canvasRef}
          width={900}
          height={560}
          className="w-full h-full rounded-2xl shadow-lg"
          style={{
            backgroundColor: bgColor,
            touchAction: 'none',
            cursor: isErasing ? 'cell' : 'crosshair',
            display: 'block',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>

      {/* BOTTOM — Voice */}
      <div className="flex-none px-3 pb-3 pt-2">
        <button
          onClick={startVoice}
          disabled={listening}
          className="w-full py-3 rounded-2xl font-black text-white text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          style={{
            background: listening
              ? 'linear-gradient(135deg, #ff4757, #c0392b)'
              : 'linear-gradient(135deg, #a855f7, #6C5CE7)',
          }}
        >
          <span className="text-xl">{listening ? '🔴' : '🎤'}</span>
          {listening ? 'Listening... say what you drew!' : 'Tell me what you drew! 🎤'}
        </button>

        {recognized && (
          <div className="mt-2 rounded-2xl p-3 flex items-center gap-3 shadow border-2"
            style={{ background: '#f3e7ff', borderColor: '#d8b4fe' }}>
            <span className="text-4xl">{recognized.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-purple-800 text-sm leading-snug">{recognized.message}</p>
            </div>
            <button onClick={() => setRecognized(null)}
              className="text-purple-300 hover:text-purple-500 text-xl font-bold shrink-0">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

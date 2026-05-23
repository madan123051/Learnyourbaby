import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, MicOff } from 'lucide-react';

interface ChatMessage { id: number; role: 'user' | 'sumi'; text: string; }
interface HistoryEntry { role: 'user' | 'model'; text: string; }

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const SYSTEM_PROMPT = `You are "Sumi Sensei", a warm, enthusiastic, and incredibly patient AI Kindergarten teacher.
Teach only English and Japanese for ages 3-7 through games and stories.
Always keep responses short (2-3 sentences), fun, emoji-rich, and child-friendly.
Never use Nepali or Hindi.
Mode handling is mandatory:
- Explore Mode (default): if the child says or taps a single word/topic (e.g. Dog, Car, Red), treat it as curiosity, not an answer check. Celebrate and teach immediately.
- Quiz Mode: only use retry language when you previously asked a specific question and the child answered wrong.
Never say "Oh close" in Explore Mode.
When teaching a Japanese word, always include English meaning + Japanese script + Romaji in brackets.
Add playful sound effects when possible.
End every response with a line exactly like: [CHIPS: Option1 | Option2 | Option3]`;

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const DEFAULT_CHIPS = ['Dog 🐶', 'Car 🚗', 'Red 🔴', 'Play a game! 🎮'];
const WELCOME = `Yay! 🎉 Hi friend! I am Sumi Sensei 🌸\nLet's play and learn English + Japanese!\nWhat do you want first? 🧸`;

export const SumiSensei: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, role: 'sumi', text: WELCOME }]);
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const parseChips = (text: string) => {
    const m = text.match(/\[CHIPS:\s*([^\]]+)\]/);
    if (!m) return { clean: text, quick: DEFAULT_CHIPS };
    const quick = m[1].split('|').map(t => t.trim()).filter(Boolean);
    return {
      clean: text.replace(/\[CHIPS:[^\]]+\]/, '').trim(),
      quick: quick.length ? quick : DEFAULT_CHIPS,
    };
  };

  const askGemini = async (userText: string) => {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY as string | undefined;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);

    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'sumi',
        text: `I'm not connected to cloud yet, but let's explore! 🌈\nTry tapping Dog 🐶, Car 🚗, or Red 🔴. 🔑`,
      }]);
      return;
    }

    setIsLoading(true);
    const newHistory: HistoryEntry[] = [...history, { role: 'user', text: userText }];

    try {
      const res = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: newHistory.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          generationConfig: { temperature: 0.9, maxOutputTokens: 250 },
        }),
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Yay! Let's learn together! 🌟 [CHIPS: Dog 🐶 | Car 🚗 | Red 🔴]";
      const { clean, quick } = parseChips(text);
      setMessages(prev => [...prev, { id: Date.now() + 2, role: 'sumi', text: clean }]);
      setHistory([...newHistory, { role: 'model', text: clean }]);
      setChips(quick);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        role: 'sumi',
        text: "Boing! Let's keep exploring words together! 🧸 Tap a fun button!",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    setIsListening(true);
    rec.start();
    rec.onresult = (e: any) => {
      setIsListening(false);
      askGemini(e.results[0][0].transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`chat ${m.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            {m.role === 'sumi' && (
              <div className="chat-image avatar"><div className="w-10 rounded-full bg-pink-300 flex items-center justify-center">🌸</div></div>
            )}
            <div className={`chat-bubble ${m.role === 'user' ? 'chat-bubble-primary' : 'bg-white text-gray-800'}`}>{m.text}</div>
          </div>
        ))}
        {isLoading && <div className="chat chat-start"><div className="chat-bubble bg-white"><Loader2 className="animate-spin" size={18} /></div></div>}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {chips.map(c => (
          <button key={c} className="btn btn-sm rounded-full border-pink-400 text-pink-600 bg-white" disabled={isLoading} onClick={() => askGemini(c)}>{c}</button>
        ))}
      </div>

      <div className="bg-white border-t border-pink-100 p-4 flex justify-center">
        <button
          onClick={handleMic}
          disabled={isLoading}
          className="w-24 h-24 rounded-full text-white flex items-center justify-center shadow-lg"
          style={{ background: isListening ? '#ef4444' : 'linear-gradient(135deg,#ec4899,#a855f7)' }}
        >
          {isListening ? <MicOff size={38} /> : <Mic size={38} />}
        </button>
      </div>
    </div>
  );
};

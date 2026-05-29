import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { VOCABULARY } from '../data/vocabulary';

interface ChatMessage {
  id: number;
  role: 'user' | 'sumi';
  text: string;
  emoji?: string;
}

const SUMI_RESPONSES: Record<string, string> = {};
// Build a lookup from keywords to vocab
VOCABULARY.forEach(v => {
  const eng = v.trilingual_content.english.word.toLowerCase();
  const nep = v.trilingual_content.nepali.word;
  const jpn = v.trilingual_content.japanese.word;
  const kana = v.trilingual_content.japanese.kana;
  const response = `${v.trilingual_content.emoji} Great question!\n\n🇬🇧 English: **${v.trilingual_content.english.word}** (${v.trilingual_content.english.phonics})\n"${v.trilingual_content.english.sentence}"\n\n🇳🇵 नेपाली: **${v.trilingual_content.nepali.word}** (${v.trilingual_content.nepali.roman})\n"${v.trilingual_content.nepali.sentence}"\n\n🇯🇵 日本語: **${v.trilingual_content.japanese.word}** (${v.trilingual_content.japanese.kana} / ${v.trilingual_content.japanese.romaji})\n"${v.trilingual_content.japanese.sentence}"`;
  SUMI_RESPONSES[eng] = response;
  SUMI_RESPONSES[nep] = response;
  SUMI_RESPONSES[jpn] = response;
  SUMI_RESPONSES[kana] = response;
});

const GREETING = `नमस्ते! 🙏 I'm **Sumi Sensei** — your trilingual teacher!\n\nMujhe koi bhi shabd puchho aur main tumhe 3 bhashaaon mein sikhaungi! 🎓\n\nTry typing: **dog**, **apple**, **red**, or any word!`;

const SUGGESTIONS = ['Dog 🐶', 'Apple 🍎', 'Red 🔴', 'One 1️⃣', 'Rice 🍚', 'Eyes 👀'];

export const SumiSensei: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'sumi', text: GREETING, emoji: '👩‍🏫' },
  ]);
  const [input, setInput] = useState('');

  const findResponse = (query: string): string => {
    const q = query.toLowerCase().trim();
    // Direct match
    if (SUMI_RESPONSES[q]) return SUMI_RESPONSES[q];
    // Partial match
    for (const key of Object.keys(SUMI_RESPONSES)) {
      if (q.includes(key) || key.includes(q)) {
        return SUMI_RESPONSES[key];
      }
    }
    return `🤔 Hmm, I don't know that word yet! Try asking about: **animals**, **fruits**, **colors**, **numbers**, **body parts**, or **food**!\n\nFor example: "dog", "apple", "red", "one", "eyes", "rice"`;
  };

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: msg.replace(/\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u, '') };
    const response = findResponse(msg);
    const sumiMsg: ChatMessage = { id: Date.now() + 1, role: 'sumi', text: response, emoji: '👩‍🏫' };

    setMessages(prev => [...prev, userMsg, sumiMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            {msg.role === 'sumi' && (
              <div className="chat-image avatar placeholder">
                <div className="bg-primary text-primary-content w-10 rounded-full">
                  <span className="text-xl">👩‍🏫</span>
                </div>
              </div>
            )}
            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble'}`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-1' : ''}>
                  {line.split('**').map((part, j) =>
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              className="btn btn-xs btn-outline btn-primary whitespace-nowrap"
              onClick={() => handleSend(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-base-200 border-t border-base-300">
        <div className="flex gap-2">
          <input
            className="input input-bordered flex-1 input-sm"
            placeholder="Type a word to learn..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button className="btn btn-primary btn-sm" onClick={() => handleSend()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

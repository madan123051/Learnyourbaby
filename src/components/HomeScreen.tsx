import React, { useState } from 'react';
import { VOCABULARY } from '../data/vocabulary';

interface HomeScreenProps {
  onWordLearned: (wordId: string) => void;
  learnedWords: string[];
}

const BIOMES = [
  { id: 'Fruits', title: 'Fruit Forest 🍎', deco: '🌳🍓🍌', color: 'from-pink-100 to-orange-100' },
  { id: 'Animals', title: 'Animal Safari 🦁', deco: '🦒🌴🐘', color: 'from-yellow-100 to-lime-100' },
  { id: 'Colors', title: 'Rainbow River 🎨', deco: '🌈💧🎈', color: 'from-cyan-100 to-purple-100' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onWordLearned, learnedWords }) => {
  const [activeBiome, setActiveBiome] = useState<string>('Fruits');
  const words = VOCABULARY.filter(v => v.meta_data.category === activeBiome).slice(0, 6);

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-[#5a3d8e]">🗺️ Magic World Map</h2>
        <p className="text-sm text-slate-600">Tap biomes and discover words with Sumi Sensei</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {BIOMES.map(b => (
          <button
            key={b.id}
            onClick={() => setActiveBiome(b.id)}
            className={`rounded-3xl p-4 text-left shadow-md border-2 transition-all active:scale-95 bg-gradient-to-br ${b.color} ${activeBiome === b.id ? 'border-purple-400' : 'border-transparent'}`}
          >
            <div className="text-sm font-bold text-slate-700">{b.title}</div>
            <div className="text-2xl mt-2">{b.deco}</div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white/80 p-4 shadow-md">
        <h3 className="font-extrabold mb-3">🌟 {activeBiome} discoveries</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {words.map(word => (
            <button
              key={word.meta_data.id}
              onClick={() => onWordLearned(word.meta_data.id)}
              className="rounded-2xl bg-gradient-to-b from-white to-purple-50 p-3 min-h-28 border border-purple-100 active:scale-95"
            >
              <div className="text-3xl">{word.trilingual_content.emoji}</div>
              <div className="font-bold mt-1">{word.trilingual_content.english.word}</div>
              <div className="text-xs text-slate-600">{word.trilingual_content.japanese.kana} ({word.trilingual_content.japanese.romaji})</div>
              {learnedWords.includes(word.meta_data.id) && <div className="text-xs mt-1 text-emerald-600 font-bold">+4 ⭐ collected</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Map, Sparkles, Stars, Pencil, Circle } from 'lucide-react';
import { TabId, UserProgress, GameFeatureTab } from './types';
import { HomeScreen } from './components/HomeScreen';
import { SumiSensei } from './components/SumiSensei';
import { GamesScreen } from './components/GamesScreen';
import { MagicCanvasScreen } from './components/MagicCanvasScreen';
import { FloatingPlaygroundScreen } from './components/FloatingPlaygroundScreen';

type Tab = {
  id: GameFeatureTab;
  icon: React.ReactNode;
  label: string;
};

const TABS: Tab[] = [
  { id: 'home', icon: <Map size={20} />, label: 'World Map' },
  { id: 'sumi', icon: <Sparkles size={20} />, label: 'Treehouse' },
  { id: 'games', icon: <Stars size={20} />, label: 'Pop Quiz' },
  { id: 'magicCanvas', icon: <Pencil size={20} />, label: 'Magic Canvas' },
  { id: 'floatingPlayground', icon: <Circle size={20} />, label: 'Floating' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GameFeatureTab>('home');
  const [progress, setProgress] = useState<UserProgress>({
    totalStars: 0,
    wordsLearned: [],
    quizzesCompleted: 0,
    gamesPlayed: 0,
    streak: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('sumiProgress');
    if (saved) {
      try { setProgress(JSON.parse(saved)); } catch (e) { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sumiProgress', JSON.stringify(progress));
  }, [progress]);

  const handleWordLearned = (wordId: string) => {
    setProgress(prev => ({
      ...prev,
      wordsLearned: prev.wordsLearned.includes(wordId) ? prev.wordsLearned : [...prev.wordsLearned, wordId],
      totalStars: prev.wordsLearned.includes(wordId) ? prev.totalStars : prev.totalStars + 4,
    }));
  };

  const handleStarsEarned = (points: number) => {
    setProgress(prev => ({ ...prev, totalStars: prev.totalStars + points }));
  };

  const handleQuizCompleted = () => {
    setProgress(prev => ({ ...prev, quizzesCompleted: prev.quizzesCompleted + 1 }));
  };

  const handleGamePlayed = () => {
    setProgress(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#fff8ed] via-[#f4f8ff] to-[#eefdf6]">
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-white/40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg sm:text-xl font-black text-[#5a3d8e]">🌸 Sumi Play World</h1>
          <div className="rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 font-bold shadow-sm">⭐ {progress.totalStars}</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'home' && <HomeScreen onWordLearned={handleWordLearned} learnedWords={progress.wordsLearned} />}
        {activeTab === 'sumi' && <SumiSensei />}
        {activeTab === 'games' && <GamesScreen onStarsEarned={handleStarsEarned} onQuizCompleted={handleQuizCompleted} onGamePlayed={handleGamePlayed} />}
        {activeTab === 'magicCanvas' && <MagicCanvasScreen />}
        {activeTab === 'floatingPlayground' && <FloatingPlaygroundScreen />}
      </div>

      <div className="sticky bottom-0 bg-white/85 backdrop-blur border-t border-white/60">
        <div className="grid grid-cols-5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 rounded-2xl transition-all ${
                activeTab === tab.id ? 'text-[#6b46c1] bg-purple-50' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

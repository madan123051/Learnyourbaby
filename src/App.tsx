import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Gamepad2, Trophy } from 'lucide-react';
import { TabId, UserProgress } from './types';
import { HomeScreen } from './components/HomeScreen';
import { SumiSensei } from './components/SumiSensei';
import { GamesScreen } from './components/GamesScreen';
import { StarsScreen } from './components/StarsScreen';

type Tab = {
  id: TabId;
  icon: React.ReactNode;
  label: string;
};

const TABS: Tab[] = [
  { id: 'home', icon: <Home size={20} />, label: 'Learn' },
  { id: 'sumi', icon: <Sparkles size={20} />, label: 'Sumi AI' },
  { id: 'games', icon: <Gamepad2 size={20} />, label: 'Games' },
  { id: 'stars', icon: <Trophy size={20} />, label: 'Progress' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
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
      totalStars: prev.totalStars + 5,
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

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onWordLearned={handleWordLearned} learnedWords={progress.wordsLearned} />;
      case 'sumi': return <SumiSensei />;
      case 'games': return <GamesScreen onStarsEarned={handleStarsEarned} onQuizCompleted={handleQuizCompleted} onGamePlayed={handleGamePlayed} />;
      case 'stars': return <StarsScreen totalStars={progress.totalStars} wordsLearned={progress.wordsLearned} quizzesCompleted={progress.quizzesCompleted} gamesPlayed={progress.gamesPlayed} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-100">
      <div className="sticky top-0 bg-base-100 border-b border-base-300 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">🌸 Sumi Sensei</h1>
          <div className="flex items-center gap-2 bg-base-200 px-3 py-1 rounded-full">
            <span>⭐</span>
            <span className="font-bold">{progress.totalStars}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
      <div className="sticky bottom-0 bg-base-100 border-t border-base-300">
        <div className="flex justify-around">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-base-content/50 hover:text-base-content'
              }`}
            >
              {tab.icon}
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

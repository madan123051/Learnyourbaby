import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Gamepad2, Trophy, Brush } from 'lucide-react';
import { TabId, UserProgress } from './types';
import { HomeScreen } from './components/HomeScreen';
import { SumiSensei } from './components/SumiSensei';
import { GamesScreen } from './components/GamesScreen';
import { StarsScreen } from './components/StarsScreen';
import { FloatingPlaygroundScreen } from './components/FloatingPlaygroundScreen';
import { MagicCanvasScreen } from './components/MagicCanvasScreen';
import { useIsPad } from './hooks/useIsPad';
import { LanguageProvider, useLang } from './context/LanguageContext';
import { Lang, LANG_FLAGS, LANG_LABELS } from './i18n';

const LANGS: Lang[] = ['en', 'ja', 'ne'];

// ── Inner app — can use useLang() ──────────────────────────────────────────
const AppInner: React.FC = () => {
  const { lang, setLang, t } = useLang();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isKioskMode, setIsKioskMode] = useState(false);
  const isPad = useIsPad();

  const [progress, setProgress] = useState<UserProgress>({
    totalStars: 0,
    wordsLearned: [],
    quizzesCompleted: 0,
    gamesPlayed: 0,
    streak: 0,
  });

  type Tab = { id: TabId; icon: React.ReactNode; label: string; emoji: string };
  const TABS: Tab[] = [
    { id: 'home',               icon: <Home size={22} />,                  label: t.tabLearn,    emoji: '📚' },
    { id: 'sumi',               icon: <Sparkles size={22} />,              label: t.tabSumi,     emoji: '✨' },
    { id: 'games',              icon: <Gamepad2 size={22} />,              label: t.tabGames,    emoji: '🎮' },
    { id: 'magicCanvas',        icon: <Brush size={22} />,                 label: t.tabCanvas,   emoji: '🎨' },
    { id: 'stars',              icon: <Trophy size={22} />,                label: t.tabProgress, emoji: '🏆' },
    { id: 'floatingPlayground', icon: <span className="text-lg">🎈</span>, label: t.tabFloating, emoji: '🎈' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('sumiProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress({
          ...parsed,
          totalStars: !parsed.totalStars || isNaN(parsed.totalStars) ? 0 : parsed.totalStars,
        });
      } catch (e) { console.error(e); }
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

  const handleStarsEarned   = (pts: number) => setProgress(p => ({ ...p, totalStars: p.totalStars + pts }));
  const handleQuizCompleted = ()            => setProgress(p => ({ ...p, quizzesCompleted: p.quizzesCompleted + 1 }));
  const handleGamePlayed    = ()            => setProgress(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));

  const renderContent = (onEnterKiosk?: () => void) => {
    switch (activeTab) {
      case 'home':               return <HomeScreen onWordLearned={handleWordLearned} learnedWords={progress.wordsLearned} />;
      case 'sumi':               return <SumiSensei />;
      case 'games':              return <GamesScreen onStarsEarned={handleStarsEarned} onQuizCompleted={handleQuizCompleted} onGamePlayed={handleGamePlayed} />;
      case 'magicCanvas':        return <MagicCanvasScreen />;
      case 'stars':              return <StarsScreen totalStars={progress.totalStars} wordsLearned={progress.wordsLearned} quizzesCompleted={progress.quizzesCompleted} gamesPlayed={progress.gamesPlayed} />;
      case 'floatingPlayground': return <FloatingPlaygroundScreen onEnterKiosk={onEnterKiosk} />;
      default:                   return null;
    }
  };

  const activeTabInfo = TABS.find(tab => tab.id === activeTab);
  const safeStars = !progress.totalStars || isNaN(progress.totalStars) ? 0 : progress.totalStars;

  // Reusable language switcher
  const LangSwitcher = () => (
    <div className="flex items-center gap-1">
      {LANGS.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`btn btn-xs rounded-full gap-0.5 ${lang === l ? 'btn-primary' : 'btn-ghost opacity-50 hover:opacity-100'}`}
        >
          <span>{LANG_FLAGS[l]}</span>
          <span className="text-[10px] font-bold">{LANG_LABELS[l]}</span>
        </button>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────
  // KIOSK MODE: full-bleed playground, zero chrome
  // ─────────────────────────────────────────────
  if (isKioskMode) {
    return (
      <div className="h-[100dvh] w-full overflow-hidden bg-black">
        <FloatingPlaygroundScreen
          kioskMode={true}
          onExitKiosk={() => setIsKioskMode(false)}
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // iPad Layout: Sidebar navigation
  // ─────────────────────────────────────────────
  if (isPad) {
    return (
      <div className="flex h-[100dvh] bg-base-100 overflow-hidden">

        {/* ── Sidebar ── */}
        <div
          className="w-64 flex flex-col bg-base-200 border-r border-base-300 shrink-0"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
          }}
        >
          {/* App title + language switcher */}
          <div className="px-5 pt-6 pb-4 border-b border-base-300">
            <h1 className="text-2xl font-extrabold tracking-tight">{t.appTitle}</h1>
            <p className="text-xs text-base-content/40 mt-0.5">{t.appSubtitle}</p>
            <div className="mt-3">
              <LangSwitcher />
            </div>
          </div>

          {/* Stars badge */}
          <div className="mx-4 mt-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-amber-600/70 font-semibold">{t.starsEarned}</p>
              <p className="text-2xl font-extrabold text-amber-600 leading-none">{safeStars}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 mt-5 space-y-1 overflow-y-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-content font-bold shadow-sm'
                    : 'text-base-content/60 hover:bg-base-300 hover:text-base-content font-medium'
                }`}
              >
                {tab.icon}
                <span className="text-[15px]">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-base-300">
            <p className="text-[11px] text-base-content/25 text-center">{t.madeWith}</p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          <div className="bg-base-100 border-b border-base-300 px-6 py-4 flex items-center gap-3 shrink-0">
            <span className="text-2xl">{activeTabInfo?.emoji}</span>
            <h2 className="text-xl font-bold">{activeTabInfo?.label}</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            {renderContent(() => setIsKioskMode(true))}
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Phone Layout: Bottom tab bar + top header
  // ─────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[100dvh] bg-base-100">

      {/* Top header with language switcher */}
      <div className="sticky top-0 bg-base-100 border-b border-base-300 z-10">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <h1 className="text-base font-bold shrink-0">Sumi Sensei</h1>
          <LangSwitcher />
          <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-full shrink-0">
            <span>⭐</span>
            <span className="font-bold text-sm">{safeStars}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {renderContent(() => setIsKioskMode(true))}
      </div>

      {/* Bottom tab bar */}
      <div className="sticky bottom-0 bg-base-100 border-t border-base-300" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex justify-around">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-base-content/50 hover:text-base-content'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

// ── Root — provides language context ──────────────────────────────────────
const App: React.FC = () => (
  <LanguageProvider>
    <AppInner />
  </LanguageProvider>
);

export default App;

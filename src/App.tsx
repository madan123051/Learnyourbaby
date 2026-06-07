import React, { useState, useEffect } from 'react';
import { TabId, UserProgress } from './types';
import { HomeScreen } from './components/HomeScreen';
import { SumiSensei } from './components/SumiSensei';
import { GamesScreen } from './components/GamesScreen';
import { StarsScreen } from './components/StarsScreen';
import { FloatingPlaygroundScreen } from './components/FloatingPlaygroundScreen';
import { MagicCanvasScreen } from './components/MagicCanvasScreen';
import { useIsPad } from './hooks/useIsPad';
import { useLang } from './context/LanguageContext';
import { Lang } from './i18n';

const F = "'Nunito', 'Baloo 2', sans-serif";

type Tab = {
  id: TabId;
  label: string;
  emoji: string;
  color: string;
};

const TABS: Tab[] = [
  { id: 'home',               label: 'Learn',    emoji: '📚', color: '#FF6BAA' },
  { id: 'sumi',               label: 'Sumi AI',  emoji: '✨', color: '#7c6bff' },
  { id: 'games',              label: 'Games',    emoji: '🎮', color: '#3B9EFF' },
  { id: 'magicCanvas',        label: 'Canvas',   emoji: '🎨', color: '#ED6E1C' },
  { id: 'stars',              label: 'Stars',    emoji: '🏆', color: '#FFB800' },
  { id: 'floatingPlayground', label: 'Play',     emoji: '🎈', color: '#38A169' },
];

const LANG_OPTIONS: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ja', flag: '🇯🇵', label: 'JA' },
  { code: 'ne', flag: '🇳🇵', label: 'NE' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isKioskMode, setIsKioskMode] = useState(false);
  const isPad = useIsPad();
  const { lang, setLang } = useLang();

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

  const handleWordLearned   = (wordId: string) => setProgress(p => ({ ...p, wordsLearned: p.wordsLearned.includes(wordId) ? p.wordsLearned : [...p.wordsLearned, wordId], totalStars: p.totalStars + 5 }));
  const handleStarsEarned   = (pts: number)    => setProgress(p => ({ ...p, totalStars: p.totalStars + pts }));
  const handleQuizCompleted = ()               => setProgress(p => ({ ...p, quizzesCompleted: p.quizzesCompleted + 1 }));
  const handleGamePlayed    = ()               => setProgress(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));

  const renderContent = (onEnterKiosk?: () => void) => {
    switch (activeTab) {
      case 'home':               return <HomeScreen onWordLearned={handleWordLearned} learnedWords={progress.wordsLearned} />;
      case 'sumi':               return <SumiSensei />;
      case 'games':              return <GamesScreen onStarsEarned={handleStarsEarned} onQuizCompleted={handleQuizCompleted} onGamePlayed={handleGamePlayed} />;
      case 'magicCanvas':        return null;
      case 'stars':              return <StarsScreen totalStars={progress.totalStars} wordsLearned={progress.wordsLearned} quizzesCompleted={progress.quizzesCompleted} gamesPlayed={progress.gamesPlayed} />;
      case 'floatingPlayground': return <FloatingPlaygroundScreen onEnterKiosk={onEnterKiosk} />;
      default:                   return null;
    }
  };

  const safeStars = !progress.totalStars || isNaN(progress.totalStars) ? 0 : progress.totalStars;

  // Language switcher buttons — reused in both layouts
  const LangSwitcher = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.2rem',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '99px',
      padding: '0.2rem',
    }}>
      {LANG_OPTIONS.map(opt => {
        const isActive = lang === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setLang(opt.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '99px',
              border: 'none',
              background: isActive ? '#fff' : 'transparent',
              color: isActive ? '#FF5FA0' : 'rgba(255,255,255,0.8)',
              fontFamily: F,
              fontWeight: isActive ? 900 : 700,
              fontSize: '0.7rem',
              cursor: 'pointer',
              boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s',
              WebkitTapHighlightColor: 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.flag} {opt.label}
          </button>
        );
      })}
    </div>
  );

  // ── MAGIC CANVAS ──────────────────────────────────────────────────────────
  if (activeTab === 'magicCanvas') {
    return <MagicCanvasScreen onClose={() => setActiveTab('home')} />;
  }

  // ── KIOSK MODE ────────────────────────────────────────────────────────────
  if (isKioskMode) {
    return (
      <div style={{ height: '100dvh', width: '100%', overflow: 'hidden', background: '#000' }}>
        <FloatingPlaygroundScreen kioskMode={true} onExitKiosk={() => setIsKioskMode(false)} />
      </div>
    );
  }

  // ── iPad Layout: Sidebar ──────────────────────────────────────────────────
  if (isPad) {
    return (
      <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: 'linear-gradient(135deg, #fff5fa 0%, #f5f0ff 100%)' }}>

        {/* Sidebar */}
        <div style={{
          width: '220px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #ff80b5 0%, #7c6bff 100%)',
          borderRight: '4px solid #FFD6EC',
          flexShrink: 0,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        }}>
          <div style={{ padding: '1.25rem 1rem 0.85rem', borderBottom: '3px solid rgba(255,255,255,0.3)' }}>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: '1.3rem', color: '#fff', margin: 0, textShadow: '1px 2px 0 rgba(0,0,0,0.15)' }}>
              🌈 LearnYourBaby
            </h1>
            {/* Language switcher in sidebar */}
            <div style={{ marginTop: '0.6rem' }}>
              <LangSwitcher />
            </div>
          </div>

          {/* Stars badge */}
          <div style={{
            margin: '0.85rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: '#FFF3C4',
            border: '3px solid #FFD966',
            borderRadius: '1.2rem',
            padding: '0.6rem 0.85rem',
            boxShadow: '0 3px 0 #FFD966',
          }}>
            <span style={{ fontSize: '1.8rem' }}>⭐</span>
            <div>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: '0.65rem', color: '#795B00', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Stars earned</p>
              <p style={{ fontFamily: F, fontWeight: 900, fontSize: '1.6rem', color: '#FFB800', lineHeight: 1, margin: 0 }}>{safeStars}</p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '0 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '1rem',
                    border: isActive ? '2.5px solid rgba(255,255,255,0.6)' : '2.5px solid transparent',
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span style={{ fontSize: '1.35rem' }}>{tab.emoji}</span>
                  <span style={{
                    fontFamily: F,
                    fontWeight: isActive ? 900 : 700,
                    fontSize: '0.95rem',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div style={{ padding: '0.75rem 1rem', borderTop: '3px solid rgba(255,255,255,0.3)', textAlign: 'center' }}>
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Made with ❤️ for babies</p>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.25rem',
            background: `${(TABS.find(t => t.id === activeTab)?.color ?? '#FF6BAA')}15`,
            borderBottom: `3px solid ${(TABS.find(t => t.id === activeTab)?.color ?? '#FF6BAA')}30`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '1.6rem' }}>{TABS.find(t => t.id === activeTab)?.emoji}</span>
            <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: '1.2rem', color: TABS.find(t => t.id === activeTab)?.color ?? '#FF6BAA', margin: 0 }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {renderContent(() => setIsKioskMode(true))}
          </div>
        </div>
      </div>
    );
  }

  // ── Phone Layout ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'linear-gradient(160deg, #fff5fa 0%, #f5f0ff 55%, #f0f9ff 100%)' }}>

      {/* Top header */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(135deg, #ff80b5 0%, #ffb347 55%, #ffe066 100%)',
        borderBottom: '4px solid #ffb080',
        padding: '0.55rem 0.85rem',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          {/* Title */}
          <h1 style={{
            fontFamily: F,
            fontWeight: 900,
            fontSize: '1.1rem',
            color: '#fff',
            margin: 0,
            lineHeight: 1.1,
            textShadow: '1px 2px 0 rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}>
            🌈 LearnYourBaby
          </h1>

          {/* Language switcher — EN / JA / NE */}
          <LangSwitcher />

          {/* Stars */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '99px',
            padding: '0.25rem 0.6rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '1rem' }}>⭐</span>
            <span style={{ fontFamily: F, fontWeight: 900, fontSize: '1rem', color: '#FF8C00' }}>
              {safeStars}
            </span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderContent(() => setIsKioskMode(true))}
      </div>

      {/* Bottom tab bar */}
      <div style={{
        flexShrink: 0,
        background: '#fff',
        borderTop: '3px solid #ffe4f0',
        paddingBottom: 'env(safe-area-inset-bottom)',
        position: 'sticky',
        bottom: 0,
        zIndex: 20,
      }}>
        <div style={{ display: 'flex' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.45rem 0.1rem 0.5rem',
                  gap: '0.1rem',
                  background: isActive ? `${tab.color}12` : 'transparent',
                  border: 'none',
                  borderTop: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{tab.emoji}</span>
                <span style={{
                  fontFamily: F,
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.62rem',
                  color: isActive ? tab.color : '#bbb',
                  lineHeight: 1,
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default App;

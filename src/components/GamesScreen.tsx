import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RotateCcw, Zap, CheckCircle, XCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { TrilingualWord, ClassLevel } from '../types';
import { VOCABULARY } from '../data/vocabulary';
import { useLang } from '../context/LanguageContext';
import { Lang } from '../i18n';

interface GamesScreenProps {
  onStarsEarned: (points: number) => void;
  onQuizCompleted: () => void;
  onGamePlayed: () => void;
}

type GameMode = 'menu' | 'levelSelect' | 'quiz' | 'matching';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== Level Config =====
interface LevelConfig {
  id: ClassLevel;
  label: string;
  emoji: string;
  ageRange: string;
  description: string;
  questionsPerQuiz: number;
  starMultiplier: number;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  ringColor: string;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 'Nursery',
    label: 'Nursery',
    emoji: '🌱',
    ageRange: 'Age 3–4',
    description: 'Animals, colors & numbers',
    questionsPerQuiz: 5,
    starMultiplier: 1,
    gradient: 'from-green-400 to-emerald-500',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    ringColor: 'ring-green-300',
  },
  {
    id: 'Class1',
    label: 'Class 1',
    emoji: '⭐',
    ageRange: 'Age 5–6',
    description: 'Fruits, body parts & food',
    questionsPerQuiz: 8,
    starMultiplier: 1,
    gradient: 'from-yellow-400 to-amber-500',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-700',
    ringColor: 'ring-yellow-300',
  },
  {
    id: 'Class2',
    label: 'Class 2',
    emoji: '🌟',
    ageRange: 'Age 6–7',
    description: 'Shapes, weather & classroom',
    questionsPerQuiz: 10,
    starMultiplier: 1.5,
    gradient: 'from-blue-400 to-cyan-500',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    ringColor: 'ring-blue-300',
  },
  {
    id: 'Class3',
    label: 'Class 3',
    emoji: '💫',
    ageRange: 'Age 7–8',
    description: 'Transport, family & actions',
    questionsPerQuiz: 10,
    starMultiplier: 2,
    gradient: 'from-purple-400 to-violet-500',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    ringColor: 'ring-purple-300',
  },
  {
    id: 'Class4',
    label: 'Class 4–5',
    emoji: '🏆',
    ageRange: 'Age 8–10',
    description: 'Emotions, nature & places',
    questionsPerQuiz: 12,
    starMultiplier: 2.5,
    gradient: 'from-orange-400 to-red-500',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    ringColor: 'ring-orange-300',
  },
];

// ===== Option button config (A B C D) =====
const OPTION_STYLE = [
  { label: 'A', base: 'bg-rose-50 border-2 border-rose-200 text-rose-900',    chip: 'bg-rose-200 text-rose-700' },
  { label: 'B', base: 'bg-sky-50 border-2 border-sky-200 text-sky-900',       chip: 'bg-sky-200 text-sky-700' },
  { label: 'C', base: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-900', chip: 'bg-emerald-200 text-emerald-700' },
  { label: 'D', base: 'bg-amber-50 border-2 border-amber-200 text-amber-900', chip: 'bg-amber-200 text-amber-700' },
];

// Per-language praise arrays — no Hindi anywhere
const PRAISE_RIGHT_LANG: Record<Lang, string[]> = {
  en: ['Well done! 🎉', 'Perfect! ✨', 'Excellent! 🌟', 'Great! 🥳', 'Awesome! 🎊'],
  ja: ['よくできた！🎉', 'パーフェクト！✨', 'すごい！🌟', 'すばらしい！🥳', 'さいこう！🎊'],
  ne: ['शाबास! 🎉', 'एकदम सही! ✨', 'उत्कृष्ट! 🌟', 'राम्रो! 🥳', 'अद्भुत! 🎊'],
};

const PRAISE_WRONG_LANG: Record<Lang, string[]> = {
  en: ['Keep going! 💪', 'Try again! 🔁', 'You can do it! 😊', 'Almost! 🤗'],
  ja: ['続けて！💪', 'もう一度！🔁', 'できるよ！😊', 'おしい！🤗'],
  ne: ['कोसिस गर! 💪', 'फेरि प्रयास! 🔁', 'तपाईं सक्नुहुन्छ! 😊', 'नजिक! 🤗'],
};

// ===========================
// LEVEL SELECT SCREEN
// ===========================
const LevelSelectScreen: React.FC<{
  onSelect: (l: ClassLevel) => void;
  onBack: () => void;
}> = ({ onSelect, onBack }) => {
  const { t } = useLang();

  const getBest = (id: string): number => {
    try { return JSON.parse(localStorage.getItem('lybQuizBest') || '{}')[id] || 0; }
    catch { return 0; }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 border-b border-base-200 px-4 pt-4 pb-3 flex items-center gap-3">
        <button className="btn btn-ghost btn-sm btn-circle" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-extrabold text-lg leading-tight">📝 {t.quizTitle}</h2>
          <p className="text-xs text-base-content/50">{t.pickLevel}</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {LEVEL_CONFIGS.map((cfg) => {
          const count = VOCABULARY.filter(w => w.meta_data.class_level === cfg.id).length;
          const best  = getBest(cfg.id);
          return (
            <button
              key={cfg.id}
              onClick={() => onSelect(cfg.id)}
              className="w-full text-left rounded-2xl border border-base-200 bg-base-100 p-4 flex items-center gap-4 active:scale-[0.98] hover:shadow-md transition-all"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-3xl shadow flex-shrink-0`}>
                {cfg.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base">{cfg.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}>
                    {cfg.ageRange}
                  </span>
                  {best > 0 && (
                    <span className="text-xs text-amber-500 font-bold">⭐ {best}</span>
                  )}
                </div>
                <p className="text-sm text-base-content/60 truncate">{cfg.description}</p>
                <div className="flex gap-3 mt-1 text-xs text-base-content/40">
                  <span>📖 {count} words</span>
                  <span>❓ {cfg.questionsPerQuiz} questions</span>
                  <span>✨ ×{cfg.starMultiplier} stars</span>
                </div>
              </div>

              <ChevronRight size={20} className="text-base-content/30 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===========================
// QUIZ GAME
// ===========================
interface QuizQuestion {
  word: TrilingualWord;
  shuffledOptions: string[];
}

const QuizGame: React.FC<{
  level: ClassLevel;
  onStarsEarned: (p: number) => void;
  onComplete: () => void;
  onBack: () => void;
}> = ({ level, onStarsEarned, onComplete, onBack }) => {
  const { lang, t } = useLang();
  const cfg = LEVEL_CONFIGS.find(c => c.id === level)!;

  const [questions, setQuestions]       = useState<QuizQuestion[]>([]);
  const [qi, setQi]                     = useState(0);
  const [selected, setSelected]         = useState<string | null>(null);
  const [score, setScore]               = useState(0);
  const [done, setDone]                 = useState(false);
  const [feedback, setFeedback]         = useState<{ text: string; ok: boolean } | null>(null);

  const buildQuestions = useCallback((): QuizQuestion[] => {
    const pool   = VOCABULARY.filter(w => w.meta_data.class_level === level);
    const source = pool.length >= cfg.questionsPerQuiz ? pool : shuffleArray([...VOCABULARY]);
    return shuffleArray(source)
      .slice(0, cfg.questionsPerQuiz)
      .map(word => ({
        word,
        shuffledOptions: shuffleArray([...word.interactive_quiz.options]),
      }));
  }, [level, cfg.questionsPerQuiz]);

  useEffect(() => {
    const qs = buildQuestions();
    setQuestions(qs);
    setQi(0); setSelected(null); setScore(0); setDone(false); setFeedback(null);
  }, [buildQuestions]);

  const currentQ = questions[qi];
  if (!currentQ && !done) return null;

  const totalPossible = questions.reduce(
    (acc, q) => acc + Math.round(q.word.interactive_quiz.star_points * cfg.starMultiplier), 0
  );

  const handleAnswer = (opt: string) => {
    if (selected || !currentQ) return;
    setSelected(opt);

    const isCorrect = opt === currentQ.word.interactive_quiz.correct_answer;
    const pts = Math.round(currentQ.word.interactive_quiz.star_points * cfg.starMultiplier);
    const newScore = isCorrect ? score + pts : score;

    if (isCorrect) setScore(newScore);

    const praiseRight = PRAISE_RIGHT_LANG[lang];
    const praiseWrong = PRAISE_WRONG_LANG[lang];

    setFeedback({
      text: isCorrect
        ? praiseRight[Math.floor(Math.random() * praiseRight.length)]
        : praiseWrong[Math.floor(Math.random() * praiseWrong.length)],
      ok: isCorrect,
    });

    setTimeout(() => {
      setFeedback(null);
      if (qi + 1 >= questions.length) {
        try {
          const bests = JSON.parse(localStorage.getItem('lybQuizBest') || '{}');
          bests[level] = Math.max(bests[level] || 0, newScore);
          localStorage.setItem('lybQuizBest', JSON.stringify(bests));
        } catch { /* ignore */ }
        onStarsEarned(newScore);
        setDone(true);
      } else {
        setQi(q => q + 1);
        setSelected(null);
      }
    }, 1400);
  };

  // ===== DONE SCREEN =====
  if (done) {
    const pct   = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
    const medal = pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '💪';
    const msg   = pct >= 80 ? t.quizResultExcellent : pct >= 50 ? t.quizResultGood : t.quizResultKeepGoing;

    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-5xl shadow-lg`}>
          {medal}
        </div>
        <h2 className="text-2xl font-extrabold">{t.quizComplete}</h2>
        <span className={`px-4 py-1 rounded-full text-sm font-bold ${cfg.badgeBg} ${cfg.badgeText}`}>
          {cfg.emoji} {cfg.label} · {cfg.ageRange}
        </span>

        {/* Score ring */}
        <div className={`w-32 h-32 rounded-full ring-4 ${cfg.ringColor} flex flex-col items-center justify-center bg-base-100 shadow`}>
          <span className="text-3xl font-extrabold text-amber-500">⭐ {score}</span>
          <span className="text-xs text-base-content/40">/ {totalPossible}</span>
        </div>

        <div className="w-full max-w-xs bg-base-200 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${cfg.gradient} h-3 rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-base-content/60">{pct}% correct</p>
        <p className={`font-bold text-base ${cfg.badgeText}`}>{msg}</p>

        <div className="flex gap-3 mt-2">
          <button
            className="btn btn-sm gap-2 rounded-xl font-bold"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', border: 'none' }}
            onClick={() => {
              const qs = buildQuestions();
              setQuestions(qs); setQi(0); setSelected(null); setScore(0); setDone(false); setFeedback(null);
            }}
          >
            <RotateCcw size={14} /> {t.playAgain}
          </button>
          <button className="btn btn-sm btn-outline rounded-xl" onClick={() => { onComplete(); onBack(); }}>
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  const { word, shuffledOptions } = currentQ;
  const numOpts = shuffledOptions.length;

  return (
    <div className="flex flex-col h-full px-4 pt-3 pb-4 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button className="btn btn-ghost btn-sm btn-circle" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.badgeBg} ${cfg.badgeText}`}>
          {cfg.emoji} {cfg.label}
        </span>
        <span className="font-extrabold text-amber-500 text-sm">⭐ {score}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center mb-3">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < qi
                ? 'bg-base-300 w-2'
                : i === qi
                ? `bg-gradient-to-r ${cfg.gradient} w-6`
                : 'bg-base-200 w-2'
            }`}
          />
        ))}
      </div>

      {/* Question counter */}
      <p className="text-center text-xs text-base-content/40 mb-3">
        Question {qi + 1} of {questions.length}
      </p>

      {/* Big emoji */}
      <div className="flex justify-center mb-3">
        <span className="text-8xl leading-none select-none">{word.trilingual_content.emoji}</span>
      </div>

      {/* Question card */}
      <div className={`rounded-2xl border border-base-200 ${cfg.badgeBg} p-4 mb-4 text-center`}>
        <p className="font-extrabold text-base leading-snug">{word.interactive_quiz.question_nepali}</p>
        <p className="text-xs text-base-content/50 mt-1">
          {word.trilingual_content.english.word} / {word.trilingual_content.nepali.word}
        </p>
      </div>

      {/* Options grid */}
      <div className={`grid gap-2.5 ${numOpts === 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {shuffledOptions.map((opt, idx) => {
          const os  = OPTION_STYLE[idx % OPTION_STYLE.length];
          const isAnswered = !!selected;
          const isThis     = opt === selected;
          const isCorrect  = opt === word.interactive_quiz.correct_answer;

          let cls = `${os.base} rounded-2xl p-3.5 flex items-center gap-2.5 font-semibold text-sm transition-all active:scale-95 w-full text-left`;
          if (isAnswered) {
            if (isCorrect) {
              cls = 'bg-green-400 border-2 border-green-500 text-white rounded-2xl p-3.5 flex items-center gap-2.5 font-semibold text-sm w-full text-left';
            } else if (isThis) {
              cls = 'bg-red-400 border-2 border-red-500 text-white rounded-2xl p-3.5 flex items-center gap-2.5 font-semibold text-sm w-full text-left';
            }
          }

          return (
            <button
              key={opt}
              className={cls}
              onClick={() => handleAnswer(opt)}
              disabled={isAnswered}
            >
              <span
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold
                  ${isAnswered && (isCorrect || isThis) ? 'bg-white/30 text-white' : os.chip}`}
              >
                {os.label}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              {isAnswered && isCorrect && <CheckCircle size={16} className="flex-shrink-0" />}
              {isAnswered && isThis && !isCorrect && <XCircle size={16} className="flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Floating praise toast */}
      {feedback && (
        <div className="fixed inset-x-0 bottom-28 flex justify-center pointer-events-none z-50">
          <div
            className={`px-6 py-3 rounded-2xl text-lg font-extrabold shadow-xl animate-bounce
              ${feedback.ok ? 'bg-green-400 text-white' : 'bg-amber-300 text-amber-900'}`}
          >
            {feedback.text}
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================
// MATCHING GAME
// ===========================
interface MatchTile {
  id: string;
  text: string;
  pairId: string;
  matched: boolean;
}

const MatchingGame: React.FC<{
  onStarsEarned: (p: number) => void;
  onGamePlayed: () => void;
  onBack: () => void;
}> = ({ onStarsEarned, onGamePlayed, onBack }) => {
  const { t } = useLang();
  const [tiles, setTiles]               = useState<MatchTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [wrongPair, setWrongPair]       = useState<string[]>([]);
  const [score, setScore]               = useState(0);
  const [done, setDone]                 = useState(false);

  const initGame = useCallback(() => {
    const words = shuffleArray(VOCABULARY).slice(0, 6);
    const pairs: MatchTile[] = [];
    words.forEach(w => {
      pairs.push({ id: w.meta_data.id + '_eng', text: `${w.trilingual_content.emoji} ${w.trilingual_content.english.word}`, pairId: w.meta_data.id, matched: false });
      pairs.push({ id: w.meta_data.id + '_jpn', text: `${w.trilingual_content.japanese.kana} (${w.trilingual_content.japanese.romaji})`, pairId: w.meta_data.id, matched: false });
    });
    setTiles(shuffleArray(pairs));
    setSelectedTile(null); setWrongPair([]); setScore(0); setDone(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleTileClick = (tileId: string) => {
    if (wrongPair.length > 0) return;
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.matched) return;
    if (!selectedTile) { setSelectedTile(tileId); return; }
    if (selectedTile === tileId) { setSelectedTile(null); return; }
    const first = tiles.find(t => t.id === selectedTile);
    if (!first) return;

    if (first.pairId === tile.pairId) {
      const updated = tiles.map(ti => ti.pairId === tile.pairId ? { ...ti, matched: true } : ti);
      const newScore = score + 15;
      setTiles(updated); setScore(newScore); setSelectedTile(null);
      if (updated.every(ti => ti.matched)) { onStarsEarned(newScore); onGamePlayed(); setDone(true); }
    } else {
      setWrongPair([selectedTile, tileId]);
      setTimeout(() => { setWrongPair([]); setSelectedTile(null); }, 800);
    }
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
      <span className="text-6xl">🏆</span>
      <h2 className="text-2xl font-extrabold">{t.allMatched}</h2>
      <p className="text-4xl font-bold text-amber-500">⭐ {score}</p>
      <p className="text-base-content/60">{t.matchWell}</p>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-primary btn-sm rounded-xl" onClick={initGame}><RotateCcw size={14} /> {t.playAgain}</button>
        <button className="btn btn-outline btn-sm rounded-xl" onClick={onBack}>{t.back}</button>
      </div>
    </div>
  );

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onBack}><ArrowLeft size={16} /></button>
          <h3 className="font-bold">{t.matchHeading}</h3>
        </div>
        <span className="font-bold text-amber-500">⭐ {score}</span>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-2 auto-rows-min">
        {tiles.map(tile => {
          const isSel   = selectedTile === tile.id;
          const isWrong = wrongPair.includes(tile.id);
          let cls = 'btn btn-outline h-auto min-h-16 text-xs leading-tight rounded-xl';
          if (tile.matched)   cls = 'btn btn-success h-auto min-h-16 text-xs leading-tight rounded-xl opacity-60';
          else if (isWrong)   cls = 'btn btn-error h-auto min-h-16 text-xs leading-tight rounded-xl';
          else if (isSel)     cls = 'btn btn-primary h-auto min-h-16 text-xs leading-tight rounded-xl';
          return (
            <button key={tile.id} className={cls} onClick={() => handleTileClick(tile.id)} disabled={tile.matched}>
              {tile.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===========================
// MAIN GAMES SCREEN
// ===========================
export const GamesScreen: React.FC<GamesScreenProps> = ({ onStarsEarned, onQuizCompleted, onGamePlayed }) => {
  const { t } = useLang();
  const [mode, setMode]                   = useState<GameMode>('menu');
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel | null>(null);

  if (mode === 'levelSelect') {
    return (
      <LevelSelectScreen
        onSelect={(l) => { setSelectedLevel(l); setMode('quiz'); }}
        onBack={() => setMode('menu')}
      />
    );
  }

  if (mode === 'quiz' && selectedLevel) {
    return (
      <QuizGame
        level={selectedLevel}
        onStarsEarned={onStarsEarned}
        onComplete={onQuizCompleted}
        onBack={() => setMode('levelSelect')}
      />
    );
  }

  if (mode === 'matching') {
    return <MatchingGame onStarsEarned={onStarsEarned} onGamePlayed={onGamePlayed} onBack={() => setMode('menu')} />;
  }

  // ===== MENU =====
  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold">{t.gamesHeading}</h2>
        <p className="text-base-content/60 mt-1">{t.gamesSubtitle}</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {/* MCQ Quiz card */}
        <button
          className="w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-violet-200 p-5 flex items-center gap-4 active:scale-[0.98] hover:shadow-lg transition-all text-left"
          onClick={() => setMode('levelSelect')}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-3xl shadow flex-shrink-0">
            📝
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg">{t.quizTitle}</h3>
            <p className="text-sm text-base-content/60">{t.quizLevelRange}</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {LEVEL_CONFIGS.map(l => (
                <span key={l.id} className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${l.badgeBg} ${l.badgeText}`}>{l.emoji} {l.label}</span>
              ))}
            </div>
          </div>
          <Zap className="text-violet-400 flex-shrink-0" size={24} />
        </button>

        {/* Matching Game card */}
        <button
          className="w-full rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-cyan-200 p-5 flex items-center gap-4 active:scale-[0.98] hover:shadow-lg transition-all text-left"
          onClick={() => setMode('matching')}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl shadow flex-shrink-0">
            🧩
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg">{t.matchTitle}</h3>
            <p className="text-sm text-base-content/60">{t.matchDesc}</p>
            <p className="text-xs text-base-content/40 mt-0.5">{t.matchPairs}</p>
          </div>
          <Trophy className="text-cyan-400 flex-shrink-0" size={24} />
        </button>
      </div>
    </div>
  );
};

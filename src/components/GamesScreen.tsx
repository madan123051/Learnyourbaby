import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RotateCcw, Zap, CheckCircle } from 'lucide-react';
import { TrilingualWord } from '../types';
import { VOCABULARY, CATEGORIES } from '../data/vocabulary';

interface GamesScreenProps {
  onStarsEarned: (points: number) => void;
  onQuizCompleted: () => void;
  onGamePlayed: () => void;
}

type GameMode = 'menu' | 'quiz' | 'matching';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== QUIZ COMPONENT =====
const QuizGame: React.FC<{
  onStarsEarned: (p: number) => void;
  onComplete: () => void;
  onBack: () => void;
}> = ({ onStarsEarned, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<TrilingualWord[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestions(shuffleArray(VOCABULARY).slice(0, 10));
    setQi(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, []);

  const currentQ = questions[qi];
  if (!currentQ) return null;

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt === currentQ.interactive_quiz.correct_answer;
    if (isCorrect) {
      setScore(s => s + currentQ.interactive_quiz.star_points);
    }

    setTimeout(() => {
      if (qi + 1 >= questions.length) {
        const finalScore = isCorrect ? score + currentQ.interactive_quiz.star_points : score;
        onStarsEarned(finalScore);
        onComplete();
        setDone(true);
      } else {
        setQi(q => q + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <span className="text-6xl mb-4">🎉</span>
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-primary mb-2">⭐ {score} Stars</p>
        <p className="text-base-content/60 mb-6">Amazing work! 🎉</p>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => {
            setQuestions(shuffleArray(VOCABULARY).slice(0, 10));
            setQi(0); setSelected(null); setScore(0); setDone(false);
          }}>
            <RotateCcw size={16} /> Play Again
          </button>
          <button className="btn btn-outline" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <span className="badge badge-primary">Q {qi + 1}/{questions.length}</span>
        <span className="font-bold">⭐ {score}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-5xl mb-4">{currentQ.trilingual_content.emoji}</span>
        <h3 className="text-lg font-bold text-center mb-6 px-2">
          {currentQ.interactive_quiz.question}
        </h3>

        <div className="w-full max-w-sm space-y-3">
          {currentQ.interactive_quiz.options.map(opt => {
            let cls = 'btn btn-outline w-full';
            if (selected) {
              if (opt === currentQ.interactive_quiz.correct_answer) {
                cls = 'btn btn-success w-full';
              } else if (opt === selected) {
                cls = 'btn btn-warning w-full';
              }
            }
            return (
              <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                {selected && opt === currentQ.interactive_quiz.correct_answer && <CheckCircle size={16} />}
                                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <progress className="progress progress-primary w-full" value={qi + 1} max={questions.length} />
    </div>
  );
};

// ===== MATCHING GAME =====
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
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const initGame = useCallback(() => {
    const words = shuffleArray(VOCABULARY).slice(0, 6);
    const tilePairs: MatchTile[] = [];
    words.forEach(w => {
      tilePairs.push({
        id: w.meta_data.id + '_eng',
        text: `${w.trilingual_content.emoji} ${w.trilingual_content.english.word}`,
        pairId: w.meta_data.id,
        matched: false,
      });
      tilePairs.push({
        id: w.meta_data.id + '_jpn',
        text: `${w.trilingual_content.japanese.kana} (${w.trilingual_content.japanese.romaji})`,
        pairId: w.meta_data.id,
        matched: false,
      });
    });
    setTiles(shuffleArray(tilePairs));
    setSelectedTile(null);
    setWrongPair([]);
    setScore(0);
    setDone(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleTileClick = (tileId: string) => {
    if (wrongPair.length > 0) return;
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.matched) return;

    if (!selectedTile) {
      setSelectedTile(tileId);
      return;
    }

    if (selectedTile === tileId) {
      setSelectedTile(null);
      return;
    }

    const first = tiles.find(t => t.id === selectedTile);
    if (!first) return;

    if (first.pairId === tile.pairId) {
      // Match!
      setTiles(prev => prev.map(t =>
        t.pairId === tile.pairId ? { ...t, matched: true } : t
      ));
      setScore(s => s + 15);
      setSelectedTile(null);

      const matchedCount = tiles.filter(t => t.matched).length + 2;
      if (matchedCount >= tiles.length) {
        const finalScore = score + 15;
        onStarsEarned(finalScore);
        onGamePlayed();
        setDone(true);
      }
    } else {
      // Wrong
      setWrongPair([selectedTile, tileId]);
      setTimeout(() => {
        setWrongPair([]);
        setSelectedTile(null);
      }, 800);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <span className="text-6xl mb-4">🏆</span>
        <h2 className="text-2xl font-bold mb-2">All Matched!</h2>
        <p className="text-4xl font-bold text-primary mb-2">⭐ {score} Stars</p>
        <p className="text-base-content/60 mb-6">Great job! 🌟</p>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={initGame}>
            <RotateCcw size={16} /> Play Again
          </button>
          <button className="btn btn-outline" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">🎯 Match English ↔ Japanese</h3>
        <span className="font-bold">⭐ {score}</span>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-2 auto-rows-min">
        {tiles.map(tile => {
          const isSelected = selectedTile === tile.id;
          const isWrong = wrongPair.includes(tile.id);
          let cls = 'btn btn-outline h-auto min-h-16 text-xs leading-tight';
          if (tile.matched) cls = 'btn btn-success h-auto min-h-16 text-xs leading-tight opacity-60';
          else if (isWrong) cls = 'btn btn-error h-auto min-h-16 text-xs leading-tight';
          else if (isSelected) cls = 'btn btn-primary h-auto min-h-16 text-xs leading-tight';
          return (
            <button
              key={tile.id}
              className={cls}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.matched}
            >
              {tile.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===== MAIN GAMES SCREEN =====
export const GamesScreen: React.FC<GamesScreenProps> = ({ onStarsEarned, onQuizCompleted, onGamePlayed }) => {
  const [mode, setMode] = useState<GameMode>('menu');

  if (mode === 'quiz') {
    return <QuizGame onStarsEarned={onStarsEarned} onComplete={onQuizCompleted} onBack={() => setMode('menu')} />;
  }

  if (mode === 'matching') {
    return <MatchingGame onStarsEarned={onStarsEarned} onGamePlayed={onGamePlayed} onBack={() => setMode('menu')} />;
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">🌟 Pop-Pop Star Quiz</h2>
        <p className="text-base-content/60 mt-1">Pop the right bubble and collect Star Coins!</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <button
          className="card bg-base-200 hover:bg-base-300 transition-all w-full cursor-pointer active:scale-95"
          onClick={() => setMode('quiz')}
        >
          <div className="card-body flex-row items-center gap-4">
            <span className="text-4xl">📝</span>
            <div className="text-left">
              <h3 className="font-bold text-lg">Bubble Quiz</h3>
              <p className="text-sm text-base-content/60">10 सवालों का क्विज़ — सही जवाब दो, Stars कमाओ!</p>
            </div>
            <Zap className="text-warning ml-auto" size={24} />
          </div>
        </button>

        <button
          className="card bg-base-200 hover:bg-base-300 transition-all w-full cursor-pointer active:scale-95"
          onClick={() => setMode('matching')}
        >
          <div className="card-body flex-row items-center gap-4">
            <span className="text-4xl">🧩</span>
            <div className="text-left">
              <h3 className="font-bold text-lg">Drag Match</h3>
              <p className="text-sm text-base-content/60">English शब्द को Japanese से मिलाओ!</p>
            </div>
            <Trophy className="text-secondary ml-auto" size={24} />
          </div>
        </button>
      </div>
    </div>
  );
};

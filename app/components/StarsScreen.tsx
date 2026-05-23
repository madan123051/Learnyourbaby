import React from 'react';
import { Star, BookOpen, Gamepad2, Brain, Award } from 'lucide-react';
import { VOCABULARY, CATEGORIES } from '../data/vocabulary';

interface StarsScreenProps {
  totalStars: number;
  wordsLearned: string[];
  quizzesCompleted: number;
  gamesPlayed: number;
}

export const StarsScreen: React.FC<StarsScreenProps> = ({
  totalStars,
  wordsLearned,
  quizzesCompleted,
  gamesPlayed,
}) => {
  const totalWords = VOCABULARY.length;
  const learnedCount = wordsLearned.length;
  const percentage = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

  // Rank based on stars
  let rank = '🌱 Beginner';
  let rankColor = 'text-success';
  if (totalStars >= 500) { rank = '👑 Master'; rankColor = 'text-warning'; }
  else if (totalStars >= 300) { rank = '🌟 Expert'; rankColor = 'text-secondary'; }
  else if (totalStars >= 150) { rank = '📚 Learner'; rankColor = 'text-info'; }
  else if (totalStars >= 50) { rank = '🔥 Explorer'; rankColor = 'text-error'; }

  return (
    <div className="p-4">
      {/* Profile card */}
      <div className="card bg-base-200 mb-4">
        <div className="card-body items-center text-center">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-20 rounded-full">
              <span className="text-4xl">👧</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-2">My Progress</h2>
          <p className={`text-lg font-semibold ${rankColor}`}>{rank}</p>
          <div className="flex items-center gap-2 mt-2">
            <Star className="text-warning fill-warning" size={28} />
            <span className="text-3xl font-bold">{totalStars}</span>
            <span className="text-base-content/60">Stars</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card bg-base-200">
          <div className="card-body items-center p-3">
            <BookOpen size={24} className="text-primary" />
            <span className="text-2xl font-bold">{learnedCount}</span>
            <span className="text-xs text-base-content/60">Words</span>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body items-center p-3">
            <Brain size={24} className="text-secondary" />
            <span className="text-2xl font-bold">{quizzesCompleted}</span>
            <span className="text-xs text-base-content/60">Quizzes</span>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body items-center p-3">
            <Gamepad2 size={24} className="text-info" />
            <span className="text-2xl font-bold">{gamesPlayed}</span>
            <span className="text-xs text-base-content/60">Games</span>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="card bg-base-200 mb-4">
        <div className="card-body p-4">
          <h3 className="font-bold mb-2">📊 Overall Progress</h3>
          <div className="flex items-center gap-3">
            <progress className="progress progress-primary flex-1" value={learnedCount} max={totalWords} />
            <span className="font-bold">{percentage}%</span>
          </div>
          <p className="text-sm text-base-content/60 mt-1">{learnedCount} of {totalWords} words learned</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <h3 className="font-bold mb-3">📁 Category Progress</h3>
          <div className="space-y-3">
            {CATEGORIES.map(cat => {
              const catWords = VOCABULARY.filter(v => v.meta_data.category === cat.name);
              const catLearned = catWords.filter(w => wordsLearned.includes(w.meta_data.id)).length;
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xl w-8">{cat.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.name}</span>
                      <span className="text-base-content/60">{catLearned}/{catWords.length}</span>
                    </div>
                    <progress className="progress progress-primary w-full progress-sm" value={catLearned} max={catWords.length} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card bg-base-200 mt-4">
        <div className="card-body p-4">
          <h3 className="font-bold mb-3">🏅 Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {learnedCount >= 1 && <div className="badge badge-success gap-1"><Award size={12} /> First Word!</div>}
            {learnedCount >= 10 && <div className="badge badge-info gap-1"><Award size={12} /> 10 Words!</div>}
            {learnedCount >= 25 && <div className="badge badge-warning gap-1"><Award size={12} /> 25 Words!</div>}
            {quizzesCompleted >= 1 && <div className="badge badge-secondary gap-1"><Award size={12} /> First Quiz!</div>}
            {quizzesCompleted >= 5 && <div className="badge badge-primary gap-1"><Award size={12} /> Quiz Pro!</div>}
            {gamesPlayed >= 1 && <div className="badge badge-accent gap-1"><Award size={12} /> First Game!</div>}
            {totalStars >= 100 && <div className="badge badge-warning gap-1">⭐ 100 Stars!</div>}
            {totalStars >= 300 && <div className="badge badge-error gap-1">🌟 300 Stars!</div>}
            {learnedCount === 0 && quizzesCompleted === 0 && gamesPlayed === 0 && (
              <p className="text-sm text-base-content/60">Start learning to unlock achievements! 🚀</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

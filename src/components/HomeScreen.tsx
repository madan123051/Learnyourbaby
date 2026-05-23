import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { TrilingualWord, Category } from '../types';
import { CATEGORIES, VOCABULARY } from '../data/vocabulary';

interface HomeScreenProps {
  onWordLearned: (wordId: string) => void;
  learnedWords: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onWordLearned, learnedWords }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const categoryWords = VOCABULARY.filter(v => v.meta_data.category === selectedCategory);

  const handleNext = () => {
    if (cardIndex < categoryWords.length - 1) {
      setCardIndex(cardIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
      setFlipped(false);
    }
  };

  const handleLearn = (word: TrilingualWord) => {
    if (!learnedWords.includes(word.meta_data.id)) {
      onWordLearned(word.meta_data.id);
    }
  };

  // Category grid view
  if (!selectedCategory) {
    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">📚 Learn Two Languages!</h2>
          <p className="text-base-content/60 mt-1">Learn in English & 日本語</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const catWords = VOCABULARY.filter(v => v.meta_data.category === cat.name);
            const learned = catWords.filter(w => learnedWords.includes(w.meta_data.id)).length;
            return (
              <button
                key={cat.name}
                onClick={() => { setSelectedCategory(cat.name); setCardIndex(0); setFlipped(false); }}
                className="card bg-base-200 hover:bg-base-300 transition-all active:scale-95 cursor-pointer"
              >
                <div className="card-body items-center text-center p-4">
                  <span className="text-4xl">{cat.emoji}</span>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-base-content/60">{cat.description}</p>
                  <progress
                    className="progress progress-primary w-full mt-1"
                    value={learned}
                    max={catWords.length}
                  />
                  <span className="text-xs text-base-content/50">{learned}/{catWords.length}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Flashcard view
  const word = categoryWords[cardIndex];
  if (!word) return null;
  const isLearned = learnedWords.includes(word.meta_data.id);

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => { setSelectedCategory(null); setCardIndex(0); setFlipped(false); }}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-bold text-lg flex-1">
          {CATEGORIES.find(c => c.name === selectedCategory)?.emoji} {selectedCategory}
        </h2>
        <span className="badge badge-primary">{cardIndex + 1}/{categoryWords.length}</span>
      </div>

      {/* Flashcard */}
      <div
        className="flex-1 flex items-center justify-center cursor-pointer"
        onClick={() => { setFlipped(!flipped); handleLearn(word); }}
      >
        <div className={`card w-full max-w-sm shadow-xl transition-all duration-300 ${flipped ? 'bg-primary/10' : 'bg-base-200'}`}>
          <div className="card-body items-center text-center">
            <span className="text-6xl mb-2">{word.trilingual_content.emoji}</span>

            {!flipped ? (
              <>
                <h3 className="text-3xl font-bold">{word.trilingual_content.english.word}</h3>
                <p className="text-base-content/60 text-sm">🔤 {word.trilingual_content.english.phonics}</p>
                <p className="text-base-content/60 italic mt-1">"{word.trilingual_content.english.sentence}"</p>
                <div className="badge badge-outline mt-3">👆 Tap to flip!</div>
              </>
            ) : (
              <div className="space-y-4 w-full">
                {/* Japanese */}
                <div className="bg-base-300 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-base-content/60">🇯🇵 日本語</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{word.trilingual_content.japanese.word} ({word.trilingual_content.japanese.kana})</p>
                  <p className="text-sm text-base-content/60">({word.trilingual_content.japanese.romaji})</p>
                  <p className="text-xs italic mt-1">{word.trilingual_content.japanese.sentence}</p>
                </div>
                {isLearned && <div className="badge badge-success gap-1">✅ Learned!</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4 gap-2">
        <button className="btn btn-outline btn-sm" onClick={handlePrev} disabled={cardIndex === 0}>
          <ChevronLeft size={16} /> Prev
        </button>
        <div className="flex gap-1">
          {categoryWords.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === cardIndex ? 'bg-primary' : 'bg-base-300'}`}
            />
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleNext} disabled={cardIndex === categoryWords.length - 1}>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

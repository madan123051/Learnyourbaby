import React, { useState } from 'react';
import { TrilingualWord, Category } from '../types';
import { CATEGORIES, VOCABULARY } from '../data/vocabulary';
import { useLang } from '../context/LanguageContext';

interface HomeScreenProps {
  onWordLearned: (wordId: string) => void;
  learnedWords: string[];
}

// Each category gets its own cheerful colour theme
const THEMES = [
  { card: '#FFE4EE', border: '#FFB6D9', btn: '#FF6BAA', label: '#C2185B', dot: '#FF6BAA' },
  { card: '#FFF3C4', border: '#FFD966', btn: '#FFB800', label: '#795B00', dot: '#FFB800' },
  { card: '#D0EEFF', border: '#93CAFF', btn: '#3B9EFF', label: '#0055A5', dot: '#3B9EFF' },
  { card: '#C6F6D5', border: '#68D391', btn: '#38A169', label: '#1A5E35', dot: '#38A169' },
  { card: '#E9D8FD', border: '#B794F4', btn: '#805AD5', label: '#44337A', dot: '#805AD5' },
  { card: '#FEDDBB', border: '#FBB16E', btn: '#ED6E1C', label: '#7B3500', dot: '#ED6E1C' },
  { card: '#FBCFFD', border: '#F687D2', btn: '#D53F8C', label: '#6B2154', dot: '#D53F8C' },
  { card: '#B2F5EA', border: '#4FD1C5', btn: '#2C7A7B', label: '#1D4044', dot: '#2C7A7B' },
];

const F = "'Nunito', 'Baloo 2', sans-serif";

export const HomeScreen: React.FC<HomeScreenProps> = ({ onWordLearned, learnedWords }) => {
  const { t } = useLang();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const categoryWords = VOCABULARY.filter(v => v.meta_data.category === selectedCategory);

  const handleNext = () => {
    if (cardIndex < categoryWords.length - 1) { setCardIndex(cardIndex + 1); setFlipped(false); }
  };
  const handlePrev = () => {
    if (cardIndex > 0) { setCardIndex(cardIndex - 1); setFlipped(false); }
  };
  const handleLearn = (word: TrilingualWord) => {
    if (!learnedWords.includes(word.meta_data.id)) onWordLearned(word.meta_data.id);
  };

  const catIdx = CATEGORIES.findIndex(c => c.name === selectedCategory);
  const theme = THEMES[(catIdx >= 0 ? catIdx : 0) % THEMES.length];

  // ─── CATEGORY GRID ────────────────────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <div
        style={{
          height: '100%',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, #fff5fa 0%, #f5f0ff 45%, #f0f9ff 100%)',
        }}
      >
        {/* ── Hero Banner ── */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '1.5rem 1rem 0.75rem' }}>
          <span className="nursery-bounce" style={{ position: 'absolute', top: '0.8rem', left: '0.75rem', fontSize: '1.6rem', animationDelay: '0s' }}>⭐</span>
          <span className="nursery-bounce" style={{ position: 'absolute', top: '0.5rem', right: '0.75rem', fontSize: '1.8rem', animationDelay: '0.4s' }}>🌟</span>
          <span className="nursery-bounce" style={{ position: 'absolute', top: '2.5rem', right: '0.4rem', fontSize: '1.2rem', animationDelay: '0.8s' }}>🦋</span>
          <span className="nursery-bounce" style={{ position: 'absolute', top: '2rem', left: '0.4rem', fontSize: '1rem', animationDelay: '1.2s' }}>🌸</span>

          <div style={{ fontSize: '4.5rem', lineHeight: 1, filter: 'drop-shadow(2px 4px 0 rgba(255,107,170,0.3))' }}>🌈</div>
          <h1 style={{
            fontFamily: F,
            fontWeight: 900,
            fontSize: '1.75rem',
            color: '#ff5fa0',
            textShadow: '2px 3px 0 #ffd6e8',
            margin: '0.4rem 0 0.2rem',
            lineHeight: 1.15,
          }}>
            {t.homeHeading}
          </h1>
          <p style={{
            fontFamily: F,
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#7c6bff',
            margin: 0,
          }}>
            {t.pickBookSubtitle}
          </p>
        </div>

        {/* ── Book-cover Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          padding: '1rem 1rem 1.5rem',
        }}>
          {CATEGORIES.map((cat, i) => {
            const th = THEMES[i % THEMES.length];
            const catWords = VOCABULARY.filter(v => v.meta_data.category === cat.name);
            const learned = catWords.filter(w => learnedWords.includes(w.meta_data.id)).length;
            const pct = catWords.length > 0 ? Math.round((learned / catWords.length) * 100) : 0;

            return (
              <button
                key={cat.name}
                onClick={() => { setSelectedCategory(cat.name); setCardIndex(0); setFlipped(false); }}
                style={{
                  position: 'relative',
                  background: th.card,
                  border: `4px solid ${th.border}`,
                  borderRadius: '1.6rem',
                  padding: '1rem 0.75rem 0.85rem',
                  boxShadow: `0 6px 0 ${th.border}, 0 10px 20px rgba(0,0,0,0.08)`,
                  cursor: 'pointer',
                  minHeight: '158px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'transform 0.12s',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.95) translateY(4px)'; e.currentTarget.style.boxShadow = `0 2px 0 ${th.border}`; }}
                onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 6px 0 ${th.border}, 0 10px 20px rgba(0,0,0,0.08)`; }}
                onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 6px 0 ${th.border}, 0 10px 20px rgba(0,0,0,0.08)`; }}
              >
                {pct === 100 && (
                  <span className="nursery-wobble" style={{ position: 'absolute', top: '-0.65rem', right: '-0.5rem', fontSize: '1.7rem' }}>🏆</span>
                )}

                <span style={{ fontSize: '3.4rem', lineHeight: 1, filter: 'drop-shadow(1px 3px 0 rgba(0,0,0,0.12))' }}>
                  {cat.emoji}
                </span>

                <p style={{
                  fontFamily: F,
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: th.label,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                  {cat.name}
                </p>

                <div style={{
                  width: '100%',
                  height: '10px',
                  background: 'rgba(255,255,255,0.75)',
                  borderRadius: '99px',
                  marginTop: '0.3rem',
                  overflow: 'hidden',
                  border: `1.5px solid ${th.border}`,
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: th.btn,
                    borderRadius: '99px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>

                <p style={{ fontFamily: F, fontWeight: 700, fontSize: '0.7rem', color: th.label, opacity: 0.75, margin: 0 }}>
                  {learned}/{catWords.length} {t.wordsLabel} ✨
                </p>
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '1.7rem', letterSpacing: '0.4rem', padding: '0.5rem 0 1.5rem' }}>
          🌸🐣🌈🐝🌻🦄
        </p>
      </div>
    );
  }

  // ─── FLASHCARD VIEW ───────────────────────────────────────────────────────
  const word = categoryWords[cardIndex];
  if (!word) return null;
  const isLearned = learnedWords.includes(word.meta_data.id);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: `linear-gradient(160deg, ${theme.card}55 0%, #ffffff 60%, #fff5fa 100%)`,
    }}>

      {/* ── Category Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 0.85rem',
        background: theme.card,
        borderBottom: `4px solid ${theme.border}`,
        flexShrink: 0,
      }}>
        <button
          onClick={() => { setSelectedCategory(null); setCardIndex(0); setFlipped(false); }}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: `3px solid ${theme.border}`,
            background: theme.btn,
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontFamily: F,
            boxShadow: `0 3px 0 ${theme.border}`,
          }}
        >
          ←
        </button>
        <h2 style={{
          flex: 1,
          fontFamily: F,
          fontWeight: 900,
          fontSize: '1.15rem',
          color: theme.label,
          margin: 0,
        }}>
          {CATEGORIES.find(c => c.name === selectedCategory)?.emoji} {selectedCategory}
        </h2>
        <span style={{
          fontFamily: F,
          fontWeight: 800,
          fontSize: '0.78rem',
          color: theme.btn,
          background: '#fff',
          border: `2.5px solid ${theme.border}`,
          borderRadius: '99px',
          padding: '0.2rem 0.7rem',
        }}>
          {cardIndex + 1} / {categoryWords.length}
        </span>
      </div>

      {/* ── Flashcard ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 1rem',
        overflow: 'hidden',
      }}>
        <div
          onClick={() => { setFlipped(!flipped); handleLearn(word); }}
          style={{
            width: '100%',
            maxWidth: '370px',
            minHeight: '340px',
            background: flipped ? '#ffffff' : theme.card,
            border: `4px solid ${theme.border}`,
            borderRadius: '2rem',
            boxShadow: `0 8px 0 ${theme.border}, 0 14px 28px rgba(0,0,0,0.10)`,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1.25rem',
            gap: '0.5rem',
            transition: 'background 0.3s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {!flipped ? (
            /* Front — Picture Book Page */
            <>
              <div style={{
                fontSize: '6rem',
                lineHeight: 1,
                filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.15))',
              }}>
                {word.trilingual_content.emoji}
              </div>

              <p style={{
                fontFamily: F,
                fontWeight: 900,
                fontSize: '2.8rem',
                color: theme.label,
                textAlign: 'center',
                margin: '0.2rem 0 0',
                lineHeight: 1.05,
                textShadow: `2px 3px 0 ${theme.border}`,
                letterSpacing: '-0.5px',
              }}>
                {word.trilingual_content.english.word}
              </p>

              <p style={{ fontFamily: F, fontWeight: 700, fontSize: '0.85rem', color: '#999', margin: '0.1rem 0' }}>
                🔤 {word.trilingual_content.english.phonics}
              </p>

              <p style={{
                fontFamily: F,
                fontSize: '0.85rem',
                color: '#777',
                fontStyle: 'italic',
                textAlign: 'center',
                margin: '0.25rem 0.5rem',
                lineHeight: 1.45,
              }}>
                "{word.trilingual_content.english.sentence}"
              </p>

              <div style={{
                marginTop: '0.6rem',
                background: theme.btn,
                color: '#fff',
                borderRadius: '99px',
                padding: '0.45rem 1.4rem',
                fontFamily: F,
                fontWeight: 800,
                fontSize: '0.85rem',
                boxShadow: `0 4px 0 ${theme.border}`,
              }}>
                {t.tapToFlip} ✨
              </div>
            </>
          ) : (
            /* Back — Translations Page */
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <div style={{ textAlign: 'center', fontSize: '3rem', lineHeight: 1, marginBottom: '0.1rem' }}>
                {word.trilingual_content.emoji}
              </div>

              {/* Nepali */}
              <div style={{
                background: '#FFF0F5',
                border: '3px solid #FFB6D9',
                borderRadius: '1.1rem',
                padding: '0.7rem 0.85rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '1.05rem' }}>🇳🇵</span>
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: '0.7rem', color: '#C2185B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>नेपाली</span>
                </div>
                <p style={{ fontFamily: F, fontWeight: 900, fontSize: '1.7rem', color: '#C2185B', margin: 0, lineHeight: 1.1 }}>
                  {word.trilingual_content.nepali.word}
                </p>
                <p style={{ fontFamily: F, fontWeight: 700, fontSize: '0.75rem', color: '#FF6BAA', margin: '0.1rem 0' }}>
                  ({word.trilingual_content.nepali.roman})
                </p>
                <p style={{ fontFamily: F, fontSize: '0.75rem', color: '#888', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                  {word.trilingual_content.nepali.sentence}
                </p>
              </div>

              {/* Japanese */}
              <div style={{
                background: '#F0F9FF',
                border: '3px solid #93CAFF',
                borderRadius: '1.1rem',
                padding: '0.7rem 0.85rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '1.05rem' }}>🇯🇵</span>
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: '0.7rem', color: '#0055A5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>日本語</span>
                </div>
                <p style={{ fontFamily: F, fontWeight: 900, fontSize: '1.7rem', color: '#0055A5', margin: 0, lineHeight: 1.1 }}>
                  {word.trilingual_content.japanese.word}
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B9EFF', marginLeft: '0.3rem' }}>
                    ({word.trilingual_content.japanese.kana})
                  </span>
                </p>
                <p style={{ fontFamily: F, fontWeight: 700, fontSize: '0.75rem', color: '#3B9EFF', margin: '0.1rem 0' }}>
                  ({word.trilingual_content.japanese.romaji})
                </p>
                <p style={{ fontFamily: F, fontSize: '0.75rem', color: '#888', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                  {word.trilingual_content.japanese.sentence}
                </p>
              </div>

              {isLearned && (
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: '#F0FFF4',
                    border: '2.5px solid #68D391',
                    color: '#1A5E35',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: F,
                    borderRadius: '99px',
                    padding: '0.3rem 1rem',
                  }}>
                    {t.learned}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.6rem 1rem 1rem',
        gap: '0.75rem',
        flexShrink: 0,
      }}>
        <button
          onClick={handlePrev}
          disabled={cardIndex === 0}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '1.25rem',
            border: `3.5px solid ${cardIndex === 0 ? '#e0e0e0' : theme.border}`,
            background: cardIndex === 0 ? '#f5f5f5' : theme.btn,
            color: cardIndex === 0 ? '#bbb' : '#fff',
            fontFamily: F,
            fontWeight: 900,
            fontSize: '1rem',
            cursor: cardIndex === 0 ? 'not-allowed' : 'pointer',
            boxShadow: cardIndex === 0 ? 'none' : `0 4px 0 ${theme.border}`,
            transition: 'all 0.12s',
          }}
        >
          ◀ {t.prev}
        </button>

        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '72px' }}>
          {categoryWords.slice(0, 14).map((_, i) => (
            <div
              key={i}
              onClick={() => { setCardIndex(i); setFlipped(false); }}
              style={{
                width: i === cardIndex ? '0.75rem' : '0.55rem',
                height: i === cardIndex ? '0.75rem' : '0.55rem',
                borderRadius: '50%',
                background: i === cardIndex ? theme.btn : '#ddd',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={cardIndex === categoryWords.length - 1}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '1.25rem',
            border: `3.5px solid ${cardIndex === categoryWords.length - 1 ? '#e0e0e0' : theme.border}`,
            background: cardIndex === categoryWords.length - 1 ? '#f5f5f5' : theme.btn,
            color: cardIndex === categoryWords.length - 1 ? '#bbb' : '#fff',
            fontFamily: F,
            fontWeight: 900,
            fontSize: '1rem',
            cursor: cardIndex === categoryWords.length - 1 ? 'not-allowed' : 'pointer',
            boxShadow: cardIndex === categoryWords.length - 1 ? 'none' : `0 4px 0 ${theme.border}`,
            transition: 'all 0.12s',
          }}
        >
          {t.next} ▶
        </button>
      </div>
    </div>
  );
};

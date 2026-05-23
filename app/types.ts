// ===== Vocabulary Item =====
export interface TrilingualWord {
  meta_data: {
    id: string;
    category: string;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    age_group: string;
  };
  trilingual_content: {
    emoji: string;
    english: {
      word: string;
      phonics: string;
      sentence: string;
    };
    nepali: {
      word: string;
      roman: string;
      sentence: string;
    };
    japanese: {
      word: string;
      kana: string;
      romaji: string;
      sentence: string;
    };
  };
  interactive_quiz: {
    question_nepali: string;
    options: string[];
    correct_answer: string;
    star_points: number;
  };
}

// ===== Category =====
export interface Category {
  name: string;
  emoji: string;
  color: string;
  description: string;
}

// ===== Game Types =====
export interface MatchPair {
  id: string;
  text: string;
  matchId: string;
  matched: boolean;
  selected: boolean;
  type: 'english' | 'japanese';
}

// ===== Progress =====
export interface UserProgress {
  totalStars: number;
  wordsLearned: string[];
  quizzesCompleted: number;
  gamesPlayed: number;
  streak: number;
}

// ===== Tab =====
export type TabId = 'home' | 'sumi' | 'games' | 'stars';

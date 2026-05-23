export interface TrilingualWord {
  meta_data: {
    id: string;
    category: string;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    age_group: string;
  };
  trilingual_content: {
    emoji: string;
    english: { word: string; phonics: string; sentence: string; };
    nepali: { word: string; roman: string; sentence: string; };
    japanese: { word: string; kana: string; romaji: string; sentence: string; };
  };
  interactive_quiz: {
    question_nepali: string;
    options: string[];
    correct_answer: string;
    star_points: number;
  };
}

export interface Category {
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface UserProgress {
  totalStars: number;
  wordsLearned: string[];
  quizzesCompleted: number;
  gamesPlayed: number;
  streak: number;
}

export type TabId = 'home' | 'sumi' | 'games' | 'stars';

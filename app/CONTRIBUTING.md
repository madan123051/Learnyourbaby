# 🤝 Contributing to Sumi Sensei

Thank you for your interest in contributing! We welcome contributions from everyone.

## 💡 Types of Contributions

- 🐛 Bug reports and fixes
- ✨ New features (new vocabulary categories, games, etc.)
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 New language translations
- 🧪 Tests

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Learnyourbaby.git
   cd Learnyourbaby/app
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Make your changes**
   - Follow the code style (TypeScript, Tailwind CSS)
   - Add comments for complex logic
   - Test thoroughly

6. **Build & test locally**
   ```bash
   npm run build
   npm run preview
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add new vocabulary category"
   ```

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request**
   - Clear title and description
   - Link related issues
   - Include screenshots if UI changes

## 📝 Code Style

### TypeScript
- Use strict mode
- Add type annotations
- Avoid `any` type

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Add JSDoc comments for complex components

### Naming Conventions
- Components: `PascalCase` (e.g., `HomeScreen.tsx`)
- Utilities: `camelCase` (e.g., `calculateScore.ts`)
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case` (e.g., `new-feature.ts`)

### Example
```typescript
/**
 * Calculates total stars based on performance
 * @param correctAnswers - Number of correct answers
 * @param totalQuestions - Total number of questions
 * @returns Star points earned
 */
const calculateStars = (correctAnswers: number, totalQuestions: number): number => {
  return Math.round((correctAnswers / totalQuestions) * 100);
}
```

## 📚 Adding New Vocabulary

Edit `src/data/vocabulary.ts`:

```typescript
{
  meta_data: {
    id: "vocab_031",
    category: "Vegetables", // New category
    difficulty_level: "Beginner",
    age_group: "4-8"
  },
  trilingual_content: {
    emoji: "🥕",
    english: {
      word: "Carrot",
      phonics: "CA-RR-OT",
      sentence: "I like to eat carrots."
    },
    nepali: {
      word: "गाजर",
      roman: "Gajar",
      sentence: "मुझे गाजर खाना पसंद है।"
    },
    japanese: {
      word: "にんじん",
      kana: "ニンジン",
      romaji: "Ninjin",
      sentence: "ニンジンを食べるのが好きです。(Ninjin wo taberu no ga suki desu.)"
    }
  },
  interactive_quiz: {
    question_nepali: "गाजरलाई जापानीमा के भनिन्छ?",
    options: ["キャベツ (Kyabetsu)", "ニンジン (Ninjin)", "トマト (Tomato)"],
    correct_answer: "ニンジン (Ninjin)",
    star_points: 10
  }
}
```

## 🎮 Adding New Games

Create a new component in `src/components/`:

```typescript
// src/components/NewGameScreen.tsx
import React, { useState } from 'react';
import { Vocabulary } from '../types';

interface NewGameScreenProps {
  vocabulary: Vocabulary[];
  onStarsEarned: (stars: number) => void;
}

export const NewGameScreen: React.FC<NewGameScreenProps> = ({
  vocabulary,
  onStarsEarned
}) => {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      {/* Your game UI here */}
    </div>
  );
};
```

Then add it to the main app in `src/app.tsx`.

## 🐛 Reporting Bugs

When reporting a bug, include:
- ✅ Step-by-step reproduction
- ✅ Expected behavior
- ✅ Actual behavior
- ✅ Browser/device info
- ✅ Screenshots if applicable

## ✅ Pull Request Checklist

Before submitting:
- [ ] Tests pass: `npm run build`
- [ ] No console errors
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] PR title is clear and descriptive
- [ ] Screenshots included (if UI changes)
- [ ] No breaking changes

## 📋 Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/dependency updates

Example:
```
feat: Add vegetables category with 8 new words

- Added new vocabulary items
- Updated quiz questions
- Tested on mobile devices

Closes #42
```

## 🌍 Translating to New Languages

1. Add language to `Vocabulary` type in `types.ts`
2. Add translations to all vocabulary items
3. Update UI labels in components
4. Test RTL if applicable
5. Create PR with detailed translation notes

## 💬 Questions?

- Open an issue for questions
- Check existing issues first
- Join our discussions

---

**Happy Contributing!** 🎉

Your contributions make Sumi Sensei better for every child learning languages! 👶📚✨

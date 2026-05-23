# 🎓 Sumi Sensei - Trilingual Learning App for Kids

A beautiful, interactive educational app where kids learn **English**, **Nepali**, and **Japanese** together through flashcards, games, and AI-powered tutoring!

## 🌟 Features

### 📚 **Learn Screen** - Interactive Flashcards
- 6 Categories: Animals 🐾, Fruits 🍎, Colors 🎨, Numbers 🔢, Body 🧍, Food 🍱
- **30+ Vocabulary Words** in all 3 languages
- Flip animations to reveal translations
- Emoji-based visual learning
- Progress tracking per category

### 🤖 **Sumi AI Chat** - Intelligent Tutor
- Ask any word in English, Nepali, or Japanese
- Get instant trilingual explanations
- Smart suggestions for quick learning
- Example sentences in all 3 languages
- Perfect for interactive learning moments

### 🎮 **Games** - Fun Learning
- **📝 MCQ Quiz**: 10 random questions per round
  - Questions in Nepali
  - Options in English, Nepali, and Japanese
  - Instant feedback with star rewards (10 ⭐ per correct answer)
  
- **🧩 Matching Game**: Pair English with Japanese
  - 6 vocabulary pairs (12 tiles)
  - Animated flips and matches
  - 15 ⭐ per successful pair

### 🏆 **My Stars** - Progress Dashboard
- Total stars earned 💫
- Rank system (Beginner → Master)
- Words learned counter
- Quiz completion stats
- Games played counter
- Category-wise progress breakdown
- Achievement badges for milestones

## 📊 Trilingual Content

Each vocabulary word includes:
```
✓ English: Word + Phonics + Example Sentence
✓ Nepali: Word + Roman transliteration + Sentence
✓ Japanese: Kanji/Hiragana + Kana + Romaji + Sentence
```

**Categories Covered:**
- 🐾 Animals (Dog, Cat, Bird, Fish, Elephant, Lion)
- 🍎 Fruits (Apple, Banana, Mango, Orange, Grapes, Strawberry)
- 🎨 Colors (Red, Blue, Green, Yellow, Black, White)
- 🔢 Numbers (One to Ten)
- 🧍 Body Parts (Head, Hand, Leg, Eye, Ear, Nose)
- 🍱 Food Items (Rice, Bread, Milk, Egg, Chicken, Fish)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/madan123051/Learnyourbaby.git
cd Learnyourbaby/app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or as shown in terminal)

### Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deploy on Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
vercel
```

### Option 2: GitHub Integration
1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub account
4. Select `madan123051/Learnyourbaby` repository
5. Click "Deploy"

Vercel will automatically detect the project structure and deploy!

### Option 3: Direct Vercel Dashboard
1. Visit [https://vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Select the Learnyourbaby project
4. Click "Deploy"

## 📁 Project Structure

```
app/
├── app.tsx                 # Main app entry point with tab navigation
├── types.ts               # TypeScript interfaces
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vercel.json            # Vercel deployment config
├── vite.config.ts         # Vite bundler config
├── .gitignore             # Git ignore rules
├── components/
│   ├── HomeScreen.tsx     # Flashcard & category screen
│   ├── SumiSensei.tsx     # AI chat bot interface
│   ├── GamesScreen.tsx    # Quiz & matching games
│   └── StarsScreen.tsx    # Progress & achievements
├── data/
│   └── vocabulary.ts      # 30+ vocabulary items with translations
└── assets/
    └── ... (images, icons)
```

## 💾 Data Persistence

All user progress is saved in **localStorage**:
- Stars earned ⭐
- Words learned
- Quiz scores
- Games played
- Achievement badges
- Category progress

Data persists even after closing the browser!

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Storage**: Browser LocalStorage
- **Deployment**: Vercel

## 🎯 Future Enhancements

- [ ] Text-to-Speech (TTS) for pronunciation
- [ ] Gemini AI integration for dynamic content
- [ ] Offline mode with sync
- [ ] More language pairs (Hindi, Spanish, etc.)
- [ ] Advanced level categories
- [ ] Parent dashboard with kid progress
- [ ] Social sharing of achievements
- [ ] Voice recording & speech recognition
- [ ] Leaderboard system

## 📝 API Integration (Future)

The app is designed to easily integrate with **Gemini AI** for:
- Dynamic vocabulary generation
- Smart Q&A sessions
- Personalized learning paths
- Real-time pronunciation correction

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Clear Cache & Rebuild
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Reset User Progress
Open browser DevTools → Application → LocalStorage → Delete all entries

## 📧 Support & Contact

For issues, questions, or feature requests:
- Open an Issue on GitHub
- Contact: [Your email/contact]

## 📄 License

MIT License - Feel free to use this for educational purposes!

---

**Made with ❤️ for kids learning languages together!** 🌍👶📚✨

**Happy Learning!** 🎓

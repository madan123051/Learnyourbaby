export type Lang = 'en' | 'ja' | 'ne';

export const LANG_FLAGS: Record<Lang, string> = {
  en: '🇬🇧',
  ja: '🇯🇵',
  ne: '🇳🇵',
};

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  ja: 'JA',
  ne: 'NE',
};

interface UIStrings {
  appTitle: string;
  appSubtitle: string;
  starsEarned: string;
  tabLearn: string;
  tabSumi: string;
  tabGames: string;
  tabCanvas: string;
  tabProgress: string;
  tabFloating: string;
  homeHeading: string;
  pickBookSubtitle: string;
  wordsLabel: string;
  tapToFlip: string;
  learned: string;
  prev: string;
  next: string;
  gamesHeading: string;
  gamesSubtitle: string;
  quizTitle: string;
  quizDesc: string;
  quizLevelRange: string;
  matchTitle: string;
  matchDesc: string;
  matchPairs: string;
  quizComplete: string;
  quizResultExcellent: string;
  quizResultGood: string;
  quizResultKeepGoing: string;
  allMatched: string;
  matchWell: string;
  playAgain: string;
  back: string;
  matchHeading: string;
  pickLevel: string;
  sumiGreeting: string;
  sumiUnknown: string;
  madeWith: string;
  catDesc: Record<string, string>;
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    appTitle: '🌈 LearnYourBaby',
    appSubtitle: 'Trilingual Learning',
    starsEarned: 'Stars earned',
    tabLearn: 'Learn',
    tabSumi: 'Sumi AI',
    tabGames: 'Games',
    tabCanvas: 'Canvas',
    tabProgress: 'Stars',
    tabFloating: 'Play',
    homeHeading: 'What shall we learn today?',
    pickBookSubtitle: 'Pick a picture book to begin! 📖✨',
    wordsLabel: 'words',
    tapToFlip: '👆 Tap to flip!',
    learned: '✅ I learned this word! 🎉',
    prev: 'Prev',
    next: 'Next',
    gamesHeading: '🎮 Fun Games!',
    gamesSubtitle: 'Play and Learn!',
    quizTitle: 'MCQ Quiz',
    quizDesc: 'Answer correctly to earn Stars!',
    quizLevelRange: 'Nursery to Class 4–5',
    matchTitle: 'Matching Game',
    matchDesc: 'Match English words with Japanese!',
    matchPairs: 'Match 6 pairs · ⭐ 15 Stars each',
    quizComplete: 'Quiz Complete!',
    quizResultExcellent: 'Excellent! Well done! 🎉',
    quizResultGood: 'Good job! Keep going! 👏',
    quizResultKeepGoing: 'Keep practicing! You can do it! 💪',
    allMatched: 'All Matched!',
    matchWell: 'Excellent! Great job! 🎉',
    playAgain: 'Play Again',
    back: 'Back',
    matchHeading: '🎯 Match English ↔ Japanese',
    pickLevel: 'Pick your level',
    sumiGreeting:
      "Hello! 🙏 I'm **Sumi Sensei** — your trilingual teacher!\n\nAsk me any word and I'll teach you in 3 languages! 🎓\n\nTry typing: **dog**, **apple**, **red**, or any word!",
    sumiUnknown:
      "🤔 Hmm, I don't know that word yet! Try asking about: **animals**, **fruits**, **colors**, **numbers**, **body parts**, or **food**!\n\nFor example: \"dog\", \"apple\", \"red\", \"one\", \"eyes\", \"rice\"",
    madeWith: 'Made with ❤️ for babies',
    catDesc: {
      Animals: 'Learn animals in 3 languages!',
      Fruits: 'Learn fruit names!',
      Colors: 'World of colors!',
      Numbers: 'Learn counting!',
      Body: 'Body parts!',
      Food: 'Food & drinks!',
    },
  },

  ja: {
    appTitle: '🌈 スミ先生',
    appSubtitle: '3言語学習',
    starsEarned: '獲得スター',
    tabLearn: '学ぶ',
    tabSumi: 'スミAI',
    tabGames: 'ゲーム',
    tabCanvas: 'お絵描き',
    tabProgress: '進捗',
    tabFloating: '遊ぶ',
    homeHeading: '今日は何を学ぼう？',
    pickBookSubtitle: '絵本を選んでください！📖✨',
    wordsLabel: '語',
    tapToFlip: '👆 タップしてめくろう！',
    learned: '✅ 覚えた！🎉',
    prev: '前へ',
    next: '次へ',
    gamesHeading: '🎮 楽しいゲーム！',
    gamesSubtitle: '遊びながら学ぼう！',
    quizTitle: 'MCQクイズ',
    quizDesc: '正解してスターを獲得！',
    quizLevelRange: 'ナーサリーからクラス4–5',
    matchTitle: 'マッチングゲーム',
    matchDesc: '英語と日本語を合わせよう！',
    matchPairs: '6ペアを合わせよう · ⭐ 各15スター',
    quizComplete: 'クイズ完了！',
    quizResultExcellent: 'すごい！よくできました！🎉',
    quizResultGood: 'よかった！続けよう！👏',
    quizResultKeepGoing: '練習しよう！できるよ！💪',
    allMatched: '全部マッチ！',
    matchWell: 'すごい！よくできました！🎉',
    playAgain: 'もう一度',
    back: '戻る',
    matchHeading: '🎯 英語 ↔ 日本語を合わせよう',
    pickLevel: 'レベルを選んでください',
    sumiGreeting:
      'こんにちは！🙏 **スミ先生**です — あなたの3言語の先生！\n\n何でも言葉を聞いてください、3言語で教えます！🎓\n\n試してみて：**dog**、**apple**、**red**など！',
    sumiUnknown:
      '🤔 まだその言葉を知りません！**動物**、**果物**、**色**、**数字**、**体の部位**、**食べ物**について聞いてください！\n\n例：\"dog\"、\"apple\"、\"red\"、\"one\"、\"eyes\"、\"rice\"',
    madeWith: '❤️で作られました',
    catDesc: {
      Animals: '3言語で動物を学ぼう！',
      Fruits: '果物の名前を学ぼう！',
      Colors: '色の世界！',
      Numbers: '数え方を学ぼう！',
      Body: '体の部位！',
      Food: '食べ物・飲み物！',
    },
  },

  ne: {
    appTitle: '🌈 LearnYourBaby',
    appSubtitle: 'तीन भाषा सिकाइ',
    starsEarned: 'तारा कमाइयो',
    tabLearn: 'सिक्नुहोस्',
    tabSumi: 'सुमी AI',
    tabGames: 'खेल',
    tabCanvas: 'क्यान्भास',
    tabProgress: 'तारा',
    tabFloating: 'खेल्नुस्',
    homeHeading: 'आज के सिक्ने?',
    pickBookSubtitle: 'एउटा किताब छान्नुहोस्! 📖✨',
    wordsLabel: 'शब्द',
    tapToFlip: '👆 पल्टाउन ट्याप गर्नुहोस्!',
    learned: '✅ सिकियो! 🎉',
    prev: 'अघिल्लो',
    next: 'अर्को',
    gamesHeading: '🎮 मजाको खेल!',
    gamesSubtitle: 'खेल्दै सिक्नुहोस्!',
    quizTitle: 'MCQ क्विज',
    quizDesc: 'सही जवाफ दिनुहोस्, तारा कमाउनुहोस्!',
    quizLevelRange: 'Nursery देखि Class 4–5 सम्म',
    matchTitle: 'मिलान खेल',
    matchDesc: 'अंग्रेजी शब्द जापानीसँग मिलाउनुहोस्!',
    matchPairs: '6 जोडी मिलाउनुस् · ⭐ 15 Stars each',
    quizComplete: 'क्विज सकियो!',
    quizResultExcellent: 'शाबास! उत्कृष्ट! 🎉',
    quizResultGood: 'राम्रो! जारी राख्नुहोस्! 👏',
    quizResultKeepGoing: 'अभ्यास गर्नुहोस्! तपाईं सक्नुहुन्छ! 💪',
    allMatched: 'सबै मिलायो!',
    matchWell: 'उत्कृष्ट! राम्रो काम! 🎉',
    playAgain: 'फेरि खेल्नुहोस्',
    back: 'पछाडि',
    matchHeading: '🎯 अंग्रेजी ↔ जापानी मिलाउनुहोस्',
    pickLevel: 'आफ्नो level छान्नुस्',
    sumiGreeting:
      'नमस्ते! 🙏 म **सुमी सेन्सेई** — तपाईंको तीन भाषाको शिक्षक!\n\nकुनै पनि शब्द सोध्नुहोस् र म तपाईंलाई ३ भाषामा सिकाउनेछु! 🎓\n\nटाइप गर्नुहोस्: **dog**, **apple**, **red**, वा कुनै पनि शब्द!',
    sumiUnknown:
      '🤔 त्यो शब्द मलाई अझै थाहा छैन! **जनावर**, **फल**, **रंग**, **संख्या**, **शरीरका अंग**, वा **खाना** बारे सोध्नुहोस्!\n\nउदाहरण: \"dog\", \"apple\", \"red\", \"one\", \"eyes\", \"rice\"',
    madeWith: 'सुमीको लागि ❤️ सहित बनाइएको',
    catDesc: {
      Animals: '३ भाषामा जनावरहरू सिक्नुहोस्!',
      Fruits: 'फलहरूका नाम सिक्नुहोस्!',
      Colors: 'रंगहरूको दुनियाँ!',
      Numbers: 'गन्ती सिक्नुहोस्!',
      Body: 'शरीरका अंगहरू!',
      Food: 'खाना-पिउनाका चीजहरू!',
    },
  },
};

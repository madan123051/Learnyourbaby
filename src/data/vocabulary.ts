import { TrilingualWord, Category } from '../types';

export const CATEGORIES: Category[] = [
  { name: 'Animals',    emoji: '🐾', color: 'bg-warning',   description: 'जनावरहरूको नाम तीन भाषामा सीखौं!' },
  { name: 'Fruits',     emoji: '🍎', color: 'bg-error',     description: 'फलफूलका नाम सीखौं!' },
  { name: 'Colors',     emoji: '🎨', color: 'bg-secondary', description: 'रंगहरूको दुनियाँ!' },
  { name: 'Numbers',    emoji: '🔢', color: 'bg-info',      description: 'गन्ती सीखौं!' },
  { name: 'Body',       emoji: '🧍', color: 'bg-success',   description: 'शरीरका अंगहरू!' },
  { name: 'Food',       emoji: '🍱', color: 'bg-primary',   description: 'खाना-पिनाका नाम!' },
  { name: 'Shapes',     emoji: '🔷', color: 'bg-accent',    description: 'आकारहरू सीखौं!' },
  { name: 'Classroom',  emoji: '🏫', color: 'bg-warning',   description: 'कक्षाकोठाका सामान!' },
  { name: 'Weather',    emoji: '🌤️',  color: 'bg-info',      description: 'मौसमका नाम!' },
  { name: 'Vegetables', emoji: '🥕', color: 'bg-success',   description: 'तरकारीका नाम!' },
  { name: 'Transport',  emoji: '🚗', color: 'bg-primary',   description: 'यातायातका नाम!' },
  { name: 'Family',     emoji: '👨‍👩‍👧', color: 'bg-secondary', description: 'परिवारका नाम!' },
  { name: 'Actions',    emoji: '🏃', color: 'bg-error',     description: 'क्रियाहरू सीखौं!' },
  { name: 'Emotions',   emoji: '😊', color: 'bg-accent',    description: 'भावनाका नाम!' },
  { name: 'Nature',     emoji: '🌿', color: 'bg-success',   description: 'प्रकृतिका नाम!' },
  { name: 'Places',     emoji: '🏫', color: 'bg-primary',   description: 'ठाउँहरूका नाम!' },
];

export const VOCABULARY: TrilingualWord[] = [

  // ==================== NURSERY LEVEL ====================
  // ----- Animals (Nursery) -----
  {
    meta_data: { id: 'vocab_001', category: 'Animals', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🐶',
      english: { word: 'Dog',  phonics: 'D-O-G',   sentence: 'The dog is barking.'     },
      nepali:  { word: 'कुकुर', roman: 'Kukur',     sentence: 'कुकुर भुक्दै छ।'          },
      japanese:{ word: '犬',   kana: 'いぬ',        romaji: 'Inu',   sentence: '犬がほえています。' },
    },
    interactive_quiz: {
      question_nepali: 'कुकुरलाई जापानीमा के भनिन्छ?',
      options: ['いぬ (Inu)', 'ねこ (Neko)', 'とり (Tori)'],
      correct_answer: 'いぬ (Inu)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_002', category: 'Animals', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🐱',
      english: { word: 'Cat',   phonics: 'C-A-T',   sentence: 'The cat is sleeping.'   },
      nepali:  { word: 'बिरालो', roman: 'Biralo',    sentence: 'बिरालो सुतिरहेको छ।'   },
      japanese:{ word: '猫',    kana: 'ねこ',        romaji: 'Neko',  sentence: '猫が寝ています。' },
    },
    interactive_quiz: {
      question_nepali: 'बिरालोलाई जापानीमा के भनिन्छ?',
      options: ['ねこ (Neko)', 'いぬ (Inu)', 'さかな (Sakana)'],
      correct_answer: 'ねこ (Neko)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_003', category: 'Animals', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🐟',
      english: { word: 'Fish',  phonics: 'F-I-SH',  sentence: 'The fish is swimming.'  },
      nepali:  { word: 'माछा',  roman: 'Machha',    sentence: 'माछा पौडिरहेको छ।'     },
      japanese:{ word: '魚',    kana: 'さかな',      romaji: 'Sakana', sentence: '魚が泳いでいます。' },
    },
    interactive_quiz: {
      question_nepali: 'माछालाई जापानीमा के भनिन्छ?',
      options: ['さかな (Sakana)', 'とり (Tori)', 'うし (Ushi)'],
      correct_answer: 'さかな (Sakana)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_004', category: 'Animals', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🐦',
      english: { word: 'Bird',  phonics: 'B-I-R-D', sentence: 'The bird is flying.'    },
      nepali:  { word: 'चरा',   roman: 'Chara',     sentence: 'चरा उडिरहेको छ।'       },
      japanese:{ word: '鳥',    kana: 'とり',        romaji: 'Tori',  sentence: '鳥が飛んでいます。' },
    },
    interactive_quiz: {
      question_nepali: 'चरालाई जापानीमा के भनिन्छ?',
      options: ['とり (Tori)', 'うま (Uma)', 'ねこ (Neko)'],
      correct_answer: 'とり (Tori)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_005', category: 'Animals', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🐄',
      english: { word: 'Cow',  phonics: 'C-O-W',   sentence: 'The cow gives us milk.' },
      nepali:  { word: 'गाई',  roman: 'Gai',        sentence: 'गाईले दूध दिन्छ।'      },
      japanese:{ word: '牛',   kana: 'うし',         romaji: 'Ushi',  sentence: '牛はミルクをくれます。' },
    },
    interactive_quiz: {
      question_nepali: 'गाईलाई जापानीमा के भनिन्छ?',
      options: ['うし (Ushi)', 'うま (Uma)', 'ひつじ (Hitsuji)'],
      correct_answer: 'うし (Ushi)',
      star_points: 5,
    },
  },

  // ----- Colors (Nursery) -----
  {
    meta_data: { id: 'vocab_011', category: 'Colors', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🔴',
      english: { word: 'Red',    phonics: 'R-E-D',     sentence: 'The apple is red.'    },
      nepali:  { word: 'रातो',   roman: 'Rato',        sentence: 'स्याउ रातो छ।'        },
      japanese:{ word: '赤',     kana: 'あか',          romaji: 'Aka',   sentence: 'りんごは赤いです。' },
    },
    interactive_quiz: {
      question_nepali: 'रातोलाई जापानीमा के भनिन्छ?',
      options: ['あか (Aka)', 'あお (Ao)', 'きいろ (Kiiro)'],
      correct_answer: 'あか (Aka)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_012', category: 'Colors', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🔵',
      english: { word: 'Blue',   phonics: 'B-L-U-E',   sentence: 'The sky is blue.'     },
      nepali:  { word: 'नीलो',   roman: 'Nilo',        sentence: 'आकाश नीलो छ।'         },
      japanese:{ word: '青',     kana: 'あお',          romaji: 'Ao',    sentence: '空は青いです。' },
    },
    interactive_quiz: {
      question_nepali: 'नीलोलाई जापानीमा के भनिन्छ?',
      options: ['あお (Ao)', 'あか (Aka)', 'みどり (Midori)'],
      correct_answer: 'あお (Ao)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_013', category: 'Colors', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🟢',
      english: { word: 'Green',  phonics: 'G-R-E-E-N', sentence: 'The grass is green.'  },
      nepali:  { word: 'हरियो',  roman: 'Hariyo',      sentence: 'घाँस हरियो छ।'        },
      japanese:{ word: '緑',     kana: 'みどり',        romaji: 'Midori', sentence: '草は緑です。' },
    },
    interactive_quiz: {
      question_nepali: 'हरियोलाई जापानीमा के भनिन्छ?',
      options: ['みどり (Midori)', 'きいろ (Kiiro)', 'しろ (Shiro)'],
      correct_answer: 'みどり (Midori)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_014', category: 'Colors', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '🟡',
      english: { word: 'Yellow',  phonics: 'Y-E-L-L-O-W', sentence: 'The sun is yellow.'  },
      nepali:  { word: 'पहेंलो',  roman: 'Pahelo',         sentence: 'सूर्य पहेंलो छ।'    },
      japanese:{ word: '黄色',    kana: 'きいろ',            romaji: 'Kiiro', sentence: '太陽は黄色いです。' },
    },
    interactive_quiz: {
      question_nepali: 'पहेंलोलाई जापानीमा के भनिन्छ?',
      options: ['きいろ (Kiiro)', 'あか (Aka)', 'くろ (Kuro)'],
      correct_answer: 'きいろ (Kiiro)',
      star_points: 5,
    },
  },

  // ----- Numbers 1-3 (Nursery) -----
  {
    meta_data: { id: 'vocab_016', category: 'Numbers', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '1️⃣',
      english: { word: 'One',   phonics: 'W-U-N',    sentence: 'I have one book.'     },
      nepali:  { word: 'एक',    roman: 'Ek',         sentence: 'मसँग एउटा किताब छ।' },
      japanese:{ word: '一',    kana: 'いち',         romaji: 'Ichi', sentence: '本が一冊あります。' },
    },
    interactive_quiz: {
      question_nepali: 'एकलाई जापानीमा के भनिन्छ?',
      options: ['いち (Ichi)', 'に (Ni)', 'さん (San)'],
      correct_answer: 'いち (Ichi)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_017', category: 'Numbers', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '2️⃣',
      english: { word: 'Two',   phonics: 'T-OO',     sentence: 'I have two hands.'    },
      nepali:  { word: 'दुई',   roman: 'Dui',        sentence: 'मेरो दुईवटा हात छन्।' },
      japanese:{ word: '二',    kana: 'に',           romaji: 'Ni', sentence: '手が二つあります。' },
    },
    interactive_quiz: {
      question_nepali: 'दुईलाई जापानीमा के भनिन्छ?',
      options: ['に (Ni)', 'いち (Ichi)', 'さん (San)'],
      correct_answer: 'に (Ni)',
      star_points: 5,
    },
  },
  {
    meta_data: { id: 'vocab_018', category: 'Numbers', difficulty_level: 'Beginner', age_group: '3-4', class_level: 'Nursery' },
    trilingual_content: {
      emoji: '3️⃣',
      english: { word: 'Three',  phonics: 'TH-R-EE',  sentence: 'There are three birds.' },
      nepali:  { word: 'तीन',    roman: 'Teen',        sentence: 'तीनवटा चरा छन्।'       },
      japanese:{ word: '三',     kana: 'さん',          romaji: 'San', sentence: '鳥が三羽います。' },
    },
    interactive_quiz: {
      question_nepali: 'तीनलाई जापानीमा के भनिन्छ?',
      options: ['さん (San)', 'し (Shi)', 'ご (Go)'],
      correct_answer: 'さん (San)',
      star_points: 5,
    },
  },

  // ==================== CLASS 1 LEVEL ====================
  // ----- Fruits (Class 1) -----
  {
    meta_data: { id: 'vocab_006', category: 'Fruits', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍎',
      english: { word: 'Apple',      phonics: 'A-P-P-LE',   sentence: 'I like to eat apples.'   },
      nepali:  { word: 'स्याउ',      roman: 'Syau',         sentence: 'मलाई स्याउ खान मनपर्छ।' },
      japanese:{ word: 'りんご',     kana: 'りんご',         romaji: 'Ringo', sentence: 'りんごが好きです。' },
    },
    interactive_quiz: {
      question_nepali: 'स्याउलाई जापानीमा के भनिन्छ?',
      options: ['りんご (Ringo)', 'みかん (Mikan)', 'ぶどう (Budou)'],
      correct_answer: 'りんご (Ringo)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_007', category: 'Fruits', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍌',
      english: { word: 'Banana',  phonics: 'B-A-N-A-N-A', sentence: 'The banana is yellow.'    },
      nepali:  { word: 'केरा',    roman: 'Kera',           sentence: 'केरा पहेंलो हुन्छ।'     },
      japanese:{ word: 'バナナ',  kana: 'バナナ',           romaji: 'Banana', sentence: 'バナナは黄色いです。' },
    },
    interactive_quiz: {
      question_nepali: 'केरालाई जापानीमा के भनिन्छ?',
      options: ['バナナ (Banana)', 'りんご (Ringo)', 'いちご (Ichigo)'],
      correct_answer: 'バナナ (Banana)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_008', category: 'Fruits', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍇',
      english: { word: 'Grapes',     phonics: 'G-R-A-P-ES', sentence: 'Grapes are sweet.'      },
      nepali:  { word: 'अंगुर',      roman: 'Angur',         sentence: 'अंगुर गुलियो हुन्छ।' },
      japanese:{ word: 'ぶどう',     kana: 'ぶどう',          romaji: 'Budou', sentence: 'ぶどうは甘いです。' },
    },
    interactive_quiz: {
      question_nepali: 'अंगुरलाई जापानीमा के भनिन्छ?',
      options: ['ぶどう (Budou)', 'もも (Momo)', 'みかん (Mikan)'],
      correct_answer: 'ぶどう (Budou)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_009', category: 'Fruits', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍊',
      english: { word: 'Orange',  phonics: 'O-R-A-N-GE', sentence: 'Orange juice is tasty.'   },
      nepali:  { word: 'सुन्तला', roman: 'Suntala',       sentence: 'सुन्तलाको रस मिठो हुन्छ।' },
      japanese:{ word: 'みかん',  kana: 'みかん',          romaji: 'Mikan', sentence: 'みかんジュースはおいしい。' },
    },
    interactive_quiz: {
      question_nepali: 'सुन्तलालाई जापानीमा के भनिन्छ?',
      options: ['みかん (Mikan)', 'りんご (Ringo)', 'もも (Momo)'],
      correct_answer: 'みかん (Mikan)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_010', category: 'Fruits', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍓',
      english: { word: 'Strawberry', phonics: 'S-T-R-A-W-B-E-R-R-Y', sentence: 'Strawberries are red.' },
      nepali:  { word: 'स्ट्रबेरी', roman: 'Strawberry',              sentence: 'स्ट्रबेरी रातो हुन्छ।' },
      japanese:{ word: 'いちご',     kana: 'いちご',                    romaji: 'Ichigo', sentence: 'いちごは赤いです。' },
    },
    interactive_quiz: {
      question_nepali: 'स्ट्रबेरीलाई जापानीमा के भनिन्छ?',
      options: ['いちご (Ichigo)', 'ぶどう (Budou)', 'バナナ (Banana)'],
      correct_answer: 'いちご (Ichigo)',
      star_points: 10,
    },
  },

  // ----- Colors (Class 1) -----
  {
    meta_data: { id: 'vocab_015', category: 'Colors', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '⚪',
      english: { word: 'White',  phonics: 'W-H-I-T-E', sentence: 'Snow is white.'   },
      nepali:  { word: 'सेतो',   roman: 'Seto',         sentence: 'हिउँ सेतो हुन्छ।' },
      japanese:{ word: '白',     kana: 'しろ',           romaji: 'Shiro', sentence: '雪は白いです。' },
    },
    interactive_quiz: {
      question_nepali: 'सेतोलाई जापानीमा के भनिन्छ?',
      options: ['しろ (Shiro)', 'くろ (Kuro)', 'あお (Ao)'],
      correct_answer: 'しろ (Shiro)',
      star_points: 10,
    },
  },

  // ----- Numbers 4-5 (Class 1) -----
  {
    meta_data: { id: 'vocab_019', category: 'Numbers', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '4️⃣',
      english: { word: 'Four',   phonics: 'F-O-R',   sentence: 'A table has four legs.'   },
      nepali:  { word: 'चार',    roman: 'Char',       sentence: 'टेबलका चारवटा खुट्टा छन्।' },
      japanese:{ word: '四',     kana: 'よん',         romaji: 'Yon', sentence: 'テーブルには足が四つ。' },
    },
    interactive_quiz: {
      question_nepali: 'चारलाई जापानीमा के भनिन्छ?',
      options: ['よん (Yon)', 'さん (San)', 'ご (Go)'],
      correct_answer: 'よん (Yon)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_020', category: 'Numbers', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '5️⃣',
      english: { word: 'Five',   phonics: 'F-I-VE',  sentence: 'I have five fingers.'  },
      nepali:  { word: 'पाँच',   roman: 'Panch',      sentence: 'मेरा पाँचवटा औंला छन्।' },
      japanese:{ word: '五',     kana: 'ご',           romaji: 'Go', sentence: '指が五本あります。' },
    },
    interactive_quiz: {
      question_nepali: 'पाँचलाई जापानीमा के भनिन्छ?',
      options: ['ご (Go)', 'ろく (Roku)', 'よん (Yon)'],
      correct_answer: 'ご (Go)',
      star_points: 10,
    },
  },

  // ----- Body (Class 1) -----
  {
    meta_data: { id: 'vocab_021', category: 'Body', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '👀',
      english: { word: 'Eyes',   phonics: 'EY-ES',   sentence: 'I see with my eyes.'  },
      nepali:  { word: 'आँखा',   roman: 'Aankha',    sentence: 'म आँखाले हेर्छु।'    },
      japanese:{ word: '目',     kana: 'め',          romaji: 'Me', sentence: '目で見ます。' },
    },
    interactive_quiz: {
      question_nepali: 'आँखालाई जापानीमा के भनिन्छ?',
      options: ['め (Me)', 'はな (Hana)', 'みみ (Mimi)'],
      correct_answer: 'め (Me)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_022', category: 'Body', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '👂',
      english: { word: 'Ear',    phonics: 'E-AR',    sentence: 'I hear with my ears.'  },
      nepali:  { word: 'कान',    roman: 'Kaan',       sentence: 'म कानले सुन्छु।'      },
      japanese:{ word: '耳',     kana: 'みみ',         romaji: 'Mimi', sentence: '耳で聞きます。' },
    },
    interactive_quiz: {
      question_nepali: 'कानलाई जापानीमा के भनिन्छ?',
      options: ['みみ (Mimi)', 'め (Me)', 'くち (Kuchi)'],
      correct_answer: 'みみ (Mimi)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_023', category: 'Body', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '👄',
      english: { word: 'Mouth',  phonics: 'M-O-U-TH', sentence: 'I eat with my mouth.'  },
      nepali:  { word: 'मुख',    roman: 'Mukh',        sentence: 'म मुखले खान्छु।'      },
      japanese:{ word: '口',     kana: 'くち',          romaji: 'Kuchi', sentence: '口で食べます。' },
    },
    interactive_quiz: {
      question_nepali: 'मुखलाई जापानीमा के भनिन्छ?',
      options: ['くち (Kuchi)', 'て (Te)', 'あし (Ashi)'],
      correct_answer: 'くち (Kuchi)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_024', category: 'Body', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '✋',
      english: { word: 'Hand',   phonics: 'H-A-N-D',  sentence: 'I write with my hand.' },
      nepali:  { word: 'हात',    roman: 'Haat',        sentence: 'म हातले लेख्छु।'      },
      japanese:{ word: '手',     kana: 'て',            romaji: 'Te', sentence: '手で書きます。' },
    },
    interactive_quiz: {
      question_nepali: 'हातलाई जापानीमा के भनिन्छ?',
      options: ['て (Te)', 'あし (Ashi)', 'あたま (Atama)'],
      correct_answer: 'て (Te)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_025', category: 'Body', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '👃',
      english: { word: 'Nose',   phonics: 'N-O-SE',   sentence: 'I smell with my nose.' },
      nepali:  { word: 'नाक',    roman: 'Naak',        sentence: 'म नाकले सुँघ्छु।'    },
      japanese:{ word: '鼻',     kana: 'はな',          romaji: 'Hana', sentence: '鼻でにおいます。' },
    },
    interactive_quiz: {
      question_nepali: 'नाकलाई जापानीमा के भनिन्छ?',
      options: ['はな (Hana)', 'め (Me)', 'くち (Kuchi)'],
      correct_answer: 'はな (Hana)',
      star_points: 10,
    },
  },

  // ----- Food (Class 1) -----
  {
    meta_data: { id: 'vocab_026', category: 'Food', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍚',
      english: { word: 'Rice',   phonics: 'R-I-CE',   sentence: 'Rice is our main food.'  },
      nepali:  { word: 'भात',    roman: 'Bhaat',       sentence: 'भात हाम्रो मुख्य खाना हो।' },
      japanese:{ word: 'ご飯',   kana: 'ごはん',        romaji: 'Gohan', sentence: 'ご飯は主食です。' },
    },
    interactive_quiz: {
      question_nepali: 'भातलाई जापानीमा के भनिन्छ?',
      options: ['ごはん (Gohan)', 'パン (Pan)', 'みず (Mizu)'],
      correct_answer: 'ごはん (Gohan)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_027', category: 'Food', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🍞',
      english: { word: 'Bread',  phonics: 'B-R-E-A-D', sentence: 'I eat bread for breakfast.'    },
      nepali:  { word: 'रोटी',   roman: 'Roti',         sentence: 'म बिहान रोटी खान्छु।'        },
      japanese:{ word: 'パン',   kana: 'パン',           romaji: 'Pan', sentence: '朝ごはんにパンを食べます。' },
    },
    interactive_quiz: {
      question_nepali: 'रोटीलाई जापानीमा के भनिन्छ?',
      options: ['パン (Pan)', 'ごはん (Gohan)', 'たまご (Tamago)'],
      correct_answer: 'パン (Pan)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_028', category: 'Food', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '💧',
      english: { word: 'Water',  phonics: 'W-A-T-ER', sentence: 'We need water to live.'  },
      nepali:  { word: 'पानी',   roman: 'Paani',       sentence: 'हामीलाई बाँच्न पानी चाहिन्छ।' },
      japanese:{ word: '水',     kana: 'みず',          romaji: 'Mizu', sentence: '水は大切です。' },
    },
    interactive_quiz: {
      question_nepali: 'पानीलाई जापानीमा के भनिन्छ?',
      options: ['みず (Mizu)', 'ぎゅうにゅう (Gyuunyuu)', 'ごはん (Gohan)'],
      correct_answer: 'みず (Mizu)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_029', category: 'Food', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🥚',
      english: { word: 'Egg',    phonics: 'E-G-G',    sentence: 'Eggs are healthy.'   },
      nepali:  { word: 'अण्डा',  roman: 'Anda',        sentence: 'अण्डा स्वास्थ्यकर हुन्छ।' },
      japanese:{ word: '卵',     kana: 'たまご',        romaji: 'Tamago', sentence: '卵は体にいいです。' },
    },
    interactive_quiz: {
      question_nepali: 'अण्डालाई जापानीमा के भनिन्छ?',
      options: ['たまご (Tamago)', 'パン (Pan)', 'にく (Niku)'],
      correct_answer: 'たまご (Tamago)',
      star_points: 10,
    },
  },
  {
    meta_data: { id: 'vocab_030', category: 'Food', difficulty_level: 'Beginner', age_group: '5-6', class_level: 'Class1' },
    trilingual_content: {
      emoji: '🥛',
      english: { word: 'Milk',   phonics: 'M-I-L-K',  sentence: 'Milk makes bones strong.'   },
      nepali:  { word: 'दूध',    roman: 'Dudh',        sentence: 'दूधले हड्डी बलियो बनाउँछ।' },
      japanese:{ word: '牛乳',   kana: 'ぎゅうにゅう',  romaji: 'Gyuunyuu', sentence: '牛乳は骨を強くします。' },
    },
    interactive_quiz: {
      question_nepali: 'दूधलाई जापानीमा के भनिन्छ?',
      options: ['ぎゅうにゅう (Gyuunyuu)', 'みず (Mizu)', 'ごはん (Gohan)'],
      correct_answer: 'ぎゅうにゅう (Gyuunyuu)',
      star_points: 10,
    },
  },

  // ==================== CLASS 2 LEVEL ====================
  // ----- Shapes (Class 2) -----
  {
    meta_data: { id: 'vocab_031', category: 'Shapes', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '⭕',
      english: { word: 'Circle',   phonics: 'C-I-R-CLE',   sentence: 'The wheel is a circle.'      },
      nepali:  { word: 'गोलो',     roman: 'Golo',           sentence: 'पाङ्ग्रा गोलो हुन्छ।'       },
      japanese:{ word: '丸',       kana: 'まる',             romaji: 'Maru', sentence: 'タイヤは丸いです。' },
    },
    interactive_quiz: {
      question_nepali: 'गोलोलाई जापानीमा के भनिन्छ?',
      options: ['まる (Maru)', 'しかく (Shikaku)', 'さんかく (Sankaku)', 'ほし (Hoshi)'],
      correct_answer: 'まる (Maru)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_032', category: 'Shapes', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '⬛',
      english: { word: 'Square',   phonics: 'S-Q-U-A-RE',  sentence: 'The box is a square.'       },
      nepali:  { word: 'चौकोर',    roman: 'Chaukor',        sentence: 'बाकस चौकोर हुन्छ।'         },
      japanese:{ word: '四角',     kana: 'しかく',           romaji: 'Shikaku', sentence: '箱は四角いです。' },
    },
    interactive_quiz: {
      question_nepali: 'चौकोरलाई जापानीमा के भनिन्छ?',
      options: ['まる (Maru)', 'しかく (Shikaku)', 'さんかく (Sankaku)', 'ほし (Hoshi)'],
      correct_answer: 'しかく (Shikaku)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_033', category: 'Shapes', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🔺',
      english: { word: 'Triangle',  phonics: 'T-R-I-A-N-GLE', sentence: 'A triangle has 3 sides.'  },
      nepali:  { word: 'त्रिभुज',   roman: 'Tribhuj',          sentence: 'त्रिभुजका तीन भुजा हुन्छन्।' },
      japanese:{ word: '三角',      kana: 'さんかく',            romaji: 'Sankaku', sentence: '三角形は三つの辺があります。' },
    },
    interactive_quiz: {
      question_nepali: 'त्रिभुजलाई जापानीमा के भनिन्छ?',
      options: ['まる (Maru)', 'しかく (Shikaku)', 'さんかく (Sankaku)', 'ほし (Hoshi)'],
      correct_answer: 'さんかく (Sankaku)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_034', category: 'Shapes', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '⭐',
      english: { word: 'Star',    phonics: 'S-T-A-R',     sentence: 'A star has five points.'   },
      nepali:  { word: 'तारा',    roman: 'Tara',           sentence: 'ताराका पाँच कुना हुन्छन्।' },
      japanese:{ word: '星',      kana: 'ほし',             romaji: 'Hoshi', sentence: '星は五つの角があります。' },
    },
    interactive_quiz: {
      question_nepali: 'ताराको आकारलाई जापानीमा के भनिन्छ?',
      options: ['まる (Maru)', 'しかく (Shikaku)', 'さんかく (Sankaku)', 'ほし (Hoshi)'],
      correct_answer: 'ほし (Hoshi)',
      star_points: 15,
    },
  },

  // ----- Classroom (Class 2) -----
  {
    meta_data: { id: 'vocab_035', category: 'Classroom', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '✏️',
      english: { word: 'Pencil',  phonics: 'P-E-N-CIL',  sentence: 'I write with a pencil.'  },
      nepali:  { word: 'कलम',     roman: 'Kalam',          sentence: 'म कलमले लेख्छु।'       },
      japanese:{ word: '鉛筆',    kana: 'えんぴつ',         romaji: 'Enpitsu', sentence: '鉛筆で書きます。' },
    },
    interactive_quiz: {
      question_nepali: 'कलमलाई जापानीमा के भनिन्छ?',
      options: ['えんぴつ (Enpitsu)', 'ほん (Hon)', 'かばん (Kaban)', 'いす (Isu)'],
      correct_answer: 'えんぴつ (Enpitsu)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_036', category: 'Classroom', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '📚',
      english: { word: 'Book',    phonics: 'B-OO-K',      sentence: 'I read a book every day.'  },
      nepali:  { word: 'किताब',   roman: 'Kitaab',         sentence: 'म रोज किताब पढ्छु।'     },
      japanese:{ word: '本',      kana: 'ほん',             romaji: 'Hon', sentence: '毎日本を読みます。' },
    },
    interactive_quiz: {
      question_nepali: 'किताबलाई जापानीमा के भनिन्छ?',
      options: ['えんぴつ (Enpitsu)', 'ほん (Hon)', 'かばん (Kaban)', 'いす (Isu)'],
      correct_answer: 'ほん (Hon)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_037', category: 'Classroom', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🎒',
      english: { word: 'Bag',     phonics: 'B-A-G',       sentence: 'I carry my bag to school.' },
      nepali:  { word: 'झोला',    roman: 'Jhola',          sentence: 'म विद्यालय झोला बोक्छु।' },
      japanese:{ word: 'かばん',  kana: 'かばん',           romaji: 'Kaban', sentence: '学校にかばんを持っていきます。' },
    },
    interactive_quiz: {
      question_nepali: 'झोलालाई जापानीमा के भनिन्छ?',
      options: ['えんぴつ (Enpitsu)', 'ほん (Hon)', 'かばん (Kaban)', 'いす (Isu)'],
      correct_answer: 'かばん (Kaban)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_038', category: 'Classroom', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🪑',
      english: { word: 'Chair',   phonics: 'C-H-A-IR',    sentence: 'I sit on a chair.'        },
      nepali:  { word: 'कुर्सी',  roman: 'Kursi',          sentence: 'म कुर्सीमा बस्छु।'      },
      japanese:{ word: '椅子',    kana: 'いす',             romaji: 'Isu', sentence: '椅子に座ります。' },
    },
    interactive_quiz: {
      question_nepali: 'कुर्सीलाई जापानीमा के भनिन्छ?',
      options: ['えんぴつ (Enpitsu)', 'ほん (Hon)', 'かばん (Kaban)', 'いす (Isu)'],
      correct_answer: 'いす (Isu)',
      star_points: 15,
    },
  },

  // ----- Weather (Class 2) -----
  {
    meta_data: { id: 'vocab_039', category: 'Weather', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '☀️',
      english: { word: 'Sun',    phonics: 'S-U-N',    sentence: 'The sun shines brightly.'    },
      nepali:  { word: 'घाम',    roman: 'Ghaam',       sentence: 'घाम चम्किलो छ।'            },
      japanese:{ word: '太陽',   kana: 'たいよう',      romaji: 'Taiyou', sentence: '太陽が明るく輝いています。' },
    },
    interactive_quiz: {
      question_nepali: 'घामलाई जापानीमा के भनिन्छ?',
      options: ['たいよう (Taiyou)', 'あめ (Ame)', 'くも (Kumo)', 'ゆき (Yuki)'],
      correct_answer: 'たいよう (Taiyou)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_040', category: 'Weather', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🌧️',
      english: { word: 'Rain',   phonics: 'R-A-IN',   sentence: 'It is raining today.'        },
      nepali:  { word: 'वर्षा',  roman: 'Barsha',      sentence: 'आज वर्षा भइरहेको छ।'       },
      japanese:{ word: '雨',     kana: 'あめ',          romaji: 'Ame', sentence: '今日は雨が降っています。' },
    },
    interactive_quiz: {
      question_nepali: 'वर्षालाई जापानीमा के भनिन्छ?',
      options: ['たいよう (Taiyou)', 'あめ (Ame)', 'くも (Kumo)', 'ゆき (Yuki)'],
      correct_answer: 'あめ (Ame)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_041', category: 'Weather', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '☁️',
      english: { word: 'Cloud',  phonics: 'C-L-O-U-D', sentence: 'The cloud is white.'        },
      nepali:  { word: 'बादल',   roman: 'Baadal',       sentence: 'बादल सेतो हुन्छ।'          },
      japanese:{ word: '雲',     kana: 'くも',           romaji: 'Kumo', sentence: '雲は白いです。' },
    },
    interactive_quiz: {
      question_nepali: 'बादललाई जापानीमा के भनिन्छ?',
      options: ['たいよう (Taiyou)', 'あめ (Ame)', 'くも (Kumo)', 'ゆき (Yuki)'],
      correct_answer: 'くも (Kumo)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_042', category: 'Weather', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '❄️',
      english: { word: 'Snow',   phonics: 'S-N-OW',   sentence: 'Snow is cold and white.'     },
      nepali:  { word: 'हिउँ',   roman: 'Hiun',        sentence: 'हिउँ चिसो र सेतो हुन्छ।'  },
      japanese:{ word: '雪',     kana: 'ゆき',          romaji: 'Yuki', sentence: '雪は冷たくて白いです。' },
    },
    interactive_quiz: {
      question_nepali: 'हिउँलाई जापानीमा के भनिन्छ?',
      options: ['たいよう (Taiyou)', 'あめ (Ame)', 'くも (Kumo)', 'ゆき (Yuki)'],
      correct_answer: 'ゆき (Yuki)',
      star_points: 15,
    },
  },

  // ----- Vegetables (Class 2) -----
  {
    meta_data: { id: 'vocab_043', category: 'Vegetables', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🥕',
      english: { word: 'Carrot',  phonics: 'C-A-R-R-OT', sentence: 'Carrots are orange.'      },
      nepali:  { word: 'गाजर',    roman: 'Gajar',          sentence: 'गाजर सुन्तले रंगको हुन्छ।' },
      japanese:{ word: '人参',    kana: 'にんじん',          romaji: 'Ninjin', sentence: 'にんじんはオレンジ色です。' },
    },
    interactive_quiz: {
      question_nepali: 'गाजरलाई जापानीमा के भनिन्छ?',
      options: ['にんじん (Ninjin)', 'じゃがいも (Jagaimo)', 'トマト (Tomato)', 'たまねぎ (Tamanegi)'],
      correct_answer: 'にんじん (Ninjin)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_044', category: 'Vegetables', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🥔',
      english: { word: 'Potato',  phonics: 'P-O-T-A-T-O', sentence: 'I like fried potatoes.'  },
      nepali:  { word: 'आलु',     roman: 'Aalu',            sentence: 'मलाई तारेको आलु मनपर्छ।' },
      japanese:{ word: 'じゃがいも', kana: 'じゃがいも',     romaji: 'Jagaimo', sentence: '揚げたじゃがいもが好きです。' },
    },
    interactive_quiz: {
      question_nepali: 'आलुलाई जापानीमा के भनिन्छ?',
      options: ['にんじん (Ninjin)', 'じゃがいも (Jagaimo)', 'トマト (Tomato)', 'たまねぎ (Tamanegi)'],
      correct_answer: 'じゃがいも (Jagaimo)',
      star_points: 15,
    },
  },
  {
    meta_data: { id: 'vocab_045', category: 'Vegetables', difficulty_level: 'Intermediate', age_group: '6-7', class_level: 'Class2' },
    trilingual_content: {
      emoji: '🍅',
      english: { word: 'Tomato',  phonics: 'T-O-M-A-T-O', sentence: 'The tomato is red.'      },
      nepali:  { word: 'गोलभेंडा', roman: 'Golbhenda',      sentence: 'गोलभेंडा रातो हुन्छ।'  },
      japanese:{ word: 'トマト',   kana: 'トマト',            romaji: 'Tomato', sentence: 'トマトは赤いです。' },
    },
    interactive_quiz: {
      question_nepali: 'गोलभेंडालाई जापानीमा के भनिन्छ?',
      options: ['にんじん (Ninjin)', 'じゃがいも (Jagaimo)', 'トマト (Tomato)', 'たまねぎ (Tamanegi)'],
      correct_answer: 'トマト (Tomato)',
      star_points: 15,
    },
  },

  // ==================== CLASS 3 LEVEL ====================
  // ----- Transport (Class 3) -----
  {
    meta_data: { id: 'vocab_046', category: 'Transport', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '🚗',
      english: { word: 'Car',      phonics: 'C-A-R',        sentence: 'My dad drives a car.'     },
      nepali:  { word: 'गाडी',     roman: 'Gaadi',           sentence: 'मेरो बुवा गाडी चलाउँछन्।' },
      japanese:{ word: '車',       kana: 'くるま',            romaji: 'Kuruma', sentence: '父は車を運転します。' },
    },
    interactive_quiz: {
      question_nepali: 'गाडीलाई जापानीमा के भनिन्छ?',
      options: ['くるま (Kuruma)', 'バス (Basu)', 'でんしゃ (Densha)', 'ひこうき (Hikouki)'],
      correct_answer: 'くるま (Kuruma)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_047', category: 'Transport', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '🚌',
      english: { word: 'Bus',      phonics: 'B-U-S',        sentence: 'I go to school by bus.'   },
      nepali:  { word: 'बस',       roman: 'Bas',             sentence: 'म बसमा विद्यालय जान्छु।' },
      japanese:{ word: 'バス',     kana: 'バス',              romaji: 'Basu', sentence: 'バスで学校に行きます。' },
    },
    interactive_quiz: {
      question_nepali: 'बसलाई जापानीमा के भनिन्छ?',
      options: ['くるま (Kuruma)', 'バス (Basu)', 'でんしゃ (Densha)', 'ひこうき (Hikouki)'],
      correct_answer: 'バス (Basu)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_048', category: 'Transport', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '🚂',
      english: { word: 'Train',    phonics: 'T-R-A-IN',     sentence: 'The train is very fast.'  },
      nepali:  { word: 'रेलगाडी', roman: 'Relgaadi',        sentence: 'रेलगाडी धेरै छिटो छ।'   },
      japanese:{ word: '電車',     kana: 'でんしゃ',          romaji: 'Densha', sentence: '電車はとても速いです。' },
    },
    interactive_quiz: {
      question_nepali: 'रेलगाडीलाई जापानीमा के भनिन्छ?',
      options: ['くるま (Kuruma)', 'バス (Basu)', 'でんしゃ (Densha)', 'ひこうき (Hikouki)'],
      correct_answer: 'でんしゃ (Densha)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_049', category: 'Transport', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '🚲',
      english: { word: 'Bicycle',  phonics: 'B-I-C-Y-CLE',  sentence: 'I ride a bicycle.'        },
      nepali:  { word: 'साइकल',   roman: 'Saikal',           sentence: 'म साइकल चलाउँछु।'       },
      japanese:{ word: '自転車',   kana: 'じてんしゃ',         romaji: 'Jitensha', sentence: '自転車に乗ります。' },
    },
    interactive_quiz: {
      question_nepali: 'साइकललाई जापानीमा के भनिन्छ?',
      options: ['くるま (Kuruma)', 'じてんしゃ (Jitensha)', 'でんしゃ (Densha)', 'ひこうき (Hikouki)'],
      correct_answer: 'じてんしゃ (Jitensha)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_050', category: 'Transport', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '✈️',
      english: { word: 'Airplane', phonics: 'A-IR-P-L-A-NE', sentence: 'The airplane flies high.' },
      nepali:  { word: 'हवाईजहाज', roman: 'Hawaaijahaj',      sentence: 'हवाईजहाज उच्च उड्छ।'   },
      japanese:{ word: '飛行機',   kana: 'ひこうき',            romaji: 'Hikouki', sentence: '飛行機は高く飛びます。' },
    },
    interactive_quiz: {
      question_nepali: 'हवाईजहाजलाई जापानीमा के भनिन्छ?',
      options: ['くるま (Kuruma)', 'バス (Basu)', 'でんしゃ (Densha)', 'ひこうき (Hikouki)'],
      correct_answer: 'ひこうき (Hikouki)',
      star_points: 20,
    },
  },

  // ----- Family (Class 3) -----
  {
    meta_data: { id: 'vocab_051', category: 'Family', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '👩',
      english: { word: 'Mother',   phonics: 'M-O-TH-ER',    sentence: 'My mother cooks food.'    },
      nepali:  { word: 'आमा',      roman: 'Aama',            sentence: 'मेरी आमाले खाना पकाउनुहुन्छ।' },
      japanese:{ word: 'お母さん', kana: 'おかあさん',         romaji: 'Okaasan', sentence: '母は料理をします。' },
    },
    interactive_quiz: {
      question_nepali: 'आमालाई जापानीमा के भनिन्छ?',
      options: ['おかあさん (Okaasan)', 'おとうさん (Otousan)', 'おねえさん (Oneesan)', 'おにいさん (Oniisan)'],
      correct_answer: 'おかあさん (Okaasan)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_052', category: 'Family', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '👨',
      english: { word: 'Father',   phonics: 'F-A-TH-ER',    sentence: 'My father goes to work.'  },
      nepali:  { word: 'बुवा',     roman: 'Buwa',            sentence: 'मेरो बुवा काममा जानुहुन्छ।' },
      japanese:{ word: 'お父さん', kana: 'おとうさん',         romaji: 'Otousan', sentence: '父は仕事に行きます。' },
    },
    interactive_quiz: {
      question_nepali: 'बुवालाई जापानीमा के भनिन्छ?',
      options: ['おかあさん (Okaasan)', 'おとうさん (Otousan)', 'おねえさん (Oneesan)', 'おにいさん (Oniisan)'],
      correct_answer: 'おとうさん (Otousan)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_053', category: 'Family', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '👧',
      english: { word: 'Sister',   phonics: 'S-I-S-TER',    sentence: 'My sister likes to sing.' },
      nepali:  { word: 'दिदी',     roman: 'Didi',            sentence: 'मेरी दिदीलाई गाउन मनपर्छ।' },
      japanese:{ word: 'お姉さん', kana: 'おねえさん',         romaji: 'Oneesan', sentence: '姉は歌が好きです。' },
    },
    interactive_quiz: {
      question_nepali: 'दिदीलाई जापानीमा के भनिन्छ?',
      options: ['おかあさん (Okaasan)', 'おとうさん (Otousan)', 'おねえさん (Oneesan)', 'おにいさん (Oniisan)'],
      correct_answer: 'おねえさん (Oneesan)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_054', category: 'Family', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '👦',
      english: { word: 'Brother',  phonics: 'B-R-O-TH-ER',  sentence: 'My brother plays football.' },
      nepali:  { word: 'दाइ',      roman: 'Dai',             sentence: 'मेरो दाइले फुटबल खेल्छन्।' },
      japanese:{ word: 'お兄さん', kana: 'おにいさん',         romaji: 'Oniisan', sentence: '兄はサッカーをします。' },
    },
    interactive_quiz: {
      question_nepali: 'दाइलाई जापानीमा के भनिन्छ?',
      options: ['おかあさん (Okaasan)', 'おとうさん (Otousan)', 'おねえさん (Oneesan)', 'おにいさん (Oniisan)'],
      correct_answer: 'おにいさん (Oniisan)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_055', category: 'Family', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '👶',
      english: { word: 'Baby',     phonics: 'B-A-B-Y',      sentence: 'The baby is sleeping.'    },
      nepali:  { word: 'बच्चा',    roman: 'Bachcha',         sentence: 'बच्चा सुतिरहेको छ।'     },
      japanese:{ word: '赤ちゃん', kana: 'あかちゃん',         romaji: 'Akachan', sentence: '赤ちゃんが寝ています。' },
    },
    interactive_quiz: {
      question_nepali: 'बच्चालाई जापानीमा के भनिन्छ?',
      options: ['おかあさん (Okaasan)', 'おとうさん (Otousan)', 'あかちゃん (Akachan)', 'おにいさん (Oniisan)'],
      correct_answer: 'あかちゃん (Akachan)',
      star_points: 20,
    },
  },

  // ----- Actions (Class 3) -----
  {
    meta_data: { id: 'vocab_056', category: 'Actions', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '🏃',
      english: { word: 'Run',    phonics: 'R-U-N',   sentence: 'I run every morning.'      },
      nepali:  { word: 'दौड्नु', roman: 'Daudnu',     sentence: 'म हरेक बिहान दौड्छु।'    },
      japanese:{ word: '走る',   kana: 'はしる',       romaji: 'Hashiru', sentence: '毎朝走ります。' },
    },
    interactive_quiz: {
      question_nepali: 'दौड्नुलाई जापानीमा के भनिन्छ?',
      options: ['はしる (Hashiru)', 'とぶ (Tobu)', 'よむ (Yomu)', 'たべる (Taberu)'],
      correct_answer: 'はしる (Hashiru)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_057', category: 'Actions', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '🦘',
      english: { word: 'Jump',   phonics: 'J-U-M-P', sentence: 'Can you jump high?'        },
      nepali:  { word: 'उफ्रनु', roman: 'Ufranu',     sentence: 'तिमी अग्लो उफ्रन सक्छौ?'  },
      japanese:{ word: '跳ぶ',   kana: 'とぶ',         romaji: 'Tobu', sentence: '高く跳べますか？' },
    },
    interactive_quiz: {
      question_nepali: 'उफ्रनुलाई जापानीमा के भनिन्छ?',
      options: ['はしる (Hashiru)', 'とぶ (Tobu)', 'よむ (Yomu)', 'たべる (Taberu)'],
      correct_answer: 'とぶ (Tobu)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_058', category: 'Actions', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '📖',
      english: { word: 'Read',   phonics: 'R-E-A-D', sentence: 'I love to read books.'     },
      nepali:  { word: 'पढ्नु',  roman: 'Padhnu',     sentence: 'मलाई किताब पढ्न मनपर्छ।' },
      japanese:{ word: '読む',   kana: 'よむ',         romaji: 'Yomu', sentence: '本を読むのが好きです。' },
    },
    interactive_quiz: {
      question_nepali: 'पढ्नुलाई जापानीमा के भनिन्छ?',
      options: ['はしる (Hashiru)', 'とぶ (Tobu)', 'よむ (Yomu)', 'かく (Kaku)'],
      correct_answer: 'よむ (Yomu)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_059', category: 'Actions', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '✍️',
      english: { word: 'Write',  phonics: 'W-R-ITE', sentence: 'I write in my notebook.'   },
      nepali:  { word: 'लेख्नु', roman: 'Lekhnu',     sentence: 'म कापीमा लेख्छु।'         },
      japanese:{ word: '書く',   kana: 'かく',         romaji: 'Kaku', sentence: 'ノートに書きます。' },
    },
    interactive_quiz: {
      question_nepali: 'लेख्नुलाई जापानीमा के भनिन्छ?',
      options: ['はしる (Hashiru)', 'とぶ (Tobu)', 'よむ (Yomu)', 'かく (Kaku)'],
      correct_answer: 'かく (Kaku)',
      star_points: 20,
    },
  },
  {
    meta_data: { id: 'vocab_060', category: 'Actions', difficulty_level: 'Intermediate', age_group: '7-8', class_level: 'Class3' },
    trilingual_content: {
      emoji: '😋',
      english: { word: 'Eat',   phonics: 'E-A-T',   sentence: 'I eat rice for lunch.'     },
      nepali:  { word: 'खानु',  roman: 'Khaanu',     sentence: 'म दिउँसो भात खान्छु।'     },
      japanese:{ word: '食べる', kana: 'たべる',       romaji: 'Taberu', sentence: '昼ご飯にご飯を食べます。' },
    },
    interactive_quiz: {
      question_nepali: 'खानुलाई जापानीमा के भनिन्छ?',
      options: ['はしる (Hashiru)', 'とぶ (Tobu)', 'よむ (Yomu)', 'たべる (Taberu)'],
      correct_answer: 'たべる (Taberu)',
      star_points: 20,
    },
  },

  // ==================== CLASS 4 LEVEL ====================
  // ----- Emotions (Class 4) -----
  {
    meta_data: { id: 'vocab_061', category: 'Emotions', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '😊',
      english: { word: 'Happy',     phonics: 'H-A-P-P-Y',    sentence: 'I am happy today.'        },
      nepali:  { word: 'खुशी',      roman: 'Khushi',          sentence: 'आज म खुशी छु।'           },
      japanese:{ word: '嬉しい',    kana: 'うれしい',          romaji: 'Ureshii', sentence: '今日は嬉しいです。' },
    },
    interactive_quiz: {
      question_nepali: 'खुशीलाई जापानीमा के भनिन्छ?',
      options: ['うれしい (Ureshii)', 'かなしい (Kanashii)', 'おこっている (Okotte iru)', 'びっくり (Bikkuri)'],
      correct_answer: 'うれしい (Ureshii)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_062', category: 'Emotions', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '😢',
      english: { word: 'Sad',       phonics: 'S-A-D',         sentence: 'Do not feel sad.'         },
      nepali:  { word: 'दुखी',      roman: 'Dukhi',           sentence: 'दुखी नहोऊ।'              },
      japanese:{ word: '悲しい',    kana: 'かなしい',          romaji: 'Kanashii', sentence: '悲しまないでください。' },
    },
    interactive_quiz: {
      question_nepali: 'दुखीलाई जापानीमा के भनिन्छ?',
      options: ['うれしい (Ureshii)', 'かなしい (Kanashii)', 'おこっている (Okotte iru)', 'びっくり (Bikkuri)'],
      correct_answer: 'かなしい (Kanashii)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_063', category: 'Emotions', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '😠',
      english: { word: 'Angry',     phonics: 'A-N-G-R-Y',    sentence: 'He is angry at me.'       },
      nepali:  { word: 'रिसाएको',   roman: 'Risaeko',         sentence: 'उ मसँग रिसाएको छ।'      },
      japanese:{ word: '怒っている', kana: 'おこっている',      romaji: 'Okotte iru', sentence: '彼は私に怒っています。' },
    },
    interactive_quiz: {
      question_nepali: 'रिसाएकोलाई जापानीमा के भनिन्छ?',
      options: ['うれしい (Ureshii)', 'かなしい (Kanashii)', 'おこっている (Okotte iru)', 'びっくり (Bikkuri)'],
      correct_answer: 'おこっている (Okotte iru)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_064', category: 'Emotions', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '😲',
      english: { word: 'Surprised',  phonics: 'SUR-PRISED',   sentence: 'I was so surprised!'     },
      nepali:  { word: 'छक्क परेको', roman: 'Chhakka pareko', sentence: 'म धेरै छक्क परें!'      },
      japanese:{ word: 'びっくり',   kana: 'びっくり',          romaji: 'Bikkuri', sentence: 'とてもびっくりしました！' },
    },
    interactive_quiz: {
      question_nepali: 'छक्क परेकोलाई जापानीमा के भनिन्छ?',
      options: ['うれしい (Ureshii)', 'かなしい (Kanashii)', 'おこっている (Okotte iru)', 'びっくり (Bikkuri)'],
      correct_answer: 'びっくり (Bikkuri)',
      star_points: 25,
    },
  },

  // ----- Nature (Class 4) -----
  {
    meta_data: { id: 'vocab_065', category: 'Nature', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '⛰️',
      english: { word: 'Mountain',  phonics: 'M-O-U-N-TAIN', sentence: 'Nepal has many mountains.' },
      nepali:  { word: 'पहाड',      roman: 'Pahad',           sentence: 'नेपालमा धेरै पहाड छन्।'  },
      japanese:{ word: '山',        kana: 'やま',              romaji: 'Yama', sentence: 'ネパールには山がたくさんあります。' },
    },
    interactive_quiz: {
      question_nepali: 'पहाडलाई जापानीमा के भनिन्छ?',
      options: ['やま (Yama)', 'かわ (Kawa)', 'き (Ki)', 'はな (Hana)'],
      correct_answer: 'やま (Yama)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_066', category: 'Nature', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🏞️',
      english: { word: 'River',    phonics: 'R-I-V-ER',      sentence: 'The river flows fast.'     },
      nepali:  { word: 'नदी',      roman: 'Nadi',             sentence: 'नदी द्रुत बग्छ।'          },
      japanese:{ word: '川',       kana: 'かわ',               romaji: 'Kawa', sentence: '川が速く流れています。' },
    },
    interactive_quiz: {
      question_nepali: 'नदीलाई जापानीमा के भनिन्छ?',
      options: ['やま (Yama)', 'かわ (Kawa)', 'き (Ki)', 'はな (Hana)'],
      correct_answer: 'かわ (Kawa)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_067', category: 'Nature', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🌳',
      english: { word: 'Tree',     phonics: 'T-R-EE',         sentence: 'The tree gives us shade.'  },
      nepali:  { word: 'रुख',      roman: 'Rukh',             sentence: 'रुखले छाया दिन्छ।'        },
      japanese:{ word: '木',       kana: 'き',                 romaji: 'Ki', sentence: '木は日陰を与えてくれます。' },
    },
    interactive_quiz: {
      question_nepali: 'रुखलाई जापानीमा के भनिन्छ?',
      options: ['やま (Yama)', 'かわ (Kawa)', 'き (Ki)', 'はな (Hana)'],
      correct_answer: 'き (Ki)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_068', category: 'Nature', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🌸',
      english: { word: 'Flower',   phonics: 'F-L-O-W-ER',    sentence: 'The flower is beautiful.'  },
      nepali:  { word: 'फूल',      roman: 'Phool',            sentence: 'फूल सुन्दर हुन्छ।'        },
      japanese:{ word: '花',       kana: 'はな',               romaji: 'Hana (flower)', sentence: '花はきれいです。' },
    },
    interactive_quiz: {
      question_nepali: 'फूललाई जापानीमा के भनिन्छ?',
      options: ['やま (Yama)', 'かわ (Kawa)', 'き (Ki)', 'はな (Hana flower)'],
      correct_answer: 'はな (Hana flower)',
      star_points: 25,
    },
  },

  // ----- Places (Class 4) -----
  {
    meta_data: { id: 'vocab_069', category: 'Places', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🏫',
      english: { word: 'School',    phonics: 'S-C-H-OOL',    sentence: 'I love going to school.'   },
      nepali:  { word: 'विद्यालय',  roman: 'Vidyalaya',       sentence: 'मलाई विद्यालय जान मनपर्छ।' },
      japanese:{ word: '学校',      kana: 'がっこう',           romaji: 'Gakkou', sentence: '学校に行くのが好きです。' },
    },
    interactive_quiz: {
      question_nepali: 'विद्यालयलाई जापानीमा के भनिन्छ?',
      options: ['がっこう (Gakkou)', 'びょういん (Byouin)', 'いちば (Ichiba)', 'こうえん (Kouen)'],
      correct_answer: 'がっこう (Gakkou)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_070', category: 'Places', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🏥',
      english: { word: 'Hospital',  phonics: 'H-O-S-P-I-TAL', sentence: 'The doctor works at hospital.' },
      nepali:  { word: 'अस्पताल',   roman: 'Aspatal',          sentence: 'डाक्टर अस्पतालमा काम गर्छन्।' },
      japanese:{ word: '病院',      kana: 'びょういん',          romaji: 'Byouin', sentence: '医者は病院で働きます。' },
    },
    interactive_quiz: {
      question_nepali: 'अस्पताललाई जापानीमा के भनिन्छ?',
      options: ['がっこう (Gakkou)', 'びょういん (Byouin)', 'いちば (Ichiba)', 'こうえん (Kouen)'],
      correct_answer: 'びょういん (Byouin)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_071', category: 'Places', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🛒',
      english: { word: 'Market',   phonics: 'M-A-R-K-ET',    sentence: 'We buy vegetables at the market.' },
      nepali:  { word: 'बजार',     roman: 'Bajaar',           sentence: 'हामी बजारमा तरकारी किन्छौं।' },
      japanese:{ word: '市場',     kana: 'いちば',             romaji: 'Ichiba', sentence: '市場で野菜を買います。' },
    },
    interactive_quiz: {
      question_nepali: 'बजारलाई जापानीमा के भनिन्छ?',
      options: ['がっこう (Gakkou)', 'びょういん (Byouin)', 'いちば (Ichiba)', 'こうえん (Kouen)'],
      correct_answer: 'いちば (Ichiba)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_072', category: 'Places', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🏞️',
      english: { word: 'Park',     phonics: 'P-A-R-K',        sentence: 'Children play in the park.'  },
      nepali:  { word: 'पार्क',    roman: 'Park',             sentence: 'बच्चाहरू पार्कमा खेल्छन्।' },
      japanese:{ word: '公園',     kana: 'こうえん',            romaji: 'Kouen', sentence: '子供たちは公園で遊びます。' },
    },
    interactive_quiz: {
      question_nepali: 'पार्कलाई जापानीमा के भनिन्छ?',
      options: ['がっこう (Gakkou)', 'びょういん (Byouin)', 'いちば (Ichiba)', 'こうえん (Kouen)'],
      correct_answer: 'こうえん (Kouen)',
      star_points: 25,
    },
  },

  // ----- Days (Class 4) -----
  {
    meta_data: { id: 'vocab_073', category: 'Numbers', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '📅',
      english: { word: 'Monday',   phonics: 'M-O-N-D-AY',    sentence: 'Monday is the first day of the week.' },
      nepali:  { word: 'सोमवार',   roman: 'Sombaar',          sentence: 'सोमवार हप्ताको पहिलो दिन हो।' },
      japanese:{ word: '月曜日',   kana: 'げつようび',          romaji: 'Getsuyoubi', sentence: '月曜日は週の最初の日です。' },
    },
    interactive_quiz: {
      question_nepali: 'सोमवारलाई जापानीमा के भनिन्छ?',
      options: ['げつようび (Getsuyoubi)', 'にちようび (Nichiyoubi)', 'きんようび (Kinyoubi)', 'どようび (Doyoubi)'],
      correct_answer: 'げつようび (Getsuyoubi)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_074', category: 'Numbers', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🌞',
      english: { word: 'Sunday',   phonics: 'S-U-N-D-AY',    sentence: 'Sunday is a holiday.'     },
      nepali:  { word: 'आइतवार',   roman: 'Aitabaar',         sentence: 'आइतवार बिदाको दिन हो।'   },
      japanese:{ word: '日曜日',   kana: 'にちようび',          romaji: 'Nichiyoubi', sentence: '日曜日は休日です。' },
    },
    interactive_quiz: {
      question_nepali: 'आइतवारलाई जापानीमा के भनिन्छ?',
      options: ['げつようび (Getsuyoubi)', 'にちようび (Nichiyoubi)', 'きんようび (Kinyoubi)', 'どようび (Doyoubi)'],
      correct_answer: 'にちようび (Nichiyoubi)',
      star_points: 25,
    },
  },
  {
    meta_data: { id: 'vocab_075', category: 'Numbers', difficulty_level: 'Advanced', age_group: '8-10', class_level: 'Class4' },
    trilingual_content: {
      emoji: '🎉',
      english: { word: 'Saturday',  phonics: 'S-A-T-UR-D-AY', sentence: 'Saturday is fun!'         },
      nepali:  { word: 'शनिवार',    roman: 'Shanibaar',        sentence: 'शनिवार रमाइलो हुन्छ!'   },
      japanese:{ word: '土曜日',    kana: 'どようび',            romaji: 'Doyoubi', sentence: '土曜日は楽しいです！' },
    },
    interactive_quiz: {
      question_nepali: 'शनिवारलाई जापानीमा के भनिन्छ?',
      options: ['げつようび (Getsuyoubi)', 'にちようび (Nichiyoubi)', 'きんようび (Kinyoubi)', 'どようび (Doyoubi)'],
      correct_answer: 'どようび (Doyoubi)',
      star_points: 25,
    },
  },
];

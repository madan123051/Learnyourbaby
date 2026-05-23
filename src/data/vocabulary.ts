import { TrilingualWord, Category } from '../types';

export const CATEGORIES: Category[] = [
  { name: 'Animals', emoji: '🐾', color: 'bg-warning', description: 'जानवरों को 3 भाषाओं में सीखो!' },
  { name: 'Fruits', emoji: '🍎', color: 'bg-error', description: 'फलों के नाम सीखो!' },
  { name: 'Colors', emoji: '🎨', color: 'bg-secondary', description: 'रंगों की दुनिया!' },
  { name: 'Numbers', emoji: '🔢', color: 'bg-info', description: 'गिनती सीखो!' },
  { name: 'Body', emoji: '🧍', color: 'bg-success', description: 'शरीर के अंग!' },
  { name: 'Food', emoji: '🍱', color: 'bg-primary', description: 'खाने-पीने की चीजें!' },
];

export const VOCABULARY: TrilingualWord[] = [
  {
    meta_data: { id: 'vocab_001', category: 'Animals', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🐶',
      english: { word: 'Dog', phonics: 'D-O-G', sentence: 'The dog is barking.' },
      nepali: { word: 'कुकुर', roman: 'Kukur', sentence: 'कुकुर भुक्दै छ।' },
      japanese: { word: '犬', kana: 'いぬ', romaji: 'Inu', sentence: '犬がほえています。' },
    },
    interactive_quiz: { question_nepali: 'कुकुरलाई जापानीमा के भनिन्छ?', options: ['ねこ (Neko)', 'いぬ (Inu)', 'とり (Tori)'], correct_answer: 'いぬ (Inu)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_002', category: 'Animals', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🐱',
      english: { word: 'Cat', phonics: 'C-A-T', sentence: 'The cat is sleeping.' },
      nepali: { word: 'बिरालो', roman: 'Biralo', sentence: 'बिरालो सुतिरहेको छ।' },
      japanese: { word: '猫', kana: 'ねこ', romaji: 'Neko', sentence: '猫が寝ています。' },
    },
    interactive_quiz: { question_nepali: 'बिरालोलाई जापानीमा के भनिन्छ?', options: ['ねこ (Neko)', 'いぬ (Inu)', 'さかな (Sakana)'], correct_answer: 'ねこ (Neko)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_003', category: 'Animals', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🐟',
      english: { word: 'Fish', phonics: 'F-I-SH', sentence: 'The fish is swimming.' },
      nepali: { word: 'माछा', roman: 'Machha', sentence: 'माछा पौडिरहेको छ।' },
      japanese: { word: '魚', kana: 'さかな', romaji: 'Sakana', sentence: '魚が泳いでいます。' },
    },
    interactive_quiz: { question_nepali: 'माछालाई जापानीमा के भनिन्छ?', options: ['さかな (Sakana)', 'とり (Tori)', 'うし (Ushi)'], correct_answer: 'さかな (Sakana)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_004', category: 'Animals', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🐦',
      english: { word: 'Bird', phonics: 'B-I-R-D', sentence: 'The bird is flying.' },
      nepali: { word: 'चरा', roman: 'Chara', sentence: 'चरा उडिरहेको छ।' },
      japanese: { word: '鳥', kana: 'とり', romaji: 'Tori', sentence: '鳥が飛んでいます。' },
    },
    interactive_quiz: { question_nepali: 'चरालाई जापानीमा के भनिन्छ?', options: ['とり (Tori)', 'うま (Uma)', 'ねこ (Neko)'], correct_answer: 'とり (Tori)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_005', category: 'Animals', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🐄',
      english: { word: 'Cow', phonics: 'C-O-W', sentence: 'The cow gives us milk.' },
      nepali: { word: 'गाई', roman: 'Gai', sentence: 'गाईले दूध दिन्छ।' },
      japanese: { word: '牛', kana: 'うし', romaji: 'Ushi', sentence: '牛はミルクをくれます。' },
    },
    interactive_quiz: { question_nepali: 'गाईलाई जापानीमा के भनिन्छ?', options: ['うし (Ushi)', 'うま (Uma)', 'ひつじ (Hitsuji)'], correct_answer: 'うし (Ushi)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_006', category: 'Fruits', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍎',
      english: { word: 'Apple', phonics: 'A-P-P-LE', sentence: 'I like to eat apples.' },
      nepali: { word: 'स्याउ', roman: 'Syau', sentence: 'मलाई स्याउ खान मनपर्छ।' },
      japanese: { word: 'りんご', kana: 'りんご', romaji: 'Ringo', sentence: 'りんごが好きです。' },
    },
    interactive_quiz: { question_nepali: 'स्याउलाई जापानीमा के भनिन्छ?', options: ['りんご (Ringo)', 'みかん (Mikan)', 'ぶどう (Budou)'], correct_answer: 'りんご (Ringo)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_007', category: 'Fruits', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍌',
      english: { word: 'Banana', phonics: 'B-A-N-A-N-A', sentence: 'The banana is yellow.' },
      nepali: { word: 'केरा', roman: 'Kera', sentence: 'केरा पहेंलो हुन्छ।' },
      japanese: { word: 'バナナ', kana: 'バナナ', romaji: 'Banana', sentence: 'バナナは黄色いです。' },
    },
    interactive_quiz: { question_nepali: 'केरालाई जापानीमा के भनिन्छ?', options: ['バナナ (Banana)', 'りんご (Ringo)', 'いちご (Ichigo)'], correct_answer: 'バナナ (Banana)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_008', category: 'Fruits', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍇',
      english: { word: 'Grapes', phonics: 'G-R-A-P-ES', sentence: 'Grapes are sweet.' },
      nepali: { word: 'अंगुर', roman: 'Angur', sentence: 'अंगुर गुलियो हुन्छ।' },
      japanese: { word: 'ぶどう', kana: 'ぶどう', romaji: 'Budou', sentence: 'ぶどうは甘いです。' },
    },
    interactive_quiz: { question_nepali: 'अंगुरलाई जापानीमा के भनिन्छ?', options: ['ぶどう (Budou)', 'もも (Momo)', 'みかん (Mikan)'], correct_answer: 'ぶどう (Budou)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_009', category: 'Fruits', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍊',
      english: { word: 'Orange', phonics: 'O-R-A-N-GE', sentence: 'Orange juice is tasty.' },
      nepali: { word: 'सुन्तला', roman: 'Suntala', sentence: 'सुन्तलाको रस मिठो हुन्छ।' },
      japanese: { word: 'みかん', kana: 'みかん', romaji: 'Mikan', sentence: 'みかんジュースはおいしい。' },
    },
    interactive_quiz: { question_nepali: 'सुन्तलालाई जापानीमा के भनिन्छ?', options: ['みかん (Mikan)', 'りんご (Ringo)', 'もも (Momo)'], correct_answer: 'みかん (Mikan)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_010', category: 'Fruits', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍓',
      english: { word: 'Strawberry', phonics: 'S-T-R-A-W-B-E-R-R-Y', sentence: 'Strawberries are red.' },
      nepali: { word: 'स्ट्रबेरी', roman: 'Strawberry', sentence: 'स्ट्रबेरी रातो हुन्छ।' },
      japanese: { word: 'いちご', kana: 'いちご', romaji: 'Ichigo', sentence: 'いちごは赤いです。' },
    },
    interactive_quiz: { question_nepali: 'स्ट्रबेरीलाई जापानीमा के भनिन्छ?', options: ['いちご (Ichigo)', 'ぶどう (Budou)', 'バナナ (Banana)'], correct_answer: 'いちご (Ichigo)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_011', category: 'Colors', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🔴',
      english: { word: 'Red', phonics: 'R-E-D', sentence: 'The apple is red.' },
      nepali: { word: 'रातो', roman: 'Rato', sentence: 'स्याउ रातो छ।' },
      japanese: { word: '赤', kana: 'あか', romaji: 'Aka', sentence: 'りんごは赤いです。' },
    },
    interactive_quiz: { question_nepali: 'रातोलाई जापानीमा के भनिन्छ?', options: ['あか (Aka)', 'あお (Ao)', 'きいろ (Kiiro)'], correct_answer: 'あか (Aka)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_012', category: 'Colors', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🔵',
      english: { word: 'Blue', phonics: 'B-L-U-E', sentence: 'The sky is blue.' },
      nepali: { word: 'नीलो', roman: 'Nilo', sentence: 'आकाश नीलो छ।' },
      japanese: { word: '青', kana: 'あお', romaji: 'Ao', sentence: '空は青いです。' },
    },
    interactive_quiz: { question_nepali: 'नीलोलाई जापानीमा के भनिन्छ?', options: ['あお (Ao)', 'あか (Aka)', 'みどり (Midori)'], correct_answer: 'あお (Ao)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_013', category: 'Colors', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🟢',
      english: { word: 'Green', phonics: 'G-R-E-E-N', sentence: 'The grass is green.' },
      nepali: { word: 'हरियो', roman: 'Hariyo', sentence: 'घाँस हरियो छ।' },
      japanese: { word: '緑', kana: 'みどり', romaji: 'Midori', sentence: '草は緑です。' },
    },
    interactive_quiz: { question_nepali: 'हरियोलाई जापानीमा के भनिन्छ?', options: ['みどり (Midori)', 'きいろ (Kiiro)', 'しろ (Shiro)'], correct_answer: 'みどり (Midori)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_014', category: 'Colors', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🟡',
      english: { word: 'Yellow', phonics: 'Y-E-L-L-O-W', sentence: 'The sun is yellow.' },
      nepali: { word: 'पहेंलो', roman: 'Pahelo', sentence: 'सूर्य पहेंलो छ।' },
      japanese: { word: '黄色', kana: 'きいろ', romaji: 'Kiiro', sentence: '太陽は黄色いです。' },
    },
    interactive_quiz: { question_nepali: 'पहेंलोलाई जापानीमा के भनिन्छ?', options: ['きいろ (Kiiro)', 'あか (Aka)', 'くろ (Kuro)'], correct_answer: 'きいろ (Kiiro)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_015', category: 'Colors', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '⚪',
      english: { word: 'White', phonics: 'W-H-I-T-E', sentence: 'Snow is white.' },
      nepali: { word: 'सेतो', roman: 'Seto', sentence: 'हिउँ सेतो हुन्छ।' },
      japanese: { word: '白', kana: 'しろ', romaji: 'Shiro', sentence: '雪は白いです。' },
    },
    interactive_quiz: { question_nepali: 'सेतोलाई जापानीमा के भनिन्छ?', options: ['しろ (Shiro)', 'くろ (Kuro)', 'あお (Ao)'], correct_answer: 'しろ (Shiro)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_016', category: 'Numbers', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '1️⃣',
      english: { word: 'One', phonics: 'W-U-N', sentence: 'I have one book.' },
      nepali: { word: 'एक', roman: 'Ek', sentence: 'मसँग एउटा किताब छ।' },
      japanese: { word: '一', kana: 'いち', romaji: 'Ichi', sentence: '本が一冊あります。' },
    },
    interactive_quiz: { question_nepali: 'एकलाई जापानीमा के भनिन्छ?', options: ['いち (Ichi)', 'に (Ni)', 'さん (San)'], correct_answer: 'いち (Ichi)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_017', category: 'Numbers', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '2️⃣',
      english: { word: 'Two', phonics: 'T-OO', sentence: 'I have two hands.' },
      nepali: { word: 'दुई', roman: 'Dui', sentence: 'मेरो दुईवटा हात छन्।' },
      japanese: { word: '二', kana: 'に', romaji: 'Ni', sentence: '手が二つあります。' },
    },
    interactive_quiz: { question_nepali: 'दुईलाई जापानीमा के भनिन्छ?', options: ['に (Ni)', 'いち (Ichi)', 'さん (San)'], correct_answer: 'に (Ni)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_018', category: 'Numbers', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '3️⃣',
      english: { word: 'Three', phonics: 'TH-R-EE', sentence: 'There are three birds.' },
      nepali: { word: 'तीन', roman: 'Teen', sentence: 'तीनवटा चरा छन्।' },
      japanese: { word: '三', kana: 'さん', romaji: 'San', sentence: '鳥が三羽います。' },
    },
    interactive_quiz: { question_nepali: 'तीनलाई जापानीमा के भनिन्छ?', options: ['さん (San)', 'し (Shi)', 'ご (Go)'], correct_answer: 'さん (San)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_019', category: 'Numbers', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '4️⃣',
      english: { word: 'Four', phonics: 'F-O-R', sentence: 'A table has four legs.' },
      nepali: { word: 'चार', roman: 'Char', sentence: 'टेबलका चारवटा खुट्टा हुन्छन्।' },
      japanese: { word: '四', kana: 'よん', romaji: 'Yon', sentence: 'テーブルには足が四つ。' },
    },
    interactive_quiz: { question_nepali: 'चारलाई जापानीमा के भनिन्छ?', options: ['よん (Yon)', 'さん (San)', 'ご (Go)'], correct_answer: 'よん (Yon)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_020', category: 'Numbers', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '5️⃣',
      english: { word: 'Five', phonics: 'F-I-VE', sentence: 'I have five fingers.' },
      nepali: { word: 'पाँच', roman: 'Panch', sentence: 'मेरा पाँचवटा औंला छन्।' },
      japanese: { word: '五', kana: 'ご', romaji: 'Go', sentence: '指が五本あります。' },
    },
    interactive_quiz: { question_nepali: 'पाँचलाई जापानीमा के भनिन्छ?', options: ['ご (Go)', 'ろく (Roku)', 'よん (Yon)'], correct_answer: 'ご (Go)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_021', category: 'Body', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '👀',
      english: { word: 'Eyes', phonics: 'EY-ES', sentence: 'I see with my eyes.' },
      nepali: { word: 'आँखा', roman: 'Aankha', sentence: 'म आँखाले हेर्छु।' },
      japanese: { word: '目', kana: 'め', romaji: 'Me', sentence: '目で見ます。' },
    },
    interactive_quiz: { question_nepali: 'आँखालाई जापानीमा के भनिन्छ?', options: ['め (Me)', 'はな (Hana)', 'みみ (Mimi)'], correct_answer: 'め (Me)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_022', category: 'Body', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '👂',
      english: { word: 'Ear', phonics: 'E-AR', sentence: 'I hear with my ears.' },
      nepali: { word: 'कान', roman: 'Kaan', sentence: 'म कानले सुन्छु।' },
      japanese: { word: '耳', kana: 'みみ', romaji: 'Mimi', sentence: '耳で聞きます。' },
    },
    interactive_quiz: { question_nepali: 'कानलाई जापानीमा के भनिन्छ?', options: ['みみ (Mimi)', 'め (Me)', 'くち (Kuchi)'], correct_answer: 'みみ (Mimi)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_023', category: 'Body', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '👄',
      english: { word: 'Mouth', phonics: 'M-O-U-TH', sentence: 'I eat with my mouth.' },
      nepali: { word: 'मुख', roman: 'Mukh', sentence: 'म मुखले खान्छु।' },
      japanese: { word: '口', kana: 'くち', romaji: 'Kuchi', sentence: '口で食べます。' },
    },
    interactive_quiz: { question_nepali: 'मुखलाई जापानीमा के भनिन्छ?', options: ['くち (Kuchi)', 'て (Te)', 'あし (Ashi)'], correct_answer: 'くち (Kuchi)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_024', category: 'Body', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '✋',
      english: { word: 'Hand', phonics: 'H-A-N-D', sentence: 'I write with my hand.' },
      nepali: { word: 'हात', roman: 'Haat', sentence: 'म हातले लेख्छु।' },
      japanese: { word: '手', kana: 'て', romaji: 'Te', sentence: '手で書きます。' },
    },
    interactive_quiz: { question_nepali: 'हातलाई जापानीमा के भनिन्छ?', options: ['て (Te)', 'あし (Ashi)', 'あたま (Atama)'], correct_answer: 'て (Te)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_025', category: 'Body', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '👃',
      english: { word: 'Nose', phonics: 'N-O-SE', sentence: 'I smell with my nose.' },
      nepali: { word: 'नाक', roman: 'Naak', sentence: 'म नाकले सुँघ्छु।' },
      japanese: { word: '鼻', kana: 'はな', romaji: 'Hana', sentence: '鼻でにおいます。' },
    },
    interactive_quiz: { question_nepali: 'नाकलाई जापानीमा के भनिन्छ?', options: ['はな (Hana)', 'め (Me)', 'くち (Kuchi)'], correct_answer: 'はな (Hana)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_026', category: 'Food', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍚',
      english: { word: 'Rice', phonics: 'R-I-CE', sentence: 'Rice is our main food.' },
      nepali: { word: 'भात', roman: 'Bhaat', sentence: 'भात हाम्रो मुख्य खाना हो।' },
      japanese: { word: 'ご飯', kana: 'ごはん', romaji: 'Gohan', sentence: 'ご飯は主食です。' },
    },
    interactive_quiz: { question_nepali: 'भातलाई जापानीमा के भनिन्छ?', options: ['ごはん (Gohan)', 'パン (Pan)', 'みず (Mizu)'], correct_answer: 'ごはん (Gohan)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_027', category: 'Food', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🍞',
      english: { word: 'Bread', phonics: 'B-R-E-A-D', sentence: 'I eat bread for breakfast.' },
      nepali: { word: 'रोटी', roman: 'Roti', sentence: 'म बिहानको खानामा रोटी खान्छु।' },
      japanese: { word: 'パン', kana: 'パン', romaji: 'Pan', sentence: '朝ごはんにパンを食べます。' },
    },
    interactive_quiz: { question_nepali: 'रोटीलाई जापानीमा के भनिन्छ?', options: ['パン (Pan)', 'ごはん (Gohan)', 'たまご (Tamago)'], correct_answer: 'パン (Pan)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_028', category: 'Food', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '💧',
      english: { word: 'Water', phonics: 'W-A-T-ER', sentence: 'We need water to live.' },
      nepali: { word: 'पानी', roman: 'Paani', sentence: 'हामीलाई बाँच्न पानी चाहिन्छ।' },
      japanese: { word: '水', kana: 'みず', romaji: 'Mizu', sentence: '水は大切です。' },
    },
    interactive_quiz: { question_nepali: 'पानीलाई जापानीमा के भनिन्छ?', options: ['みず (Mizu)', 'ぎゅうにゅう (Gyuunyuu)', 'ごはん (Gohan)'], correct_answer: 'みず (Mizu)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_029', category: 'Food', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🥚',
      english: { word: 'Egg', phonics: 'E-G-G', sentence: 'Eggs are healthy.' },
      nepali: { word: 'अण्डा', roman: 'Anda', sentence: 'अण्डा स्वास्थ्यकर हुन्छ।' },
      japanese: { word: '卵', kana: 'たまご', romaji: 'Tamago', sentence: '卵は体にいいです。' },
    },
    interactive_quiz: { question_nepali: 'अण्डालाई जापानीमा के भनिन्छ?', options: ['たまご (Tamago)', 'パン (Pan)', 'にく (Niku)'], correct_answer: 'たまご (Tamago)', star_points: 10 },
  },
  {
    meta_data: { id: 'vocab_030', category: 'Food', difficulty_level: 'Beginner', age_group: '4-8' },
    trilingual_content: {
      emoji: '🥛',
      english: { word: 'Milk', phonics: 'M-I-L-K', sentence: 'Milk makes bones strong.' },
      nepali: { word: 'दूध', roman: 'Dudh', sentence: 'दूधले हड्डी बलियो बनाउँछ।' },
      japanese: { word: '牛乳', kana: 'ぎゅうにゅう', romaji: 'Gyuunyuu', sentence: '牛乳は骨を強くします。' },
    },
    interactive_quiz: { question_nepali: 'दूधलाई जापानीमा के भनिन्छ?', options: ['ぎゅうにゅう (Gyuunyuu)', 'みず (Mizu)', 'ごはん (Gohan)'], correct_answer: 'ぎゅうにゅう (Gyuunyuu)', star_points: 10 },
  },
];

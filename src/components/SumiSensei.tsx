import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WifiOff } from 'lucide-react';

// ============================================================
// KIDS RESPONSE DATABASE — English + Japanese fun replies
// ============================================================
const KID_RESPONSES: { keywords: string[]; response: string; emoji: string; color: string }[] = [
  { keywords: ['hello', 'hi', 'hey', 'helo'], response: 'こんにちは！ Hello! I\'m Sumi! 🦝 What do you want to learn today?', emoji: '👋', color: '#6C5CE7' },
  { keywords: ['apple', 'appl'], response: '🍎 Apple! りんご (Ringo) in Japanese! Apple is RED and yummy! A for Apple! 🍎', emoji: '🍎', color: '#E74C3C' },
  { keywords: ['dog', 'puppy', 'doggy', 'woof'], response: '🐶 Dog! いぬ (Inu) in Japanese! Dogs say Woof woof! 🐾 Do you have a dog?', emoji: '🐶', color: '#E67E22' },
  { keywords: ['cat', 'kitty', 'kitten', 'meow'], response: '🐱 Cat! ねこ (Neko) in Japanese! Cats say Nyaa nyaa! 🐾', emoji: '🐱', color: '#9B59B6' },
  { keywords: ['elephant'], response: '🐘 Elephant! ぞう (Zou) in Japanese! Elephants are VERY big! Bigger than a house! 🏠', emoji: '🐘', color: '#7F8C8D' },
  { keywords: ['lion', 'roar'], response: '🦁 Lion! ライオン (Raion) in Japanese! Lions say ROARRR! Are you brave like a lion? 💪', emoji: '🦁', color: '#F39C12' },
  { keywords: ['fish', 'fishy'], response: '🐟 Fish! さかな (Sakana) in Japanese! Fish swim in the ocean! 🌊 Glub glub!', emoji: '🐟', color: '#3498DB' },
  { keywords: ['bird', 'birdy', 'tweet'], response: '🐦 Bird! とり (Tori) in Japanese! Birds say Tweet tweet! Can you fly? 🌤️', emoji: '🐦', color: '#1ABC9C' },
  { keywords: ['rabbit', 'bunny'], response: '🐰 Rabbit! うさぎ (Usagi) in Japanese! Rabbits jump hop hop! 🌸', emoji: '🐰', color: '#E91E63' },
  { keywords: ['bear', 'teddy'], response: '🐻 Bear! くま (Kuma) in Japanese! Bears love honey! 🍯 Do you love honey too?', emoji: '🐻', color: '#795548' },
  { keywords: ['red', 'aka'], response: '🔴 Red! あか (Aka) in Japanese! Red like an apple! Can you find something red? 🍎', emoji: '🔴', color: '#E74C3C' },
  { keywords: ['blue', 'ao'], response: '🔵 Blue! あお (Ao) in Japanese! Blue like the sky! ☁️ And the ocean! 🌊', emoji: '🔵', color: '#3498DB' },
  { keywords: ['yellow', 'ki'], response: '🟡 Yellow! き (Ki) in Japanese! Yellow like the sun ☀️ and bananas! 🍌', emoji: '🟡', color: '#F1C40F' },
  { keywords: ['green', 'midori'], response: '🟢 Green! みどり (Midori) in Japanese! Green like grass and trees! 🌿🌳', emoji: '🟢', color: '#2ECC71' },
  { keywords: ['pink', 'momo'], response: '🌸 Pink! ピンク (Pinku) in Japanese! Pink like flowers! 🌺 So pretty!', emoji: '🌸', color: '#E91E63' },
  { keywords: ['one', '1', 'ichi'], response: '1️⃣ One! いち (Ichi) in Japanese! Hold up 1 finger! ☝️ One sun, one moon! 🌙', emoji: '1️⃣', color: '#FF5722' },
  { keywords: ['two', '2', 'ni'], response: '2️⃣ Two! に (Ni) in Japanese! You have 2 eyes! 👀 And 2 ears! 👂👂', emoji: '2️⃣', color: '#9C27B0' },
  { keywords: ['three', '3', 'san'], response: '3️⃣ Three! さん (San) in Japanese! 3 little stars! ⭐⭐⭐ Count with me!', emoji: '3️⃣', color: '#2196F3' },
  { keywords: ['four', '4', 'shi', 'yon'], response: '4️⃣ Four! よん (Yon) in Japanese! 4 legs on a dog! 🐶 Count them!', emoji: '4️⃣', color: '#4CAF50' },
  { keywords: ['five', '5', 'go'], response: '5️⃣ Five! ご (Go) in Japanese! 5 fingers on one hand! ✋ High five!', emoji: '5️⃣', color: '#FF9800' },
  { keywords: ['six', '6', 'roku'], response: '6️⃣ Six! ろく (Roku) in Japanese! A ladybug has 6 legs! 🐞', emoji: '6️⃣', color: '#F44336' },
  { keywords: ['seven', '7', 'nana'], response: '7️⃣ Seven! なな (Nana) in Japanese! 7 colors in a rainbow! 🌈', emoji: '7️⃣', color: '#E91E63' },
  { keywords: ['eight', '8', 'hachi'], response: '8️⃣ Eight! はち (Hachi) in Japanese! An octopus has 8 arms! 🐙', emoji: '8️⃣', color: '#9C27B0' },
  { keywords: ['nine', '9', 'ku'], response: '9️⃣ Nine! きゅう (Kyuu) in Japanese! Almost 10! Can you count to 9? 🌟', emoji: '9️⃣', color: '#3F51B5' },
  { keywords: ['ten', '10', 'juu'], response: '🔟 Ten! じゅう (Juu) in Japanese! 10 fingers! Count them ALL! 🙌 Yay!', emoji: '🔟', color: '#009688' },
  { keywords: ['sun', 'sunny'], response: '☀️ Sun! たいよう (Taiyou) in Japanese! The sun is bright and warm! It wakes up every morning! 🌅', emoji: '☀️', color: '#F1C40F' },
  { keywords: ['moon', 'luna'], response: '🌙 Moon! つき (Tsuki) in Japanese! The moon comes out at night! 🌟 Sweet dreams!', emoji: '🌙', color: '#9C27B0' },
  { keywords: ['star', 'stars'], response: '⭐ Star! ほし (Hoshi) in Japanese! You are a SUPERSTAR! ⭐🌟✨ Shine bright!', emoji: '⭐', color: '#FF9800' },
  { keywords: ['rain', 'raining'], response: '🌧️ Rain! あめ (Ame) in Japanese! Rain waters the flowers! 🌸 Splash splash!', emoji: '🌧️', color: '#2196F3' },
  { keywords: ['snow', 'snowing'], response: '❄️ Snow! ゆき (Yuki) in Japanese! Snow is cold and white! ⛄ Do you like snowmen?', emoji: '❄️', color: '#5C6BC0' },
  { keywords: ['flower', 'flowers'], response: '🌸 Flower! はな (Hana) in Japanese! Flowers are so beautiful! 🌺🌻🌷 What color is your flower?', emoji: '🌸', color: '#E91E63' },
  { keywords: ['tree', 'trees'], response: '🌳 Tree! き (Ki) in Japanese! Trees give us air to breathe! 🌿 Hug a tree!', emoji: '🌳', color: '#4CAF50' },
  { keywords: ['water', 'drink'], response: '💧 Water! みず (Mizu) in Japanese! Water is healthy and yummy! 🥛 Stay hydrated!', emoji: '💧', color: '#2196F3' },
  { keywords: ['fire', 'hot'], response: '🔥 Fire! ひ (Hi) in Japanese! Fire is HOT! 🔥 Don\'t touch! Be careful!', emoji: '🔥', color: '#FF5722' },
  { keywords: ['ball', 'balls'], response: '⚽ Ball! ボール (Booru) in Japanese! Kick the ball! ⚽🏀🎾 What\'s your favorite?', emoji: '⚽', color: '#4CAF50' },
  { keywords: ['book', 'read', 'reading'], response: '📚 Book! ほん (Hon) in Japanese! Books are magical! 📖 Reading is so fun! 🌟', emoji: '📚', color: '#9C27B0' },
  { keywords: ['mama', 'mom', 'mother', 'mommy'], response: '👩 Mama! おかあさん (Okaasan) in Japanese! Mama loves you SO much! ❤️', emoji: '👩', color: '#E91E63' },
  { keywords: ['papa', 'dad', 'father', 'daddy'], response: '👨 Papa! おとうさん (Otousan) in Japanese! Papa loves you SO much! 💙', emoji: '👨', color: '#2196F3' },
  { keywords: ['baby', 'babi'], response: '👶 Baby! あかちゃん (Akachan) in Japanese! Babies are so cute! 🍼 Were you a baby once?', emoji: '👶', color: '#FF9800' },
  { keywords: ['happy', 'joy', 'yay'], response: '😊 Happy! うれしい (Ureshii) in Japanese! You make Sumi SO happy! 🥰 Keep smiling!', emoji: '😊', color: '#F1C40F' },
  { keywords: ['sing', 'song', 'music'], response: '🎵 La la la! 音楽 (Ongaku) means music! Do Re Mi Fa Sol La Si Do! Can you sing? 🎤', emoji: '🎵', color: '#9C27B0' },
  { keywords: ['dance', 'dancing'], response: '💃 Dance! ダンス (Dansu) in Japanese! Let\'s dance! Wiggle wiggle! 🕺🌟', emoji: '💃', color: '#E91E63' },
  { keywords: ['eat', 'food', 'hungry'], response: '🍽️ Food! たべもの (Tabemono) in Japanese! Are you hungry? 🍎🍌🥕 Eat yummy food!', emoji: '🍽️', color: '#FF9800' },
  { keywords: ['sleep', 'tired', 'bed'], response: '😴 Sleep! ねる (Neru) in Japanese! Time to rest! 🌙 Sweet dreams little one! ⭐', emoji: '😴', color: '#9C27B0' },
  { keywords: ['play', 'playing'], response: '🎮 Play! あそぶ (Asobu) in Japanese! Playing is the BEST! 🎈🎉 Let\'s play together!', emoji: '🎮', color: '#2196F3' },
  { keywords: ['good', 'great', 'nice'], response: '🌟 Very good! とても上手！(Totemo jouzu!) You\'re amazing! Keep going! 🎉', emoji: '🌟', color: '#F1C40F' },
  { keywords: ['love', 'heart', 'like'], response: '❤️ Love! あいしてる (Aishiteru) in Japanese! I love learning with you! 💕💖', emoji: '❤️', color: '#E91E63' },
  { keywords: ['thank', 'thanks'], response: '🙏 Thank you! ありがとう (Arigatou) in Japanese! You\'re so polite! 🌸', emoji: '🙏', color: '#4CAF50' },
  { keywords: ['yes', 'yeah', 'yep'], response: '✅ Yes! はい (Hai) in Japanese! Great! はい means yes! 🌟', emoji: '✅', color: '#4CAF50' },
  { keywords: ['no', 'nope'], response: '❌ No! いいえ (Iie) in Japanese! It\'s okay to say no! 🤗', emoji: '❌', color: '#E74C3C' },
  { keywords: ['big', 'large', 'huge'], response: '🐘 Big! おおきい (Ookii) in Japanese! Elephants are ookii! Can you make yourself BIG? 🙆', emoji: '🐘', color: '#607D8B' },
  { keywords: ['small', 'little', 'tiny'], response: '🐜 Small! ちいさい (Chiisai) in Japanese! An ant is chiisai! Can you make yourself tiny? 🐭', emoji: '🐜', color: '#8BC34A' },
  { keywords: ['fast', 'quick', 'run'], response: '🏃 Fast! はやい (Hayai) in Japanese! Cheetahs are hayai! Can you run fast? 🐆⚡', emoji: '🏃', color: '#FF9800' },
  { keywords: ['slow', 'slowly'], response: '🐌 Slow! おそい (Osoi) in Japanese! A snail is osoi! Slowly slowly! 🐢', emoji: '🐌', color: '#795548' },
  { keywords: ['morning', 'good morning'], response: '🌅 Good morning! おはよう (Ohayou) in Japanese! What a beautiful morning! ☀️', emoji: '🌅', color: '#FF9800' },
  { keywords: ['good night', 'night', 'goodnight'], response: '🌙 Good night! おやすみ (Oyasumi) in Japanese! Sweet dreams! ⭐💤', emoji: '🌙', color: '#9C27B0' },
  { keywords: ['abc', 'alphabet', 'letter'], response: '🔤 Alphabet! A B C D... Can you sing the ABC song? 🎵 A is for Apple! 🍎', emoji: '🔤', color: '#3F51B5' },
  { keywords: ['banana'], response: '🍌 Banana! バナナ (Banana) in Japanese too! Bananas are yellow and sweet! 🌟', emoji: '🍌', color: '#F1C40F' },
  { keywords: ['orange'], response: '🍊 Orange! オレンジ (Orenji) in Japanese! Orange is yummy and juicy! 💦', emoji: '🍊', color: '#FF9800' },
  { keywords: ['house', 'home'], response: '🏠 House! いえ (Ie) in Japanese! Home is where the heart is! ❤️', emoji: '🏠', color: '#795548' },
  { keywords: ['airplane', 'plane', 'fly'], response: '✈️ Airplane! ひこうき (Hikouki) in Japanese! Zoom zoom in the sky! ☁️', emoji: '✈️', color: '#2196F3' },
  { keywords: ['car', 'truck', 'vroom'], response: '🚗 Car! くるま (Kuruma) in Japanese! Vroom vroom! 🏁 Let\'s go fast!', emoji: '🚗', color: '#E74C3C' },
];

const getResponse = (text: string): { response: string; emoji: string; color: string } => {
  if (!text.trim()) {
    return { response: '🎙️ I heard something! Speak louder! Try saying "Hello" or "Dog" or "Apple"! 🌟', emoji: '🎙️', color: '#9C27B0' };
  }
  const lower = text.toLowerCase();
  for (const r of KID_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) {
      return { response: r.response, emoji: r.emoji, color: r.color };
    }
  }
  const defaults = [
    { response: `I heard "${text}"! とても上手！(Totemo jouzu!) Very good speaking! 🌟 Try saying "apple" or "dog"!`, emoji: '🌟', color: '#F1C40F' },
    { response: `Wow "${text}"! すごい！(Sugoi!) Amazing! Can you say こんにちは (Konnichiwa)? That means Hello! 🌸`, emoji: '✨', color: '#E91E63' },
    { response: `"${text}"! がんばれ！(Ganbare!) Keep going! Try saying the name of an animal! 🐶🐱🐘`, emoji: '🎉', color: '#2196F3' },
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const SumiSensei: React.FC = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<{ response: string; emoji: string; color: string } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hints = ['Hello 👋', 'Dog 🐶', 'Apple 🍎', 'One 1️⃣', 'Red 🔴', 'Star ⭐', 'Rain 🌧️', 'Happy 😊', 'Cat 🐱', 'Banana 🍌'];

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setIsSupported(false);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const speakResponse = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[^\w\s!?.,']/g, ' ');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 0.88; utter.pitch = 1.3; utter.volume = 0.9;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.onstart = () => { setListening(true); setTranscript(''); setResponse(null); };
      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '', final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += t;
          else interim += t;
        }
        setTranscript(final || interim);
        if (final) {
          const res = getResponse(final);
          setResponse(res);
          speakResponse(res.response);
        }
      };
      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error === 'not-allowed') setPermissionDenied(true);
        setListening(false);
      };
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
      rec.start();
    } catch (e) { setListening(false); }
  }, [speakResponse]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  return (
    <div className="h-full flex flex-col items-center overflow-y-auto px-4 pt-4 pb-4"
      style={{ background: 'linear-gradient(135deg, #f3e7ff 0%, #e0f4ff 50%, #fff0f9 100%)' }}
    >
      {/* Raccoon + Title */}
      <div className="flex flex-col items-center mb-5 mt-2">
        <div className="relative">
          <div className={`text-7xl transition-all ${speaking ? 'animate-bounce' : ''}`} style={{ animationDuration: '0.6s' }}>
            🦝
          </div>
          {speaking && (
            <span className="absolute -right-2 -top-1 text-xl animate-ping">🔊</span>
          )}
        </div>
        <h2 className="text-2xl font-black mt-2" style={{ color: '#6C3FC6' }}>Sumi Sensei!</h2>
        <p className="text-sm text-slate-600 text-center mt-1 max-w-xs">
          🎤 Tap the mic and say something!<br/>Learn English + Japanese together! 🌸
        </p>
      </div>

      {/* Offline */}
      {!online && (
        <div className="rounded-3xl bg-white/90 p-5 max-w-sm w-full shadow-lg text-center mb-4">
          <div className="text-4xl mb-2">💤</div>
          <p className="font-bold text-lg">Sumi is napping... Zzz</p>
          <p className="text-sm text-slate-600 mt-1">No internet. Come back soon! 🌸</p>
          <div className="mt-2 inline-flex items-center gap-2 text-rose-500 font-semibold">
            <WifiOff size={16}/> Offline
          </div>
        </div>
      )}

      {/* Not Supported */}
      {!isSupported && online && (
        <div className="rounded-3xl bg-orange-50 border-2 border-orange-200 p-5 max-w-sm w-full text-center mb-4">
          <div className="text-3xl mb-2">🌐</div>
          <p className="font-bold text-orange-700">Use Chrome or Safari browser</p>
          <p className="text-sm text-orange-600 mt-1">Voice chat needs a supported browser!</p>
        </div>
      )}

      {/* Permission Denied */}
      {permissionDenied && (
        <div className="rounded-3xl bg-red-50 border-2 border-red-200 p-5 max-w-sm w-full text-center mb-4">
          <div className="text-3xl mb-2">🎤</div>
          <p className="font-bold text-red-700">Mic permission needed!</p>
          <p className="text-sm text-red-600 mt-1">Allow microphone in your browser settings, then refresh.</p>
        </div>
      )}

      {online && isSupported && !permissionDenied && (
        <>
          {/* BIG MIC BUTTON */}
          <button
            onPointerDown={(e) => { e.preventDefault(); if (!listening) startListening(); }}
            onPointerUp={() => { /* keep listening until result */ }}
            onClick={() => { if (listening) stopListening(); }}
            className="rounded-full flex items-center justify-center shadow-2xl transition-all select-none mb-4"
            style={{
              width: 160,
              height: 160,
              background: listening
                ? 'radial-gradient(circle, #ff4757, #c0392b)'
                : 'radial-gradient(circle, #a855f7, #6C3FC6)',
              boxShadow: listening
                ? '0 0 0 16px rgba(255,71,87,0.15), 0 0 0 32px rgba(255,71,87,0.08), 0 8px 32px rgba(255,71,87,0.4)'
                : '0 0 0 8px rgba(168,85,247,0.15), 0 8px 32px rgba(108,63,198,0.4)',
              transform: listening ? 'scale(0.95)' : 'scale(1)',
            }}
          >
            <div className="text-white text-center pointer-events-none">
              <div className="text-6xl">{listening ? '🔴' : '🎤'}</div>
              <div className="font-black text-sm mt-1">{listening ? 'Tap to Stop' : 'Tap to Talk!'}</div>
            </div>
          </button>

          {/* Sound wave animation */}
          {listening && (
            <div className="flex gap-1.5 mb-4 items-end justify-center h-8">
              {[0,1,2,3,4,3,2,1].map((h, i) => (
                <div key={i} className="w-1.5 rounded-full bg-purple-500"
                  style={{
                    height: `${10 + h * 5}px`,
                    animation: `bounce ${0.4 + i*0.05}s infinite alternate ease-in-out`,
                    animationDelay: `${i*0.08}s`,
                    opacity: 0.7 + h*0.1,
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="rounded-2xl bg-white/90 shadow-md px-4 py-3 max-w-sm w-full mb-3 border-2 border-purple-100">
              <p className="text-xs font-bold text-purple-400 mb-0.5">🎙️ You said:</p>
              <p className="font-bold text-gray-700 text-lg">"{transcript}"</p>
            </div>
          )}

          {/* Sumi's Response */}
          {response && (
            <div className="rounded-3xl shadow-xl px-4 py-4 max-w-sm w-full mb-4 border-2"
              style={{ backgroundColor: response.color + '18', borderColor: response.color + '40' }}
            >
              <div className="flex items-start gap-3">
                <div className="text-5xl">{response.emoji}</div>
                <div className="flex-1">
                  <p className="font-black text-xs mb-1" style={{ color: response.color }}>🦝 Sumi says:</p>
                  <p className="font-bold text-gray-800 text-sm leading-relaxed">{response.response}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => speakResponse(response.response)}
                  className="flex-1 py-2 rounded-2xl font-bold text-white text-sm active:scale-95 transition-all"
                  style={{ background: response.color }}
                >
                  🔊 Say Again
                </button>
                <button
                  onClick={() => { setResponse(null); setTranscript(''); }}
                  className="flex-1 py-2 rounded-2xl font-bold text-sm active:scale-95 transition-all bg-gray-100 text-gray-600"
                >
                  🎤 Ask Again!
                </button>
              </div>
            </div>
          )}

          {/* Hint words */}
          {!response && !listening && (
            <div className="text-center max-w-xs mt-1">
              <p className="text-xs font-bold text-gray-400 mb-2">Try saying...</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {hints.map((h) => (
                  <span key={h} className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#f3e7ff', color: '#6C3FC6' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

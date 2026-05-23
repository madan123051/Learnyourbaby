# 🌸 Sumi Sensei - Trilingual Learning App

An interactive app to learn **English**, **नेपाली (Nepali)**, and **日本語 (Japanese)** for kids!

## 🚀 Live Demo
https://learnyourbaby.vercel.app

## ✨ Features
- 📚 **Flashcard Learning** — 6 categories, 30+ words, flip animations
- 🤖 **Sumi AI Chatbot** — Type a word, get trilingual response
- 🎮 **Games** — MCQ Quiz & Matching Game
- 🏆 **Progress Tracker** — Stars, ranks, achievements

## 🛠 Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + DaisyUI
- Lucide React (icons)
- localStorage (persistence)

## 📦 Setup
```bash
npm install
npm run dev
```

## 🏗 Build
```bash
npm run build
```

## 🌐 Deploy to Vercel
1. Go to https://vercel.com/new
2. Import `madan123051/Learnyourbaby`
3. Click Deploy ✅

## 🎧 Flutter iPad Audio Overlaying (BGM + SFX + TTS)

नीचे एक practical architecture है जिससे iPad पर **background music** और **button sound effects** एक साथ बिना रुके चलेंगे, साथ ही offline TTS भी काम करेगा।

### 1) pubspec.yaml dependencies
```yaml
dependencies:
  flutter:
    sdk: flutter
  audioplayers: ^6.0.0
  flutter_tts: ^4.0.2
```

### 2) Audio Manager (single place control)
```dart
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_tts/flutter_tts.dart';

class AudioManager {
  final AudioPlayer _bgmPlayer = AudioPlayer(playerId: 'bgm_player');
  final AudioPlayer _sfxPlayer = AudioPlayer(playerId: 'sfx_player');
  final FlutterTts _tts = FlutterTts();

  Future<void> init() async {
    // BGM settings
    await _bgmPlayer.setReleaseMode(ReleaseMode.loop);
    await _bgmPlayer.setVolume(0.18); // 15-20%

    // SFX settings (independent from BGM)
    await _sfxPlayer.setReleaseMode(ReleaseMode.stop);
    await _sfxPlayer.setVolume(1.0);

    // Offline TTS defaults (iPad native AVSpeechSynthesizer backend)
    await _tts.setLanguage('en-US');
    await _tts.setPitch(1.05);
    await _tts.setSpeechRate(0.42);
    await _tts.awaitSpeakCompletion(true);
  }

  Future<void> playBgm() async {
    await _bgmPlayer.play(AssetSource('audio/bgm_classroom.mp3'));
  }

  Future<void> stopBgm() async => _bgmPlayer.stop();

  // Overlay SFX on top of BGM
  Future<void> playTapSfx() async {
    await _sfxPlayer.play(AssetSource('audio/sfx_pop.mp3'));
  }

  Future<void> playCorrectSfx() async {
    await _sfxPlayer.play(AssetSource('audio/sfx_magic_chime.mp3'));
  }

  Future<void> playWrongSfx() async {
    await _sfxPlayer.play(AssetSource('audio/sfx_boing.mp3'));
  }

  Future<void> speakEnglish(String text) async {
    await _tts.setLanguage('en-US');
    await _tts.speak(text);
  }

  Future<void> speakJapanese(String text) async {
    await _tts.setLanguage('ja-JP');
    await _tts.speak(text);
  }

  Future<void> dispose() async {
    await _bgmPlayer.dispose();
    await _sfxPlayer.dispose();
    await _tts.stop();
  }
}
```

### 3) Usage example (Landscape learning screen)
```dart
final audio = AudioManager();

@override
void initState() {
  super.initState();
  audio.init().then((_) => audio.playBgm());
}

Future<void> onCardTap(String wordEn, String wordJa) async {
  await audio.playTapSfx();
  await audio.speakEnglish('Great! This is $wordEn');
  await audio.speakJapanese('$wordJa');
}

Future<void> onAnswer(bool isCorrect) async {
  if (isCorrect) {
    await audio.playCorrectSfx();
  } else {
    await audio.playWrongSfx();
  }
}

@override
void dispose() {
  audio.dispose();
  super.dispose();
}
```

### 4) iPad notes
- App orientation lock करें: **landscape only**.
- BGM volume 0.15-0.20 रखें ताकि Sumi Sensei voice clear रहे.
- SFX files को short रखें (150-500ms) ताकि game feel responsive रहे.
- Offline-first रखें (flutter_tts), online premium voice को optional fallback बनाएं.

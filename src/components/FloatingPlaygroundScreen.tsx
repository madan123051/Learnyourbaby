import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FloatingBubble {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
  color: string;
  glowColor: string;
  category: string;
  popping: boolean;
  popScale: number;
  wobble: number;
  wobbleSpeed: number;
  trail: { x: number; y: number }[];
  pulsePhase: number;
  magnetized: boolean;
  frozen: boolean;
  rainbow: boolean;
  sparkleTimer: number;
  bounceCount: number;
  age: number;
  specialEffect: SpecialEffect | null;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  emoji: string;
  size: number;
  rotation: number;
  color: string;
  type: 'pop' | 'sparkle' | 'trail' | 'confetti' | 'star' | 'heart' | 'firework';
}

interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  active: boolean;
  duration: number;
  timer: number;
}

type SpecialEffect = 'rainbow' | 'golden' | 'mega' | 'multiplier' | 'magnet' | 'freeze' | 'firework' | 'disco';
type PowerUpType = 'doublePoints' | 'slowMotion' | 'magnetPull' | 'freezeAll' | 'rainbowMode' | 'megaBubble' | 'scoreMultiplier' | 'timeSlow' | 'shieldBubble' | 'explosionChain';
type GameMode = 'freePlay' | 'challenge' | 'zen' | 'rainbow' | 'speedRun' | 'memory' | 'pattern' | 'musical';
type ThemeType = 'sky' | 'ocean' | 'forest' | 'space' | 'candy' | 'sunset' | 'arctic' | 'volcano';
type DifficultyLevel = 'toddler' | 'easy' | 'medium' | 'hard' | 'expert';

interface GameState {
  score: number;
  combo: number;
  maxCombo: number;
  totalPops: number;
  level: number;
  experience: number;
  experienceToNext: number;
  streak: number;
  bestStreak: number;
  multiplier: number;
  gameMode: GameMode;
  theme: ThemeType;
  difficulty: DifficultyLevel;
  isPaused: boolean;
  showSettings: boolean;
  showStats: boolean;
  showAchievements: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  comboTimer: number;
  comboDecay: number;
  lastPopTime: number;
  sessionTime: number;
  bubblesCreated: number;
  perfectPops: number;
  chainReactions: number;
  powerUpsCollected: number;
  achievements: Achievement[];
  unlockedThemes: ThemeType[];
  unlockedModes: GameMode[];
  dailyChallenge: DailyChallenge | null;
  starRating: number;
  totalStarsEarned: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress: number;
  target: number;
  reward: number;
  category: 'popping' | 'combo' | 'score' | 'special' | 'time' | 'collection';
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  emoji: string;
}

interface TouchRipple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  opacity: number;
  dy: number;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const EMOJI_CATEGORIES: Record<string, string[]> = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🐠', '🐟', '🐡', '🐬', '🐳', '🐋', '🦈', '🐊'],
  fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🫒', '🥑', '🍆', '🥕', '🌽', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '💐', '🌿', '☘️', '🍀', '🍃', '🍂', '🍁', '🌾', '🌵', '🎋', '🎍', '🌲', '🌳', '🌴', '🪴', '🪻', '🪷', '🌊', '🏔️', '⛰️', '🗻', '🌋', '🏝️', '🏜️'],
  space: ['⭐', '🌟', '✨', '💫', '🌙', '🌝', '🌞', '☀️', '🪐', '🌍', '🌎', '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌛', '🌜', '☄️', '🌠', '🌌', '🔭', '🛸', '🚀', '👽'],
  food: ['🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷'],
  vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '✈️', '🚀', '🛸', '🚁', '⛵'],
  music: ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🎺', '🎷', '🥁', '🪘', '🎻', '🪕', '🎼', '🎙️', '📻', '🔔', '🔊', '📯', '🪈', '🎚️'],
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '🤫', '🤔', '🫣', '🤐', '😏', '🥳', '🤠'],
  weather: ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈', '🌊', '💧'],
  shapes: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💗', '💖', '💝', '💘', '💕', '💞', '💓', '💟', '⭐', '🌟', '✨', '💫', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🇯🇵', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇧🇷', '🇮🇳', '🇨🇳', '🇰🇷', '🇦🇺', '🇨🇦'],
};

const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

const BUBBLE_COLORS = [
  '#FF6B6B', '#FF8E72', '#FFA07A', '#FFB347', '#FFD700',
  '#98FB98', '#90EE90', '#4ECDC4', '#45B7D1', '#85C1E2',
  '#6C5CE7', '#A29BFE', '#BB8FCE', '#DDA0DD', '#FF69B4',
  '#F7DC6F', '#82E0AA', '#85C1E2', '#F0B27A', '#D7BDE2',
  '#FF7675', '#74B9FF', '#55EFC4', '#FFEAA7', '#DFE6E9',
  '#E17055', '#00CEC9', '#0984E3', '#6C5CE7', '#FD79A8',
];

const GLOW_COLORS = [
  'rgba(255,107,107,0.6)', 'rgba(255,142,114,0.6)', 'rgba(255,160,122,0.6)',
  'rgba(255,179,71,0.6)', 'rgba(255,215,0,0.6)', 'rgba(152,251,152,0.6)',
  'rgba(144,238,144,0.6)', 'rgba(78,205,196,0.6)', 'rgba(69,183,209,0.6)',
  'rgba(133,193,226,0.6)', 'rgba(108,92,231,0.6)', 'rgba(162,155,254,0.6)',
];

const THEMES: Record<ThemeType, { bg: string; accent: string; glow: string; name: string; emoji: string }> = {
  sky: { bg: 'from-[#87CEEB] via-[#B0E2FF] to-[#E0F7FF]', accent: '#4A90D9', glow: 'rgba(74,144,217,0.3)', name: 'Sky', emoji: '☁️' },
  ocean: { bg: 'from-[#006994] via-[#0099CC] to-[#66CCFF]', accent: '#00B4D8', glow: 'rgba(0,180,216,0.3)', name: 'Ocean', emoji: '🌊' },
  forest: { bg: 'from-[#228B22] via-[#32CD32] to-[#90EE90]', accent: '#2ECC71', glow: 'rgba(46,204,113,0.3)', name: 'Forest', emoji: '🌲' },
  space: { bg: 'from-[#0B0B3B] via-[#1B1464] to-[#2C003E]', accent: '#9B59B6', glow: 'rgba(155,89,182,0.3)', name: 'Space', emoji: '🚀' },
  candy: { bg: 'from-[#FF69B4] via-[#FFB6C1] to-[#FFF0F5]', accent: '#FF1493', glow: 'rgba(255,20,147,0.3)', name: 'Candy', emoji: '🍭' },
  sunset: { bg: 'from-[#FF6B35] via-[#F7931E] to-[#FFD700]', accent: '#FF4500', glow: 'rgba(255,69,0,0.3)', name: 'Sunset', emoji: '🌅' },
  arctic: { bg: 'from-[#E8F4FD] via-[#B8D4E3] to-[#87CEEB]', accent: '#5DADE2', glow: 'rgba(93,173,226,0.3)', name: 'Arctic', emoji: '❄️' },
  volcano: { bg: 'from-[#8B0000] via-[#FF4500] to-[#FF6347]', accent: '#DC143C', glow: 'rgba(220,20,60,0.3)', name: 'Volcano', emoji: '🌋' },
};

const DIFFICULTY_SETTINGS: Record<DifficultyLevel, { speed: number; maxBubbles: number; spawnRate: number; pointsMultiplier: number; name: string; emoji: string; ageRange: string }> = {
  toddler: { speed: 0.15, maxBubbles: 8, spawnRate: 3000, pointsMultiplier: 2, name: 'Toddler', emoji: '🍼', ageRange: '0-2' },
  easy: { speed: 0.25, maxBubbles: 12, spawnRate: 2500, pointsMultiplier: 1.5, name: 'Easy', emoji: '🌟', ageRange: '3-4' },
  medium: { speed: 0.4, maxBubbles: 18, spawnRate: 2000, pointsMultiplier: 1.2, name: 'Medium', emoji: '⭐', ageRange: '5-6' },
  hard: { speed: 0.55, maxBubbles: 25, spawnRate: 1500, pointsMultiplier: 1, name: 'Hard', emoji: '🔥', ageRange: '7-8' },
  expert: { speed: 0.7, maxBubbles: 35, spawnRate: 1000, pointsMultiplier: 0.8, name: 'Expert', emoji: '💎', ageRange: '9-10' },
};

const GAME_MODES: Record<GameMode, { name: string; emoji: string; description: string }> = {
  freePlay: { name: 'Free Play', emoji: '🎈', description: 'Pop bubbles freely!' },
  challenge: { name: 'Challenge', emoji: '🏆', description: 'Complete challenges!' },
  zen: { name: 'Zen Mode', emoji: '🧘', description: 'Relax and enjoy' },
  rainbow: { name: 'Rainbow', emoji: '🌈', description: 'Catch rainbow bubbles!' },
  speedRun: { name: 'Speed Run', emoji: '⚡', description: 'Pop as fast as you can!' },
  memory: { name: 'Memory', emoji: '🧠', description: 'Remember and match!' },
  pattern: { name: 'Pattern', emoji: '🎯', description: 'Follow the pattern!' },
  musical: { name: 'Musical', emoji: '🎵', description: 'Make music by popping!' },
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_pop', title: 'First Pop!', description: 'Pop your first bubble', emoji: '🎈', unlocked: false, progress: 0, target: 1, reward: 10, category: 'popping' },
  { id: 'pop_10', title: 'Bubble Buster', description: 'Pop 10 bubbles', emoji: '💥', unlocked: false, progress: 0, target: 10, reward: 25, category: 'popping' },
  { id: 'pop_50', title: 'Pop Master', description: 'Pop 50 bubbles', emoji: '🌟', unlocked: false, progress: 0, target: 50, reward: 50, category: 'popping' },
  { id: 'pop_100', title: 'Pop Legend', description: 'Pop 100 bubbles', emoji: '👑', unlocked: false, progress: 0, target: 100, reward: 100, category: 'popping' },
  { id: 'pop_500', title: 'Pop Champion', description: 'Pop 500 bubbles', emoji: '🏆', unlocked: false, progress: 0, target: 500, reward: 250, category: 'popping' },
  { id: 'pop_1000', title: 'Pop God', description: 'Pop 1000 bubbles', emoji: '⚡', unlocked: false, progress: 0, target: 1000, reward: 500, category: 'popping' },
  { id: 'combo_5', title: 'Combo Starter', description: 'Get a 5x combo', emoji: '🔥', unlocked: false, progress: 0, target: 5, reward: 30, category: 'combo' },
  { id: 'combo_10', title: 'Combo King', description: 'Get a 10x combo', emoji: '💎', unlocked: false, progress: 0, target: 10, reward: 75, category: 'combo' },
  { id: 'combo_20', title: 'Combo Master', description: 'Get a 20x combo', emoji: '🌈', unlocked: false, progress: 0, target: 20, reward: 150, category: 'combo' },
  { id: 'combo_50', title: 'Combo Legend', description: 'Get a 50x combo', emoji: '✨', unlocked: false, progress: 0, target: 50, reward: 300, category: 'combo' },
  { id: 'score_100', title: 'Century!', description: 'Score 100 points', emoji: '💯', unlocked: false, progress: 0, target: 100, reward: 20, category: 'score' },
  { id: 'score_500', title: 'High Scorer', description: 'Score 500 points', emoji: '🎯', unlocked: false, progress: 0, target: 500, reward: 75, category: 'score' },
  { id: 'score_1000', title: 'Score Master', description: 'Score 1000 points', emoji: '🏅', unlocked: false, progress: 0, target: 1000, reward: 150, category: 'score' },
  { id: 'score_5000', title: 'Score Legend', description: 'Score 5000 points', emoji: '🎖️', unlocked: false, progress: 0, target: 5000, reward: 500, category: 'score' },
  { id: 'score_10000', title: 'Score God', description: 'Score 10000 points', emoji: '👑', unlocked: false, progress: 0, target: 10000, reward: 1000, category: 'score' },
  { id: 'power_5', title: 'Power Collector', description: 'Collect 5 power-ups', emoji: '⚡', unlocked: false, progress: 0, target: 5, reward: 40, category: 'special' },
  { id: 'power_20', title: 'Power Master', description: 'Collect 20 power-ups', emoji: '🔮', unlocked: false, progress: 0, target: 20, reward: 100, category: 'special' },
  { id: 'chain_3', title: 'Chain Reaction!', description: 'Trigger 3 chain reactions', emoji: '💥', unlocked: false, progress: 0, target: 3, reward: 50, category: 'special' },
  { id: 'chain_10', title: 'Chain Master', description: 'Trigger 10 chain reactions', emoji: '🧨', unlocked: false, progress: 0, target: 10, reward: 150, category: 'special' },
  { id: 'time_5', title: 'Quick Player', description: 'Play for 5 minutes', emoji: '⏰', unlocked: false, progress: 0, target: 300, reward: 30, category: 'time' },
  { id: 'time_15', title: 'Dedicated Player', description: 'Play for 15 minutes', emoji: '⏳', unlocked: false, progress: 0, target: 900, reward: 100, category: 'time' },
  { id: 'time_30', title: 'Marathon Player', description: 'Play for 30 minutes', emoji: '🕐', unlocked: false, progress: 0, target: 1800, reward: 250, category: 'time' },
  { id: 'all_categories', title: 'Explorer', description: 'Pop from all emoji categories', emoji: '🗺️', unlocked: false, progress: 0, target: 12, reward: 200, category: 'collection' },
  { id: 'perfect_10', title: 'Perfect 10', description: 'Get 10 perfect pops in a row', emoji: '🎯', unlocked: false, progress: 0, target: 10, reward: 100, category: 'popping' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getRandomEmoji = (category?: string): string => {
  if (category && EMOJI_CATEGORIES[category]) {
    const cats = EMOJI_CATEGORIES[category];
    return cats[Math.floor(Math.random() * cats.length)];
  }
  return ALL_EMOJIS[Math.floor(Math.random() * ALL_EMOJIS.length)];
};

const getRandomColor = (): string => BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];

const getRandomGlow = (): string => GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];

const getRandomCategory = (): string => {
  const categories = Object.keys(EMOJI_CATEGORIES);
  return categories[Math.floor(Math.random() * categories.length)];
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const distance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const randomRange = (min: number, max: number): number => Math.random() * (max - min) + min;

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const generateUniqueId = (): number => Math.floor(Math.random() * 1000000000) + Date.now();

const formatScore = (score: number): string => {
  if (score >= 1000000) return (score / 1000000).toFixed(1) + 'M';
  if (score >= 1000) return (score / 1000).toFixed(1) + 'K';
  return score.toString();
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ============================================================================
// SOUND SYSTEM
// ============================================================================

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  init() {
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) this.audioContext = new AC();
    } catch (_) {}
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
    if (!this.enabled || !this.audioContext) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.audioContext.currentTime + duration * 0.3);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.audioContext.currentTime + duration);
      gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + duration);
    } catch (_) {}
  }

  pop() {
    this.playTone(800 + Math.random() * 400, 0.12, 'sine', 0.12);
  }

  combo(level: number) {
    const baseFreq = 400 + level * 50;
    this.playTone(baseFreq, 0.15, 'triangle', 0.1);
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.1, 'triangle', 0.08), 50);
  }

  powerUp() {
    this.playTone(300, 0.2, 'square', 0.08);
    setTimeout(() => this.playTone(400, 0.15, 'square', 0.08), 100);
    setTimeout(() => this.playTone(600, 0.2, 'square', 0.1), 200);
  }

  levelUp() {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.12), i * 100);
    });
  }

  achievement() {
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.15), i * 120);
    });
  }

  tap() {
    this.playTone(600 + Math.random() * 200, 0.06, 'sine', 0.05);
  }

  musical(index: number) {
    const notes = [261, 293, 329, 349, 392, 440, 493, 523, 587, 659, 698, 784];
    const note = notes[index % notes.length];
    this.playTone(note, 0.3, 'sine', 0.15);
  }

  chain() {
    this.playTone(200, 0.3, 'sawtooth', 0.06);
    setTimeout(() => this.playTone(300, 0.2, 'sawtooth', 0.05), 100);
  }

  freeze() {
    this.playTone(1200, 0.4, 'sine', 0.08);
  }
}

const soundManager = new SoundManager();

// ============================================================================
// VIBRATION HELPER
// ============================================================================

const vibrate = (pattern: number | number[], enabled: boolean) => {
  if (!enabled) return;
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (_) {}
};

// ============================================================================
// BUBBLE CREATION
// ============================================================================

const createBubble = (
  id: number,
  difficulty: DifficultyLevel,
  overrideX?: number,
  overrideY?: number,
  specialEffect?: SpecialEffect | null,
): FloatingBubble => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const speed = settings.speed;
  const category = getRandomCategory();
  const color = getRandomColor();

  return {
    id,
    emoji: getRandomEmoji(category),
    x: overrideX ?? randomRange(8, 88),
    y: overrideY ?? randomRange(12, 82),
    dx: (Math.random() - 0.5) * speed * 2,
    dy: (Math.random() - 0.5) * speed * 2,
    size: Math.floor(randomRange(46, 72)),
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
    scale: 1,
    opacity: 1,
    color,
    glowColor: hexToRgba(color, 0.4),
    category,
    popping: false,
    popScale: 1,
    wobble: 0,
    wobbleSpeed: randomRange(0.02, 0.06),
    trail: [],
    pulsePhase: Math.random() * Math.PI * 2,
    magnetized: false,
    frozen: false,
    rainbow: specialEffect === 'rainbow',
    sparkleTimer: 0,
    bounceCount: 0,
    age: 0,
    specialEffect: specialEffect || null,
  };
};

const createParticle = (
  x: number,
  y: number,
  type: Particle['type'] = 'pop',
  emoji?: string,
  color?: string,
): Particle => ({
  id: generateUniqueId(),
  x,
  y,
  dx: (Math.random() - 0.5) * (type === 'firework' ? 8 : type === 'confetti' ? 6 : 4),
  dy: (Math.random() - 0.5) * (type === 'firework' ? 8 : type === 'confetti' ? 6 : 4) - 2,
  life: 1,
  maxLife: 1,
  emoji: emoji || getRandomEmoji(),
  size: type === 'sparkle' ? randomRange(8, 16) : type === 'star' ? randomRange(16, 28) : randomRange(12, 24),
  rotation: Math.random() * 360,
  color: color || getRandomColor(),
  type,
});

const createPowerUp = (id: number, type: PowerUpType): PowerUp => ({
  id,
  type,
  x: randomRange(10, 85),
  y: randomRange(15, 80),
  dx: (Math.random() - 0.5) * 0.3,
  dy: (Math.random() - 0.5) * 0.3,
  size: 50,
  rotation: 0,
  active: true,
  duration: 8000,
  timer: 0,
});

const POWER_UP_EMOJIS: Record<PowerUpType, string> = {
  doublePoints: '✖️2️⃣',
  slowMotion: '🐌',
  magnetPull: '🧲',
  freezeAll: '🧊',
  rainbowMode: '🌈',
  megaBubble: '🫧',
  scoreMultiplier: '💎',
  timeSlow: '⏰',
  shieldBubble: '🛡️',
  explosionChain: '💥',
};

const POWER_UP_NAMES: Record<PowerUpType, string> = {
  doublePoints: 'Double Points',
  slowMotion: 'Slow Motion',
  magnetPull: 'Magnet',
  freezeAll: 'Freeze',
  rainbowMode: 'Rainbow',
  megaBubble: 'Mega Bubble',
  scoreMultiplier: 'Multiplier',
  timeSlow: 'Time Slow',
  shieldBubble: 'Shield',
  explosionChain: 'Explosion',
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// ---------- Animated Background ----------

const AnimatedBackground: React.FC<{ theme: ThemeType; gameMode: GameMode }> = React.memo(({ theme }) => {
  const themeData = THEMES[theme];
  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${themeData.bg} transition-all duration-1000`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: randomRange(2, 8),
              height: randomRange(2, 8),
              backgroundColor: themeData.accent,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${randomRange(2, 5)}s`,
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`bg-cloud-${i}`}
            className="absolute text-3xl md:text-4xl opacity-10 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${randomRange(3, 7)}s`,
            }}
          >
            {theme === 'space' ? '✨' : theme === 'ocean' ? '🐠' : theme === 'forest' ? '🍃' : theme === 'candy' ? '🍬' : theme === 'sunset' ? '🌅' : theme === 'arctic' ? '❄️' : theme === 'volcano' ? '🔥' : '☁️'}
          </div>
        ))}
      </div>
    </div>
  );
});

// ---------- Bubble Component ----------

const BubbleComponent: React.FC<{
  bubble: FloatingBubble;
  onPop: (id: number, x: number, y: number) => void;
}> = React.memo(({ bubble, onPop }) => {
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bubble.popping) {
      onPop(bubble.id, bubble.x, bubble.y);
    }
  }, [bubble.id, bubble.x, bubble.y, bubble.popping, onPop]);

  const bubbleStyle: React.CSSProperties = {
    left: `${bubble.x}%`,
    top: `${bubble.y}%`,
    width: bubble.size * bubble.scale * bubble.popScale,
    height: bubble.size * bubble.scale * bubble.popScale,
    transform: `translate(-50%, -50%) rotate(${bubble.rotation}deg) scale(${1 + Math.sin(bubble.wobble) * 0.08})`,
    opacity: bubble.opacity,
    transition: bubble.popping ? 'all 0.3s ease-out' : 'none',
    zIndex: bubble.popping ? 100 : 10,
    filter: bubble.rainbow
      ? `hue-rotate(${(Date.now() / 10) % 360}deg) brightness(1.2)`
      : bubble.frozen
        ? 'brightness(1.3) saturate(0.5)'
        : bubble.specialEffect === 'golden'
          ? 'brightness(1.4) sepia(0.3)'
          : 'none',
  };

  const glowStyle: React.CSSProperties = {
    boxShadow: `0 0 ${bubble.specialEffect === 'mega' ? 30 : 18}px ${bubble.glowColor}, inset 0 0 ${bubble.specialEffect === 'mega' ? 15 : 8}px rgba(255,255,255,0.3)`,
  };

  return (
    <button
      className="absolute rounded-full flex items-center justify-center cursor-pointer select-none active:scale-110 hover:brightness-110"
      style={{ ...bubbleStyle, ...glowStyle, background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), ${bubble.color}40, ${bubble.color}80)` }}
      onClick={handleClick}
      onTouchStart={handleClick}
      aria-label={`Pop ${bubble.emoji} bubble`}
    >
      <span
        style={{
          fontSize: bubble.size * 0.48,
          lineHeight: 1,
          filter: bubble.specialEffect === 'golden' ? 'drop-shadow(0 0 4px gold)' : 'none',
        }}
      >
        {bubble.emoji}
      </span>
      {bubble.specialEffect === 'golden' && (
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-40" />
      )}
      {bubble.specialEffect === 'mega' && (
        <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-pulse opacity-50" />
      )}
      {bubble.sparkleTimer > 0 && (
        <span className="absolute -top-2 -right-2 text-lg animate-bounce">✨</span>
      )}
    </button>
  );
});

// ---------- Particle Component ----------

const ParticleComponent: React.FC<{ particle: Particle }> = React.memo(({ particle }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      left: particle.x,
      top: particle.y,
      opacity: particle.life,
      transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${particle.life})`,
      fontSize: particle.size,
      zIndex: 200,
      filter: particle.type === 'firework' ? `hue-rotate(${Math.random() * 360}deg)` : 'none',
    }}
  >
    {particle.type === 'confetti' ? (
      <div
        style={{
          width: randomRange(6, 12),
          height: randomRange(6, 12),
          backgroundColor: particle.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }}
      />
    ) : particle.type === 'star' ? (
      <span>⭐</span>
    ) : particle.type === 'heart' ? (
      <span>❤️</span>
    ) : (
      <span>{particle.emoji}</span>
    )}
  </div>
));

// ---------- Power-Up Component ----------

const PowerUpComponent: React.FC<{
  powerUp: PowerUp;
  onCollect: (id: number) => void;
}> = React.memo(({ powerUp, onCollect }) => {
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCollect(powerUp.id);
  }, [powerUp.id, onCollect]);

  return (
    <button
      className="absolute rounded-full flex items-center justify-center cursor-pointer select-none animate-bounce"
      style={{
        left: `${powerUp.x}%`,
        top: `${powerUp.y}%`,
        width: powerUp.size,
        height: powerUp.size,
        transform: `translate(-50%, -50%) rotate(${powerUp.rotation}deg)`,
        background: 'radial-gradient(circle, rgba(255,215,0,0.9), rgba(255,165,0,0.7))',
        boxShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,165,0,0.4)',
        zIndex: 50,
        border: '3px solid rgba(255,255,255,0.6)',
      }}
      onClick={handleClick}
      onTouchStart={handleClick}
      aria-label={`Collect ${POWER_UP_NAMES[powerUp.type]} power-up`}
    >
      <span style={{ fontSize: powerUp.size * 0.45 }}>{POWER_UP_EMOJIS[powerUp.type]}</span>
    </button>
  );
});

// ---------- Touch Ripple ----------

const TouchRippleComponent: React.FC<{ ripple: TouchRipple }> = React.memo(({ ripple }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: ripple.x,
      top: ripple.y,
      width: ripple.size,
      height: ripple.size,
      transform: 'translate(-50%, -50%)',
      border: `3px solid ${ripple.color}`,
      opacity: ripple.opacity,
      zIndex: 150,
    }}
  />
));

// ---------- Floating Score Text ----------

const FloatingTextComponent: React.FC<{ text: FloatingText }> = React.memo(({ text: ft }) => (
  <div
    className="absolute pointer-events-none font-black"
    style={{
      left: ft.x,
      top: ft.y,
      color: ft.color,
      fontSize: ft.size,
      opacity: ft.opacity,
      transform: 'translate(-50%, -50%)',
      zIndex: 300,
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }}
  >
    {ft.text}
  </div>
));

// ---------- Stats Panel ----------

const StatsPanel: React.FC<{
  gameState: GameState;
  onClose: () => void;
}> = React.memo(({ gameState, onClose }) => (
  <div className="absolute inset-0 z-[500] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-purple-600">📊 Stats</h2>
        <button onClick={onClose} className="text-2xl p-2 hover:bg-gray-100 rounded-full">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Score', value: formatScore(gameState.score), emoji: '⭐' },
          { label: 'Total Pops', value: gameState.totalPops, emoji: '🎈' },
          { label: 'Best Combo', value: `${gameState.maxCombo}x`, emoji: '🔥' },
          { label: 'Best Streak', value: gameState.bestStreak, emoji: '⚡' },
          { label: 'Level', value: gameState.level, emoji: '📈' },
          { label: 'Play Time', value: formatTime(gameState.sessionTime), emoji: '⏰' },
          { label: 'Perfect Pops', value: gameState.perfectPops, emoji: '🎯' },
          { label: 'Chain Reactions', value: gameState.chainReactions, emoji: '💥' },
          { label: 'Power-Ups', value: gameState.powerUpsCollected, emoji: '⚡' },
          { label: 'Bubbles Made', value: gameState.bubblesCreated, emoji: '🫧' },
          { label: 'Stars Earned', value: gameState.totalStarsEarned, emoji: '🌟' },
          { label: 'Multiplier', value: `${gameState.multiplier}x`, emoji: '💎' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-3 text-center">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-xl font-black text-purple-700">{stat.value}</div>
            <div className="text-xs text-gray-500 font-bold">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

// ---------- Achievements Panel ----------

const AchievementsPanel: React.FC<{
  achievements: Achievement[];
  onClose: () => void;
}> = React.memo(({ achievements, onClose }) => (
  <div className="absolute inset-0 z-[500] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-yellow-600">🏆 Achievements</h2>
        <button onClick={onClose} className="text-2xl p-2 hover:bg-gray-100 rounded-full">✕</button>
      </div>
      <div className="space-y-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`rounded-2xl p-3 flex items-center gap-3 ${ach.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-gray-50 border-2 border-gray-200 opacity-60'}`}
          >
            <span className="text-3xl">{ach.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-sm">{ach.title}</div>
              <div className="text-xs text-gray-500">{ach.description}</div>
              <div className="mt-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{ach.progress}/{ach.target} • ⭐ {ach.reward}</div>
            </div>
            {ach.unlocked && <span className="text-2xl">✅</span>}
          </div>
        ))}
      </div>
    </div>
  </div>
));

// ---------- Settings Panel ----------

const SettingsPanel: React.FC<{
  gameState: GameState;
  onClose: () => void;
  onChangeTheme: (theme: ThemeType) => void;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  onChangeMode: (mode: GameMode) => void;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onReset: () => void;
}> = React.memo(({ gameState, onClose, onChangeTheme, onChangeDifficulty, onChangeMode, onToggleSound, onToggleVibration, onReset }) => (
  <div className="absolute inset-0 z-[500] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-blue-600">⚙️ Settings</h2>
        <button onClick={onClose} className="text-2xl p-2 hover:bg-gray-100 rounded-full">✕</button>
      </div>

      {/* Sound & Vibration */}
      <div className="mb-6">
        <h3 className="font-black text-lg text-gray-700 mb-3">🔊 Sound & Haptics</h3>
        <div className="flex gap-3">
          <button
            onClick={onToggleSound}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg transition-all ${gameState.soundEnabled ? 'bg-green-100 text-green-700 border-2 border-green-400' : 'bg-gray-100 text-gray-500 border-2 border-gray-300'}`}
          >
            {gameState.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>
          <button
            onClick={onToggleVibration}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg transition-all ${gameState.vibrationEnabled ? 'bg-green-100 text-green-700 border-2 border-green-400' : 'bg-gray-100 text-gray-500 border-2 border-gray-300'}`}
          >
            {gameState.vibrationEnabled ? '📳 Vibrate ON' : '📴 Vibrate OFF'}
          </button>
        </div>
      </div>

      {/* Themes */}
      <div className="mb-6">
        <h3 className="font-black text-lg text-gray-700 mb-3">🎨 Themes</h3>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(THEMES) as ThemeType[]).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTheme(t)}
              className={`py-3 rounded-2xl font-bold text-sm transition-all flex flex-col items-center gap-1 ${gameState.theme === t ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <span className="text-2xl">{THEMES[t].emoji}</span>
              <span className="text-xs">{THEMES[t].name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <h3 className="font-black text-lg text-gray-700 mb-3">🎮 Difficulty (Age Group)</h3>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(DIFFICULTY_SETTINGS) as DifficultyLevel[]).map((d) => (
            <button
              key={d}
              onClick={() => onChangeDifficulty(d)}
              className={`py-3 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 ${gameState.difficulty === d ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <span className="text-xl">{DIFFICULTY_SETTINGS[d].emoji}</span>
              <span>{DIFFICULTY_SETTINGS[d].name}</span>
              <span className="text-[10px] text-gray-400">{DIFFICULTY_SETTINGS[d].ageRange}yr</span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Modes */}
      <div className="mb-6">
        <h3 className="font-black text-lg text-gray-700 mb-3">🕹️ Game Mode</h3>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(GAME_MODES) as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onChangeMode(m)}
              className={`py-3 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-1 ${gameState.gameMode === m ? 'ring-4 ring-green-400 bg-green-50 scale-105' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <span className="text-xl">{GAME_MODES[m].emoji}</span>
              <span>{GAME_MODES[m].name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-4 bg-red-100 text-red-600 rounded-2xl font-black text-lg hover:bg-red-200 transition-all"
      >
        🔄 Reset All Progress
      </button>
    </div>
  </div>
));

// ---------- Achievement Toast ----------

const AchievementToast: React.FC<{ achievement: Achievement | null; onDone: () => void }> = React.memo(({ achievement, onDone }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onDone, 3500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDone]);

  if (!achievement) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[600] animate-bounce">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl px-6 py-4 shadow-2xl flex items-center gap-3 border-4 border-yellow-300">
        <span className="text-4xl">{achievement.emoji}</span>
        <div>
          <div className="font-black text-white text-lg">{achievement.title}</div>
          <div className="text-yellow-100 text-sm font-bold">{achievement.description}</div>
          <div className="text-white/80 text-xs font-bold mt-1">+{achievement.reward} ⭐</div>
        </div>
      </div>
    </div>
  );
});

// ---------- Level Up Animation ----------

const LevelUpAnimation: React.FC<{ level: number; show: boolean; onDone: () => void }> = React.memo(({ level, show, onDone }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDone, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[550] flex items-center justify-center pointer-events-none">
      <div className="animate-bounce">
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl px-12 py-8 shadow-2xl border-4 border-white/30 text-center">
          <div className="text-6xl mb-2">🎉</div>
          <div className="text-white font-black text-3xl">LEVEL UP!</div>
          <div className="text-white/90 font-bold text-5xl mt-2">Level {level}</div>
          <div className="text-yellow-200 font-bold text-lg mt-2">✨ Amazing! ✨</div>
        </div>
      </div>
    </div>
  );
});

// ---------- Combo Indicator ----------

const ComboIndicator: React.FC<{ combo: number; comboTimer: number }> = React.memo(({ combo, comboTimer }) => {
  if (combo <= 1) return null;

  const colors = ['text-yellow-500', 'text-orange-500', 'text-red-500', 'text-purple-500', 'text-pink-500'];
  const colorClass = colors[Math.min(Math.floor(combo / 5), colors.length - 1)];
  const scale = Math.min(1 + combo * 0.05, 2);

  return (
    <div className="absolute top-20 right-4 z-[400] text-center">
      <div
        className={`font-black ${colorClass} drop-shadow-lg animate-pulse`}
        style={{ fontSize: `${Math.min(2 + combo * 0.15, 4)}rem`, transform: `scale(${scale})` }}
      >
        {combo}x
      </div>
      <div className="text-xs font-bold text-gray-600 mt-1">COMBO</div>
      <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 mx-auto overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all"
          style={{ width: `${comboTimer * 100}%` }}
        />
      </div>
    </div>
  );
});

// ---------- Active Power-Up Display ----------

const ActivePowerUpDisplay: React.FC<{ activePowerUps: { type: PowerUpType; timer: number; duration: number }[] }> = React.memo(({ activePowerUps }) => {
  if (activePowerUps.length === 0) return null;

  return (
    <div className="absolute top-20 left-4 z-[400] space-y-2">
      {activePowerUps.map((pu, i) => (
        <div key={`${pu.type}-${i}`} className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-sm">
          <span className="text-lg">{POWER_UP_EMOJIS[pu.type]}</span>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all"
              style={{ width: `${(pu.timer / pu.duration) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// ---------- Experience Bar ----------

const ExperienceBar: React.FC<{ experience: number; experienceToNext: number; level: number }> = React.memo(({ experience, experienceToNext, level }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-bold text-purple-600">Lv.{level}</span>
    <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-300"
        style={{ width: `${(experience / experienceToNext) * 100}%` }}
      />
    </div>
    <span className="text-[10px] text-gray-500">{experience}/{experienceToNext}</span>
  </div>
));

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const FloatingPlaygroundScreen: React.FC = () => {
  // --- State ---
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [touchRipples, setTouchRipples] = useState<TouchRipple[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<{ type: PowerUpType; timer: number; duration: number }[]>([]);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('floatingPlaygroundState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isPaused: false,
          showSettings: false,
          showStats: false,
          showAchievements: false,
          comboTimer: 0,
          combo: 0,
          sessionTime: 0,
          achievements: parsed.achievements || INITIAL_ACHIEVEMENTS,
        };
      } catch (_) {}
    }
    return {
      score: 0,
      combo: 0,
      maxCombo: 0,
      totalPops: 0,
      level: 1,
      experience: 0,
      experienceToNext: 50,
      streak: 0,
      bestStreak: 0,
      multiplier: 1,
      gameMode: 'freePlay' as GameMode,
      theme: 'sky' as ThemeType,
      difficulty: 'easy' as DifficultyLevel,
      isPaused: false,
      showSettings: false,
      showStats: false,
      showAchievements: false,
      soundEnabled: true,
      vibrationEnabled: true,
      comboTimer: 0,
      comboDecay: 0.02,
      lastPopTime: 0,
      sessionTime: 0,
      bubblesCreated: 0,
      perfectPops: 0,
      chainReactions: 0,
      powerUpsCollected: 0,
      achievements: INITIAL_ACHIEVEMENTS,
      unlockedThemes: ['sky'] as ThemeType[],
      unlockedModes: ['freePlay'] as GameMode[],
      dailyChallenge: null,
      starRating: 0,
      totalStarsEarned: 0,
    };
  });

  // --- Refs ---
  const bubbleIdCounter = useRef(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>();
  const lastTimeRef = useRef(Date.now());
  const spawnTimerRef = useRef(0);
  const powerUpTimerRef = useRef(0);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval>>();
  const musicalIndexRef = useRef(0);
  const poppedCategoriesRef = useRef<Set<string>>(new Set());

  // --- Initialize Sound ---
  useEffect(() => {
    soundManager.init();
  }, []);

  useEffect(() => {
    soundManager.setEnabled(gameState.soundEnabled);
  }, [gameState.soundEnabled]);

  // --- Save Progress ---
  useEffect(() => {
    const saveData = {
      score: gameState.score,
      totalPops: gameState.totalPops,
      maxCombo: gameState.maxCombo,
      bestStreak: gameState.bestStreak,
      level: gameState.level,
      experience: gameState.experience,
      experienceToNext: gameState.experienceToNext,
      theme: gameState.theme,
      difficulty: gameState.difficulty,
      gameMode: gameState.gameMode,
      soundEnabled: gameState.soundEnabled,
      vibrationEnabled: gameState.vibrationEnabled,
      bubblesCreated: gameState.bubblesCreated,
      perfectPops: gameState.perfectPops,
      chainReactions: gameState.chainReactions,
      powerUpsCollected: gameState.powerUpsCollected,
      achievements: gameState.achievements,
      unlockedThemes: gameState.unlockedThemes,
      unlockedModes: gameState.unlockedModes,
      totalStarsEarned: gameState.totalStarsEarned,
    };
    localStorage.setItem('floatingPlaygroundState', JSON.stringify(saveData));
  }, [gameState.score, gameState.totalPops, gameState.level, gameState.theme, gameState.difficulty, gameState.achievements, gameState.totalStarsEarned]);

  // --- Session Timer ---
  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      if (!gameState.isPaused) {
        setGameState((prev) => ({ ...prev, sessionTime: prev.sessionTime + 1 }));
      }
    }, 1000);
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [gameState.isPaused]);

  // --- Initial Bubbles ---
  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    const initialCount = Math.min(settings.maxBubbles, 10);
    const initial: FloatingBubble[] = [];
    for (let i = 0; i < initialCount; i++) {
      const id = bubbleIdCounter.current++;
      initial.push(createBubble(id, gameState.difficulty));
    }
    setBubbles(initial);
    setGameState((prev) => ({ ...prev, bubblesCreated: prev.bubblesCreated + initialCount }));
  }, [gameState.difficulty]);

  // --- Spawn New Bubbles (Unlimited) ---
  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    const spawnInterval = setInterval(() => {
      if (gameState.isPaused) return;
      setBubbles((prev) => {
        if (prev.length < settings.maxBubbles) {
          const id = bubbleIdCounter.current++;
          const specialChance = Math.random();
          let special: SpecialEffect | null = null;
          if (specialChance < 0.03) special = 'golden';
          else if (specialChance < 0.06) special = 'mega';
          else if (specialChance < 0.08) special = 'rainbow';

          const newBubble = createBubble(id, gameState.difficulty, undefined, undefined, special);
          setGameState((gs) => ({ ...gs, bubblesCreated: gs.bubblesCreated + 1 }));
          return [...prev, newBubble];
        }
        return prev;
      });
    }, settings.spawnRate);

    return () => clearInterval(spawnInterval);
  }, [gameState.difficulty, gameState.isPaused]);

  // --- Spawn Power-Ups ---
  useEffect(() => {
    const powerUpInterval = setInterval(() => {
      if (gameState.isPaused) return;
      if (Math.random() < 0.3) {
        const types: PowerUpType[] = ['doublePoints', 'slowMotion', 'magnetPull', 'freezeAll', 'rainbowMode', 'megaBubble', 'scoreMultiplier', 'explosionChain'];
        const type = types[Math.floor(Math.random() * types.length)];
        const id = generateUniqueId();
        setPowerUps((prev) => [...prev.slice(-3), createPowerUp(id, type)]);
      }
    }, 12000);

    return () => clearInterval(powerUpInterval);
  }, [gameState.isPaused]);

  // --- Animation Loop ---
  useEffect(() => {
    const animate = () => {
      if (!gameState.isPaused) {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 16.67;
        lastTimeRef.current = now;

        // Update bubbles
        setBubbles((prev) =>
          prev.map((b) => {
            if (b.popping) {
              const newPopScale = b.popScale + 0.08 * delta;
              const newOpacity = b.opacity - 0.06 * delta;
              if (newOpacity <= 0) return null as any;
              return { ...b, popScale: newPopScale, opacity: newOpacity };
            }

            let nextX = b.x + b.dx * delta;
            let nextY = b.y + b.dy * delta;
            let nextDx = b.dx;
            let nextDy = b.dy;

            // Boundary bouncing
            if (nextX < 4 || nextX > 94) {
              nextDx *= -0.9;
              nextX = clamp(nextX, 4, 94);
            }
            if (nextY < 8 || nextY > 90) {
              nextDy *= -0.9;
              nextY = clamp(nextY, 8, 90);
            }

            // Gentle random movement
            nextDx += (Math.random() - 0.5) * 0.02 * delta;
            nextDy += (Math.random() - 0.5) * 0.02 * delta;

            // Speed cap
            const maxSpeed = DIFFICULTY_SETTINGS[gameState.difficulty].speed * 1.5;
            nextDx = clamp(nextDx, -maxSpeed, maxSpeed);
            nextDy = clamp(nextDy, -maxSpeed, maxSpeed);

            return {
              ...b,
              x: nextX,
              y: nextY,
              dx: nextDx,
              dy: nextDy,
              rotation: (b.rotation + b.rotationSpeed * delta) % 360,
              wobble: b.wobble + b.wobbleSpeed * delta,
              pulsePhase: b.pulsePhase + 0.03 * delta,
              age: b.age + delta,
              sparkleTimer: Math.max(0, b.sparkleTimer - delta * 0.02),
            };
          }).filter(Boolean) as FloatingBubble[]
        );

        // Update particles
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.dx * delta,
              y: p.y + p.dy * delta,
              dy: p.dy + 0.15 * delta,
              life: p.life - (0.02 * delta) / p.maxLife,
              rotation: p.rotation + 5 * delta,
            }))
            .filter((p) => p.life > 0)
        );

        // Update touch ripples
        setTouchRipples((prev) =>
          prev
            .map((r) => ({
              ...r,
              size: r.size + 4 * delta,
              opacity: r.opacity - 0.03 * delta,
            }))
            .filter((r) => r.opacity > 0)
        );

        // Update floating texts
        setFloatingTexts((prev) =>
          prev
            .map((ft) => ({
              ...ft,
              y: ft.y + ft.dy * delta,
              opacity: ft.opacity - 0.015 * delta,
            }))
            .filter((ft) => ft.opacity > 0)
        );

        // Update power-ups (drift)
        setPowerUps((prev) =>
          prev.map((pu) => ({
            ...pu,
            x: clamp(pu.x + pu.dx * delta, 5, 90),
            y: clamp(pu.y + pu.dy * delta, 10, 85),
            rotation: pu.rotation + 2 * delta,
            dx: pu.dx + (Math.random() - 0.5) * 0.02,
            dy: pu.dy + (Math.random() - 0.5) * 0.02,
          }))
        );

        // Update active power-up timers
        setActivePowerUps((prev) =>
          prev
            .map((pu) => ({ ...pu, timer: pu.timer - 16.67 }))
            .filter((pu) => pu.timer > 0)
        );

        // Combo decay
        setGameState((prev) => {
          if (prev.combo > 0 && prev.comboTimer > 0) {
            const newTimer = prev.comboTimer - prev.comboDecay * delta;
            if (newTimer <= 0) {
              return { ...prev, combo: 0, comboTimer: 0 };
            }
            return { ...prev, comboTimer: newTimer };
          }
          return prev;
        });
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState.isPaused, gameState.difficulty]);

  // --- Check Achievements ---
  const checkAchievements = useCallback((state: GameState) => {
    const updated = state.achievements.map((ach) => {
      if (ach.unlocked) return ach;
      let newProgress = ach.progress;
      switch (ach.id) {
        case 'first_pop': case 'pop_10': case 'pop_50': case 'pop_100': case 'pop_500': case 'pop_1000':
          newProgress = state.totalPops;
          break;
        case 'combo_5': case 'combo_10': case 'combo_20': case 'combo_50':
          newProgress = state.maxCombo;
          break;
        case 'score_100': case 'score_500': case 'score_1000': case 'score_5000': case 'score_10000':
          newProgress = state.score;
          break;
        case 'power_5': case 'power_20':
          newProgress = state.powerUpsCollected;
          break;
        case 'chain_3': case 'chain_10':
          newProgress = state.chainReactions;
          break;
        case 'time_5': case 'time_15': case 'time_30':
          newProgress = state.sessionTime;
          break;
        case 'all_categories':
          newProgress = poppedCategoriesRef.current.size;
          break;
        case 'perfect_10':
          newProgress = state.perfectPops;
          break;
      }
      const unlocked = newProgress >= ach.target;
      if (unlocked && !ach.unlocked) {
        soundManager.achievement();
        setAchievementToast({ ...ach, unlocked: true, progress: newProgress });
      }
      return { ...ach, progress: newProgress, unlocked };
    });
    return updated;
  }, []);

  // --- Pop Bubble ---
  const handlePopBubble = useCallback((id: number, bx: number, by: number) => {
    const bubble = bubbles.find((b) => b.id === id);
    if (!bubble || bubble.popping) return;

    // Mark as popping
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popping: true, popScale: 1.3, opacity: 0.8 } : b))
    );

    // Track category
    poppedCategoriesRef.current.add(bubble.category);

    // Sound & vibration
    soundManager.pop();
    vibrate(20, gameState.vibrationEnabled);

    if (gameState.gameMode === 'musical') {
      soundManager.musical(musicalIndexRef.current++);
    }

    // Get container rect for particle positioning
    const rect = containerRef.current?.getBoundingClientRect();
    const px = rect ? (bx / 100) * rect.width : 200;
    const py = rect ? (by / 100) * rect.height : 200;

    // Create particles
    const newParticles: Particle[] = [];
    const particleCount = bubble.specialEffect === 'mega' ? 15 : bubble.specialEffect === 'golden' ? 12 : 8;
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(px, py, 'pop', bubble.emoji, bubble.color));
    }
    if (bubble.specialEffect === 'firework') {
      for (let i = 0; i < 20; i++) {
        newParticles.push(createParticle(px, py, 'firework', undefined, bubble.color));
      }
    }
    for (let i = 0; i < 3; i++) {
      newParticles.push(createParticle(px, py, 'star'));
    }
    setParticles((prev) => [...prev.slice(-80), ...newParticles]);

    // Touch ripple
    setTouchRipples((prev) => [
      ...prev.slice(-5),
      { id: generateUniqueId(), x: px, y: py, size: 10, opacity: 0.6, color: bubble.color },
    ]);

    // Calculate points
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    let basePoints = 5;
    if (bubble.specialEffect === 'golden') basePoints = 25;
    else if (bubble.specialEffect === 'mega') basePoints = 15;
    else if (bubble.specialEffect === 'rainbow') basePoints = 20;

    const hasDoublePoints = activePowerUps.some((p) => p.type === 'doublePoints');
    const hasMultiplier = activePowerUps.some((p) => p.type === 'scoreMultiplier');

    setGameState((prev) => {
      const newCombo = prev.combo + 1;
      const comboMultiplier = 1 + Math.floor(newCombo / 3) * 0.5;
      const pointsMultiplier = settings.pointsMultiplier * comboMultiplier * prev.multiplier * (hasDoublePoints ? 2 : 1) * (hasMultiplier ? 3 : 1);
      const points = Math.round(basePoints * pointsMultiplier);

      const newExp = prev.experience + points;
      let newLevel = prev.level;
      let newExpToNext = prev.experienceToNext;
      let newExpRemaining = newExp;

      // Level up check
      while (newExpRemaining >= newExpToNext) {
        newExpRemaining -= newExpToNext;
        newLevel++;
        newExpToNext = Math.round(newExpToNext * 1.3);
        soundManager.levelUp();
        setShowLevelUp(true);
        setNewLevel(newLevel);
      }

      const newState = {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        comboTimer: 1,
        totalPops: prev.totalPops + 1,
        streak: prev.streak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
        level: newLevel,
        experience: newExpRemaining,
        experienceToNext: newExpToNext,
        totalStarsEarned: prev.totalStarsEarned + points,
      };

      // Check achievements
      newState.achievements = checkAchievements(newState);

      return newState;
    });

    // Floating score text
    setFloatingTexts((prev) => [
      ...prev.slice(-10),
      {
        id: generateUniqueId(),
        x: px,
        y: py - 20,
        text: `+${basePoints}`,
        color: bubble.color,
        size: 24 + Math.min(gameState.combo * 2, 20),
        opacity: 1,
        dy: -1.5,
      },
    ]);

    // Combo sound
    if (gameState.combo > 0 && gameState.combo % 5 === 0) {
      soundManager.combo(gameState.combo);
      vibrate([30, 20, 30], gameState.vibrationEnabled);
    }

    // After pop animation, spawn a replacement bubble (UNLIMITED!)
    setTimeout(() => {
      setBubbles((prev) => {
        const filtered = prev.filter((b) => b.id !== id);
        // Always spawn a new one to replace
        const newId = bubbleIdCounter.current++;
        const specialChance = Math.random();
        let special: SpecialEffect | null = null;
        if (specialChance < 0.04) special = 'golden';
        else if (specialChance < 0.07) special = 'mega';
        else if (specialChance < 0.09) special = 'rainbow';
        const newBubble = createBubble(newId, gameState.difficulty, undefined, undefined, special);
        setGameState((gs) => ({ ...gs, bubblesCreated: gs.bubblesCreated + 1 }));
        return [...filtered, newBubble];
      });
    }, 350);

    // Chain reaction for mega/explosion
    if (bubble.specialEffect === 'mega' || activePowerUps.some((p) => p.type === 'explosionChain')) {
      setGameState((prev) => ({ ...prev, chainReactions: prev.chainReactions + 1 }));
      soundManager.chain();
      setTimeout(() => {
        setBubbles((prev) => {
          const nearby = prev.filter(
            (b) => !b.popping && distance(b.x, b.y, bubble.x, bubble.y) < 20,
          );
          if (nearby.length > 0) {
            nearby.forEach((nb) => {
              handlePopBubble(nb.id, nb.x, nb.y);
            });
          }
          return prev;
        });
      }, 200);
    }
  }, [bubbles, gameState, activePowerUps, checkAchievements]);

  // --- Collect Power-Up ---
  const handleCollectPowerUp = useCallback((id: number) => {
    const pu = powerUps.find((p) => p.id === id);
    if (!pu) return;

    soundManager.powerUp();
    vibrate([20, 10, 20, 10, 40], gameState.vibrationEnabled);

    setPowerUps((prev) => prev.filter((p) => p.id !== id));
    setActivePowerUps((prev) => [...prev, { type: pu.type, timer: pu.duration, duration: pu.duration }]);

    setGameState((prev) => ({
      ...prev,
      powerUpsCollected: prev.powerUpsCollected + 1,
      score: prev.score + 20,
      totalStarsEarned: prev.totalStarsEarned + 20,
    }));

    // Power-up specific effects
    if (pu.type === 'freezeAll') {
      soundManager.freeze();
      setBubbles((prev) => prev.map((b) => ({ ...b, frozen: true, dx: b.dx * 0.1, dy: b.dy * 0.1 })));
      setTimeout(() => {
        setBubbles((prev) => prev.map((b) => ({ ...b, frozen: false, dx: b.dx * 10, dy: b.dy * 10 })));
      }, pu.duration);
    }

    if (pu.type === 'rainbowMode') {
      setBubbles((prev) => prev.map((b) => ({ ...b, rainbow: true })));
      setTimeout(() => {
        setBubbles((prev) => prev.map((b) => ({ ...b, rainbow: false })));
      }, pu.duration);
    }

    if (pu.type === 'megaBubble') {
      const newId = bubbleIdCounter.current++;
      const megaBubble = createBubble(newId, gameState.difficulty, 50, 50, 'mega');
      megaBubble.size = 100;
      setBubbles((prev) => [...prev, megaBubble]);
    }

    if (pu.type === 'slowMotion') {
      setBubbles((prev) => prev.map((b) => ({ ...b, dx: b.dx * 0.3, dy: b.dy * 0.3 })));
      setTimeout(() => {
        setBubbles((prev) => prev.map((b) => ({ ...b, dx: b.dx / 0.3, dy: b.dy / 0.3 })));
      }, pu.duration);
    }

    // Floating text
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setFloatingTexts((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          x: (pu.x / 100) * rect.width,
          y: (pu.y / 100) * rect.height - 30,
          text: POWER_UP_NAMES[pu.type] + '!',
          color: '#FFD700',
          size: 20,
          opacity: 1,
          dy: -1.5,
        },
      ]);
    }
  }, [powerUps, gameState.vibrationEnabled, gameState.difficulty]);

  // --- Touch/Click on background to add bubbles ---
  const handleBackgroundTouch = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    soundManager.tap();
    vibrate(10, gameState.vibrationEnabled);

    // Add touch ripple
    setTouchRipples((prev) => [
      ...prev.slice(-8),
      { id: generateUniqueId(), x: clientX - rect.left, y: clientY - rect.top, size: 10, opacity: 0.4, color: getRandomColor() },
    ]);
  }, [gameState.vibrationEnabled]);

  // --- Add Icons Button ---
  const handleAddBubbles = useCallback((count: number = 1) => {
    soundManager.tap();
    vibrate(15, gameState.vibrationEnabled);
    const newBubbles: FloatingBubble[] = [];
    for (let i = 0; i < count; i++) {
      const id = bubbleIdCounter.current++;
      newBubbles.push(createBubble(id, gameState.difficulty));
    }
    setBubbles((prev) => [...prev, ...newBubbles]);
    setGameState((prev) => ({ ...prev, bubblesCreated: prev.bubblesCreated + count }));
  }, [gameState.difficulty, gameState.vibrationEnabled]);

  // --- Rain Bubbles ---
  const handleRainBubbles = useCallback(() => {
    soundManager.powerUp();
    vibrate([10, 10, 10, 10, 10, 10, 30], gameState.vibrationEnabled);
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const id = bubbleIdCounter.current++;
        const newBubble = createBubble(id, gameState.difficulty, randomRange(10, 90), 5);
        newBubble.dy = randomRange(0.3, 0.8);
        setBubbles((prev) => [...prev, newBubble]);
        setGameState((prev) => ({ ...prev, bubblesCreated: prev.bubblesCreated + 1 }));
      }, i * 120);
    }
  }, [gameState.difficulty, gameState.vibrationEnabled]);

  // --- Settings Handlers ---
  const handleChangeTheme = useCallback((theme: ThemeType) => {
    soundManager.tap();
    setGameState((prev) => ({ ...prev, theme }));
  }, []);

  const handleChangeDifficulty = useCallback((difficulty: DifficultyLevel) => {
    soundManager.tap();
    setGameState((prev) => ({ ...prev, difficulty }));
    setBubbles([]);
  }, []);

  const handleChangeMode = useCallback((mode: GameMode) => {
    soundManager.tap();
    setGameState((prev) => ({ ...prev, gameMode: mode }));
  }, []);

  const handleToggleSound = useCallback(() => {
    setGameState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const handleToggleVibration = useCallback(() => {
    setGameState((prev) => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  }, []);

  const handleReset = useCallback(() => {
    localStorage.removeItem('floatingPlaygroundState');
    poppedCategoriesRef.current.clear();
    setGameState({
      score: 0, combo: 0, maxCombo: 0, totalPops: 0, level: 1,
      experience: 0, experienceToNext: 50, streak: 0, bestStreak: 0, multiplier: 1,
      gameMode: 'freePlay', theme: 'sky', difficulty: 'easy',
      isPaused: false, showSettings: false, showStats: false, showAchievements: false,
      soundEnabled: true, vibrationEnabled: true, comboTimer: 0, comboDecay: 0.02,
      lastPopTime: 0, sessionTime: 0, bubblesCreated: 0, perfectPops: 0,
      chainReactions: 0, powerUpsCollected: 0, achievements: INITIAL_ACHIEVEMENTS,
      unlockedThemes: ['sky'], unlockedModes: ['freePlay'], dailyChallenge: null,
      starRating: 0, totalStarsEarned: 0,
    });
    setBubbles([]);
    setParticles([]);
    setPowerUps([]);
    setActivePowerUps([]);
  }, []);

  const handleClearBubbles = useCallback(() => {
    soundManager.tap();
    // Create explosion particles for all bubbles
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const newParticles: Particle[] = [];
      bubbles.forEach((b) => {
        const px = (b.x / 100) * rect.width;
        const py = (b.y / 100) * rect.height;
        for (let i = 0; i < 4; i++) {
          newParticles.push(createParticle(px, py, 'confetti', b.emoji, b.color));
        }
      });
      setParticles((prev) => [...prev.slice(-40), ...newParticles]);
    }
    setBubbles([]);
    vibrate([30, 20, 30, 20, 50], gameState.vibrationEnabled);
  }, [bubbles, gameState.vibrationEnabled]);

  // --- Render ---
  return (
    <div className="h-full w-full relative overflow-hidden select-none" style={{ touchAction: 'none' }}>
      {/* Animated Background */}
      <AnimatedBackground theme={gameState.theme} gameMode={gameState.gameMode} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl md:text-3xl">🎈</span>
              <div className="min-w-0">
                <h1 className="text-sm md:text-xl font-black text-purple-600 truncate">
                  Floating Playground
                </h1>
                <div className="hidden md:block">
                  <ExperienceBar experience={gameState.experience} experienceToNext={gameState.experienceToNext} level={gameState.level} />
                </div>
              </div>
            </div>

            {/* Score & Controls */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Score */}
              <div className="bg-yellow-100 rounded-full px-3 md:px-5 py-1.5 md:py-2 flex items-center gap-1.5 shadow-md">
                <span className="text-lg md:text-xl">⭐</span>
                <span className="text-lg md:text-2xl font-black text-yellow-600">{formatScore(gameState.score)}</span>
              </div>

              {/* Bubble Count */}
              <div className="bg-blue-100 rounded-full px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-1 shadow-md">
                <span className="text-lg">🫧</span>
                <span className="text-lg font-bold text-blue-600">{bubbles.filter((b) => !b.popping).length}</span>
              </div>

              {/* Menu Buttons */}
              <button
                onClick={() => setGameState((prev) => ({ ...prev, showStats: true }))}
                className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 active:scale-90 transition-all"
              >
                <span className="text-lg">📊</span>
              </button>
              <button
                onClick={() => setGameState((prev) => ({ ...prev, showAchievements: true }))}
                className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 active:scale-90 transition-all"
              >
                <span className="text-lg">🏆</span>
              </button>
              <button
                onClick={() => setGameState((prev) => ({ ...prev, showSettings: true }))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 transition-all"
              >
                <span className="text-lg">⚙️</span>
              </button>
            </div>
          </div>

          {/* Mobile XP Bar */}
          <div className="md:hidden mt-1.5">
            <ExperienceBar experience={gameState.experience} experienceToNext={gameState.experienceToNext} level={gameState.level} />
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div
        ref={containerRef}
        className="absolute inset-0 pt-[72px] md:pt-[80px] pb-[72px] md:pb-[80px]"
        onClick={handleBackgroundTouch}
        onTouchStart={handleBackgroundTouch}
      >
        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <BubbleComponent key={bubble.id} bubble={bubble} onPop={handlePopBubble} />
        ))}

        {/* Power-Ups */}
        {powerUps.map((pu) => (
          <PowerUpComponent key={pu.id} powerUp={pu} onCollect={handleCollectPowerUp} />
        ))}

        {/* Particles */}
        {particles.map((p) => (
          <ParticleComponent key={p.id} particle={p} />
        ))}

        {/* Touch Ripples */}
        {touchRipples.map((r) => (
          <TouchRippleComponent key={r.id} ripple={r} />
        ))}

        {/* Floating Texts */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className="absolute pointer-events-none font-black"
            style={{
              left: ft.x,
              top: ft.y,
              color: ft.color,
              fontSize: ft.size,
              opacity: ft.opacity,
              transform: 'translate(-50%, -50%)',
              zIndex: 300,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Combo Indicator */}
      <ComboIndicator combo={gameState.combo} comboTimer={gameState.comboTimer} />

      {/* Active Power-Ups Display */}
      <ActivePowerUpDisplay activePowerUps={activePowerUps} />

      {/* Footer Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="px-2 py-2 md:px-6 md:py-3">
          <div className="flex items-center justify-center gap-1.5 md:gap-3 flex-wrap">
            <button
              onClick={() => handleAddBubbles(1)}
              className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full text-sm md:text-lg font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              ➕ Add
            </button>

            <button
              onClick={() => handleAddBubbles(5)}
              className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full text-sm md:text-lg font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              🎯 ×5
            </button>

            <button
              onClick={handleRainBubbles}
              className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full text-sm md:text-lg font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              🌧️ Rain
            </button>

            <button
              onClick={handleClearBubbles}
              className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full text-sm md:text-lg font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              💥 Clear
            </button>

            <button
              onClick={() => setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-lg font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all ${gameState.isPaused ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}
            >
              {gameState.isPaused ? '▶️ Play' : '⏸️ Pause'}
            </button>
          </div>

          {/* Mode & Theme indicator */}
          <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-gray-500 font-bold">
            <span>{GAME_MODES[gameState.gameMode].emoji} {GAME_MODES[gameState.gameMode].name}</span>
            <span>•</span>
            <span>{THEMES[gameState.theme].emoji} {THEMES[gameState.theme].name}</span>
            <span>•</span>
            <span>{DIFFICULTY_SETTINGS[gameState.difficulty].emoji} {DIFFICULTY_SETTINGS[gameState.difficulty].name} ({DIFFICULTY_SETTINGS[gameState.difficulty].ageRange}yr)</span>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {gameState.showSettings && (
        <SettingsPanel
          gameState={gameState}
          onClose={() => setGameState((prev) => ({ ...prev, showSettings: false }))}
          onChangeTheme={handleChangeTheme}
          onChangeDifficulty={handleChangeDifficulty}
          onChangeMode={handleChangeMode}
          onToggleSound={handleToggleSound}
          onToggleVibration={handleToggleVibration}
          onReset={handleReset}
        />
      )}

      {gameState.showStats && (
        <StatsPanel
          gameState={gameState}
          onClose={() => setGameState((prev) => ({ ...prev, showStats: false }))}
        />
      )}

      {gameState.showAchievements && (
        <AchievementsPanel
          achievements={gameState.achievements}
          onClose={() => setGameState((prev) => ({ ...prev, showAchievements: false }))}
        />
      )}

      {/* Achievement Toast */}
      <AchievementToast achievement={achievementToast} onDone={() => setAchievementToast(null)} />

      {/* Level Up Animation */}
      <LevelUpAnimation level={newLevel} show={showLevelUp} onDone={() => setShowLevelUp(false)} />

      {/* Pause Overlay */}
      {gameState.isPaused && !gameState.showSettings && !gameState.showStats && !gameState.showAchievements && (
        <div className="absolute inset-0 z-[400] bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4">⏸️</div>
            <div className="text-white font-black text-4xl drop-shadow-lg">PAUSED</div>
            <button
              onClick={() => setGameState((prev) => ({ ...prev, isPaused: false }))}
              className="mt-6 px-10 py-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full text-xl font-black text-white shadow-2xl active:scale-95 transition-all"
            >
              ▶️ Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import { WorldConfig, WorldTheme } from '../types/game';

export const WORLD_THEMES: Record<WorldTheme, WorldConfig> = {
  space: {
    id: 'space',
    name: 'Space World',
    icon: 'Rocket',
    background: {
      gradient: 'from-indigo-950 via-purple-950 to-black',
      particleColor: '#ffffff',
    },
    tiles: {
      empty: 'bg-black/40 backdrop-blur-sm border-gray-700/30',
      explored: 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border-cyan-400/30',
      obstacle: 'bg-gradient-to-br from-purple-900/80 to-purple-950/80',
    },
    player: {
      color: 'text-cyan-300',
      glowColor: '#22d3ee',
    },
    goal: {
      color: 'text-yellow-400',
      glowColor: '#fbbf24',
    },
    levelNode: {
      active: 'from-cyan-500/30 to-purple-500/30',
      completed: 'from-yellow-500/30 to-orange-500/30',
      locked: 'from-gray-800/50 to-gray-900/50',
      border: 'border-cyan-400',
    },
  },
  candy: {
    id: 'candy',
    name: 'Candy World',
    icon: 'Candy',
    background: {
      gradient: 'from-pink-300 via-purple-300 to-blue-300',
      particleColor: '#fbbf24',
    },
    tiles: {
      empty: 'bg-white/30 backdrop-blur-sm border-pink-200/40',
      explored: 'bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-sm border-pink-300/50',
      obstacle: 'bg-gradient-to-br from-amber-700/90 to-amber-900/90',
    },
    player: {
      color: 'text-pink-500',
      glowColor: '#ec4899',
    },
    goal: {
      color: 'text-purple-500',
      glowColor: '#a855f7',
    },
    levelNode: {
      active: 'from-pink-400/40 to-purple-400/40',
      completed: 'from-green-400/40 to-emerald-500/40',
      locked: 'from-gray-400/30 to-gray-500/30',
      border: 'border-pink-400',
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber World',
    icon: 'Cpu',
    background: {
      gradient: 'from-gray-950 via-blue-950 to-black',
      particleColor: '#00ff88',
    },
    tiles: {
      empty: 'bg-black/60 backdrop-blur-sm border-green-500/20',
      explored: 'bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm border-green-400/40',
      obstacle: 'bg-gradient-to-br from-red-600/80 to-red-900/80',
    },
    player: {
      color: 'text-green-400',
      glowColor: '#4ade80',
    },
    goal: {
      color: 'text-blue-400',
      glowColor: '#60a5fa',
    },
    levelNode: {
      active: 'from-green-500/30 to-blue-500/30',
      completed: 'from-cyan-400/40 to-teal-500/40',
      locked: 'from-gray-800/40 to-gray-900/40',
      border: 'border-green-400',
    },
  },
};

export const LEVELS_PER_WORLD = 8;

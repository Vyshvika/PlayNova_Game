# PlayNova: AgentX Quest - Game Features

## 🎮 Game Overview

PlayNova: AgentX Quest is a modern, AI-powered puzzle game built for hackathon demonstration. The game features a 5x5 grid-based gameplay with intelligent agent behavior, dynamic obstacles, and three unique worlds.

## ✨ Key Features

### 1. **Three Distinct Worlds**

#### Space World 🚀
- Dark gradients with starry backgrounds
- Purple/cyan color scheme
- Asteroid obstacles
- Alien-themed enemies
- Sparkles player icon

#### Candy World 🍭
- Pastel pink/purple/blue gradients
- Candy-themed tiles
- Chocolate block obstacles
- Candy monster enemies
- Lollipop player icon
- Floating candy particles

#### Cyber World 💻
- Neon grid backgrounds
- Green/blue laser aesthetic
- Red laser wall obstacles
- Security drone enemies
- Electric zap player icon
- Animated grid lines

### 2. **Dynamic Gameplay**

#### Dynamic Goal Positioning
- Goal position changes every level
- Never overlaps with obstacles or enemies
- Clearly marked with animated icons

#### Dynamic Obstacles
- Obstacles regenerate every 4 seconds
- 50% of obstacles stay, 50% move to new positions
- Number increases with level difficulty
- Never spawns on player, goal, or enemy positions

#### Real Enemy AI
- Enemies move every 2-3 seconds (faster on higher levels)
- 40% chance to chase player
- 60% random movement
- Collision detection with player
- Multiple enemies on higher levels

### 3. **AI Play Mode 🤖**

Toggle the "Let AI Play" button to activate autonomous gameplay:
- AgentX uses pathfinding algorithm (BFS)
- Avoids obstacles and enemies
- Recalculates path when environment changes
- Shows "AgentX is thinking..." status
- Brain icon appears on player when active
- Manual controls disabled during AI mode

### 4. **Level Progression System**

#### Unlocking Mechanics
- Level 1 starts unlocked
- Complete a level to unlock the next
- Each world has 8 levels
- Visual indicators:
  - 🔒 Locked levels (gray with lock icon)
  - ⭐ Completed levels (glowing with stars)
  - ▶️ Current level (pulsing with "Play Now!")

#### Difficulty Scaling
- **Level 1**: Few obstacles, 1 enemy
- **Higher Levels**: 
  - More obstacles (up to 8)
  - Multiple enemies (up to 4)
  - Faster enemy movement
  - More complex patterns

### 5. **Fog of War System**
- Unexplored tiles show "?"
- Player vision radius reveals surrounding tiles
- Strategic exploration required
- Enemies and obstacles only visible when explored

### 6. **Performance Metrics**

Tracked and displayed:
- **Moves**: Number of steps taken
- **Time**: Seconds elapsed
- **Lives**: Heart indicators (3 total)
- **Timer**: Countdown from 120 seconds
- **Stars**: Collected per level (3 per level)

### 7. **Full-Screen Desktop Support**

#### Responsive Design
- Optimized for desktop/large displays
- Centered game panel
- Scalable UI elements
- No scrolling required for game board
- Mobile-friendly with breakpoints

#### Layout
- Top bar with level info, stats, and AI toggle
- Centered 5x5 game board
- Side-mounted controls and info panel
- Bottom navigation

### 8. **World Selector UI**
- Three prominent world tabs
- Active world highlights with theme colors
- Smooth transitions between worlds
- Icons for each world (Rocket, Candy, CPU)

### 9. **Visual Polish**

#### Animations
- Particle effects per world theme
- Smooth tile transitions
- Enemy movement animations
- Victory/defeat screens
- Pulsing current level indicator
- Rotating goal icons

#### Glassmorphism Design
- Backdrop blur effects
- Semi-transparent panels
- Border highlights
- Gradient overlays
- Modern aesthetic

## 🎯 Game Objectives

1. **Primary Goal**: Navigate AgentX from start (top-left) to goal position
2. **Avoid**: Obstacles (lose life), Enemies (lose life)
3. **Survive**: Complete before time runs out or lives deplete
4. **Explore**: Uncover fog of war to find path
5. **Progress**: Unlock all levels in all worlds

## 🎪 Hackathon Demo Points

### AI/ML Demonstration
- Pathfinding algorithm visualization
- Real-time decision making
- Adaptive behavior with dynamic environment

### Game Design
- Progressive difficulty
- Multiple themed worlds
- Engaging mechanics

### Technical Excellence
- Clean, modular code structure
- Type-safe TypeScript
- Responsive React components
- Performance optimized

### User Experience
- Intuitive controls
- Clear visual feedback
- Professional polish
- Accessibility features

## 📊 Metrics for AI Improvement

Track these to demonstrate learning:
- Moves per level (fewer = better)
- Time per level (faster = better)
- Success rate across levels
- Path efficiency

## 🎮 Controls

### Manual Mode
- Arrow buttons or keys
- Grid-based movement
- One tile per move

### AI Mode
- Toggle "Let AI Play" button
- Watch autonomous gameplay
- Disable/enable anytime

## 🏆 Victory Conditions

- Reach the goal tile
- Complete within time limit
- Have at least 1 life remaining

## ❌ Failure Conditions

- Lose all 3 lives
- Timer reaches 0
- Can retry or return to map

## 🔮 Future Enhancements

- Power-ups and collectibles
- Multiplayer races
- Leaderboards
- More worlds and themes
- Advanced AI strategies
- Level editor

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import {
  Sparkles,
  Lollipop,
  Zap,
  Target,
  Circle,
  Skull,
  Brain,
  Bot,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Heart,
  Timer,
  TrendingUp,
  Map
} from 'lucide-react';

import { WorldTheme } from '../types/game';
import type { Position, Enemy } from '../types/game';

import {
  GRID_SIZE,
  generateLevelConfig,
  generateSafePosition,
  generateObstacles,
  getEnemyNextMove,
  getRandomEnemyMove, 
  isSamePosition,
  isValidPosition,
  collidesWithObstacles,
  collidesWithEnemies
} from '../utils/gameLogic';

import { WORLD_THEMES } from '../config/themes';
import { useAIPlayer } from '../hooks/useAIPlayer';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

interface GameScreenProps {
  level: number;
  world: WorldTheme;
  onBackToMap: () => void;
  onLevelComplete: () => void;
}

export function GameScreen({ level, world, onBackToMap, onLevelComplete }: GameScreenProps) {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [goalPos, setGoalPos] = useState<Position>({ x: 4, y: 4 });
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [exploredTiles, setExploredTiles] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const obstacleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enemyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const theme = WORLD_THEMES[world];
  const levelConfig = generateLevelConfig(level);

  // Initialize level
  useEffect(() => {
    const startPos: Position = { x: 0, y: 0 };
    
    // Generate dynamic goal position (never same as start)
    const newGoalPos = generateSafePosition([startPos]);
    
    // Generate enemies
    const newEnemies: Enemy[] = [];
    for (let i = 0; i < levelConfig.enemyCount; i++) {
      const enemyPos = generateSafePosition([
        startPos,
        newGoalPos,
        ...newEnemies.map(e => e.position),
      ]);
      newEnemies.push({
        id: i,
        position: enemyPos,
        lastMove: Date.now(),
      });
    }
    
    // Generate obstacles
    const newObstacles = generateObstacles(
      levelConfig.obstacleCount,
      startPos,
      newGoalPos,
      newEnemies
    );
    
    setPlayerPos(startPos);
    setGoalPos(newGoalPos);
    setObstacles(newObstacles);
    setEnemies(newEnemies);
    setExploredTiles(new Set([`${startPos.x},${startPos.y}`]));
    setLives(3);
    setTimeLeft(120);
    setGameWon(false);
    setGameLost(false);
    setMoveCount(0);
    setTimeElapsed(0);
    
    return () => {
      if (obstacleTimerRef.current) clearInterval(obstacleTimerRef.current);
      if (enemyTimerRef.current) clearInterval(enemyTimerRef.current);
    };
  }, [level]);

  // Timer countdown and elapsed time
  useEffect(() => {
    if (timeLeft > 0 && !gameWon && !gameLost) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameWon) {
      setGameLost(true);
    }
  }, [timeLeft, gameWon, gameLost, startTime]);

  // Dynamic obstacles - regenerate every 4 seconds
  useEffect(() => {
    if (gameWon || gameLost) return;
    
    obstacleTimerRef.current = setInterval(() => {
      setObstacles(prevObstacles => {
        // Keep some obstacles, move others
        const keepCount = Math.floor(prevObstacles.length * 0.5);
        const keptObstacles = prevObstacles.slice(0, keepCount);
        
        const newCount = levelConfig.obstacleCount - keepCount;
        const occupied = [
          playerPos,
          goalPos,
          ...enemies.map(e => e.position),
          ...keptObstacles,
        ];
        
        const newObstacles = [...keptObstacles];
        for (let i = 0; i < newCount; i++) {
          const pos = generateSafePosition([...occupied, ...newObstacles]);
          newObstacles.push(pos);
        }
        
        return newObstacles;
      });
    }, 4000);
    
    return () => {
      if (obstacleTimerRef.current) clearInterval(obstacleTimerRef.current);
    };
  }, [gameWon, gameLost, levelConfig.obstacleCount, playerPos, goalPos, enemies]);

  // Enemy movement AI
  useEffect(() => {
    if (gameWon || gameLost) return;

    enemyTimerRef.current = setInterval(() => {
      setEnemies(prevEnemies => {
        return prevEnemies.map(enemy => {
          const otherEnemies = prevEnemies.filter(e => e.id !== enemy.id);
          const newPos = getEnemyNextMove(
            enemy,
            playerPos,
            obstacles,
            otherEnemies,
            0.4
          );

          return {
            ...enemy,
            position: newPos,
            lastMove: Date.now(),
          };
        });
      });
    }, levelConfig.enemySpeed);

    return () => {
      if (enemyTimerRef.current) clearInterval(enemyTimerRef.current);
    };
  }, [gameWon, gameLost, levelConfig.enemySpeed, playerPos, obstacles]);

  // Enemy movement – dynamic every 2–3 seconds
  useEffect(() => {
    if (gameWon || gameLost) return;

  // clear any existing interval
    if (enemyTimerRef.current) {
      clearInterval(enemyTimerRef.current);
    }

    enemyTimerRef.current = setInterval(() => {
      setEnemies(prevEnemies =>
        prevEnemies.map(enemy => {
          const otherEnemies = prevEnemies.filter(e => e.id !== enemy.id);

          // Mix smart chase + random movement
          const newPos =
            Math.random() < 0.5
              ? getEnemyNextMove(
                enemy,
                playerPos,
                obstacles,
                otherEnemies,
                0.6 // more aggressive than before
              )
              : getRandomEnemyMove(
                enemy,
                playerPos,
                obstacles,
                otherEnemies
              );

        return {
          ...enemy,
          position: newPos,
          lastMove: Date.now(),
        };
      })
    );
  }, 2000 + Math.random() * 1000); // 🔥 2–3 seconds

    return () => {
      if (enemyTimerRef.current) {
        clearInterval(enemyTimerRef.current);
        enemyTimerRef.current = null;
      }
    };
  }, [gameWon, gameLost, playerPos, obstacles]);

  // Check collision with enemies after they move
  useEffect(() => {
    if (gameWon || gameLost) return;
    
    const hitByEnemy = enemies.some(enemy => isSamePosition(enemy.position, playerPos));
    if (hitByEnemy) {
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameLost(true);
      }
    }
  }, [enemies, playerPos, lives, gameWon, gameLost]);

  // Explore surrounding tiles
  const exploreSurrounding = useCallback((pos: Position) => {
    setExploredTiles(prev => {
      const newSet = new Set(prev);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const newY = pos.y + dy;
          const newX = pos.x + dx;
          if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
            newSet.add(`${newX},${newY}`);
          }
        }
      }
      return newSet;
    });
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameWon || gameLost) return;
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    const newPos = { x: newX, y: newY };

    // Check boundaries
    if (!isValidPosition(newPos)) return;

    // Check obstacles
    if (collidesWithObstacles(newPos, obstacles)) {
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      if (newLives <= 0) {
        setGameLost(true);
      }
      return;
    }

    // Check enemies
    if (collidesWithEnemies(newPos, enemies)) {
      const newLives = Math.max(0, lives - 1);
      setLives(newLives);
      if (newLives <= 0) {
        setGameLost(true);
      }
      return;
    }

    // Move player
    setPlayerPos(newPos);
    setMoveCount(prev => prev + 1);
    exploreSurrounding(newPos);

    // Check if reached goal
    if (isSamePosition(newPos, goalPos)) {
      setGameWon(true);
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      setTimeout(() => {
        onLevelComplete();
      }, 2000);
    }
  }, [playerPos, goalPos, obstacles, enemies, lives, gameWon, gameLost, exploreSurrounding, onLevelComplete, startTime]);

  // AI Player hook
  const aiPlayer = useAIPlayer({
    isEnabled: isAIEnabled,
    playerPos,
    goalPos,
    obstacles,
    enemies,
    onMove: movePlayer,
    gameWon,
  });

  // Keyboard Controls hook
  useKeyboardControls({
    onUp: () => movePlayer(0, -1),
    onDown: () => movePlayer(0, 1),
    onLeft: () => movePlayer(-1, 0),
    onRight: () => movePlayer(1, 0),
    enabled: !isAIEnabled && !gameWon && !gameLost,
  });

  const getPlayerIcon = () => {
    switch (world) {
      case 'space':
        return <Sparkles className={`w-8 h-8 ${theme.player.color}`} />;
      case 'candy':
        return <Lollipop className={`w-8 h-8 ${theme.player.color}`} />;
      case 'cyber':
        return <Zap className={`w-8 h-8 ${theme.player.color}`} />;
    }
  };

  const getGoalIcon = () => {
    switch (world) {
      case 'space':
        return <Target className={`w-10 h-10 ${theme.goal.color}`} />;
      case 'candy':
        return <Circle className={`w-10 h-10 ${theme.goal.color} fill-current`} />;
      case 'cyber':
        return <Target className={`w-10 h-10 ${theme.goal.color}`} />;
    }
  };

  const getEnemyIcon = () => {
    switch (world) {
      case 'space':
        return <Skull className="w-7 h-7 text-red-400" />;
      case 'candy':
        return <Circle className="w-7 h-7 text-purple-600 fill-current" />;
      case 'cyber':
        return <Zap className="w-7 h-7 text-red-500" />;
    }
  };

  const getTileContent = (x: number, y: number) => {
    const pos = { x, y };
    const isExplored = exploredTiles.has(`${x},${y}`);

    if (isSamePosition(pos, playerPos)) {
      return (
        <motion.div
          className="w-full h-full flex items-center justify-center relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {getPlayerIcon()}
          {isAIEnabled && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Brain className="w-3 h-3 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>
      );
    }

    if (isSamePosition(pos, goalPos) && isExplored) {
      return (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity } }}
        >
          {getGoalIcon()}
        </motion.div>
      );
    }

    const enemy = enemies.find(e => isSamePosition(e.position, pos));
    if (enemy && isExplored) {
      return (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          key={`enemy-${enemy.id}-${enemy.position.x}-${enemy.position.y}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {getEnemyIcon()}
        </motion.div>
      );
    }

    const isObstacle = obstacles.some(obs => isSamePosition(obs, pos));
    if (isObstacle && isExplored) {
      return (
        <motion.div
          className={`w-full h-full ${theme.tiles.obstacle} rounded-lg ${
            world === 'cyber' ? 'border-2 border-red-500/50' : ''
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {world === 'candy' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-amber-700 to-amber-900 shadow-lg" />
            </div>
          )}
          {world === 'cyber' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-red-600/80 to-red-800/80 rounded-lg animate-pulse" />
            </div>
          )}
        </motion.div>
      );
    }

    return null;
  };

  const getBackgroundParticles = () => {
    if (world === 'candy') {
      return [...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            background: ['#fbbf24', '#ec4899', '#a855f7', '#06b6d4'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ));
    } else if (world === 'cyber') {
      return (
        <>
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }} />
          </div>
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px #4ade80',
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      );
    } else {
      return [...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ));
    }
  };

  const getBorderStyle = () => {
    switch (world) {
      case 'candy':
        return 'border-pink-400/50';
      case 'cyber':
        return 'border-green-400/50';
      default:
        return 'border-cyan-400/50';
    }
  };

  const getButtonStyle = () => {
    switch (world) {
      case 'candy':
        return 'from-pink-500/30 to-purple-500/30 border-pink-400/50 hover:from-pink-500/40 hover:to-purple-500/40';
      case 'cyber':
        return 'from-green-500/30 to-blue-500/30 border-green-400/50 hover:from-green-500/40 hover:to-blue-500/40';
      default:
        return 'from-cyan-500/30 to-purple-500/30 border-cyan-400/50 hover:from-cyan-500/40 hover:to-purple-500/40';
    }
  };

  const getTextColor = () => {
    switch (world) {
      case 'candy':
        return 'text-pink-100';
      case 'cyber':
        return 'text-green-100';
      default:
        return 'text-white';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.background.gradient} relative overflow-hidden`}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        {getBackgroundParticles()}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* Level Badge */}
            <motion.div
              className={`px-6 py-3 bg-gradient-to-r ${
                world === 'candy' ? 'from-pink-500/20 to-purple-500/20' :
                world === 'cyber' ? 'from-green-500/20 to-blue-500/20' :
                'from-cyan-500/20 to-purple-500/20'
              } backdrop-blur-md border-2 ${getBorderStyle()} rounded-full`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className={`${getTextColor()} font-bold tracking-wider text-lg`}>
                LEVEL {level}
              </h1>
              <p className="text-xs opacity-70 text-center">{theme.name}</p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Lives */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${
                      i < lives ? 'text-pink-400 fill-pink-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Timer className="w-5 h-5 text-yellow-400" />
                <span className={`${getTextColor()} font-mono`}>
                  {timeLeft}s
                </span>
              </div>

              {/* Moves */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className={`${getTextColor()} font-mono`}>
                  {moveCount}
                </span>
              </div>
            </motion.div>

            {/* AI Toggle */}
            <motion.button
              onClick={() => setIsAIEnabled(!isAIEnabled)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all ${
                isAIEnabled
                  ? `bg-gradient-to-r ${
                      world === 'candy' ? 'from-pink-500 to-purple-500 border-pink-400' :
                      world === 'cyber' ? 'from-green-500 to-blue-500 border-green-400' :
                      'from-cyan-500 to-purple-500 border-cyan-400'
                    } shadow-lg`
                  : 'bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Bot className={`w-5 h-5 ${isAIEnabled ? 'text-white' : 'text-gray-300'}`} />
              <span className={`text-sm font-medium ${isAIEnabled ? 'text-white' : 'text-gray-300'}`}>
                {isAIEnabled ? 'AI Active' : 'Let AI Play'}
              </span>
            </motion.button>
          </div>

          {/* AI Status */}
          <AnimatePresence>
            {isAIEnabled && aiPlayer.isThinking && (
              <motion.div
                className="mb-4 px-4 py-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-400/30 rounded-lg text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-yellow-300 text-sm flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 animate-pulse" />
                  AgentX is thinking...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Game Content */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            {/* Game Board */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-5 gap-3 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                {Array.from({ length: GRID_SIZE }).map((_, y) =>
                  Array.from({ length: GRID_SIZE }).map((_, x) => {
                    const isExplored = exploredTiles.has(`${x},${y}`);
                    return (
                      <motion.div
                        key={`${x}-${y}`}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl relative border-2 ${
                          isExplored
                            ? theme.tiles.explored
                            : theme.tiles.empty
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + (x + y) * 0.03 }}
                        whileHover={isExplored ? { scale: 1.05 } : {}}
                      >
                        {isExplored && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                        )}
                        {getTileContent(x, y)}
                        {!isExplored && (
                          <div className={`absolute inset-0 flex items-center justify-center ${
                            world === 'candy' ? 'text-purple-300' : world === 'cyber' ? 'text-green-600' : 'text-gray-600'
                          } text-xs font-bold`}>
                            ?
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Directional Controls */}
              <div className="grid grid-cols-3 gap-2">
                <div />
                <button
                  onClick={() => movePlayer(0, -1)}
                  disabled={isAIEnabled}
                  className={`w-16 h-16 bg-gradient-to-br ${getButtonStyle()} backdrop-blur-md border-2 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowUp className={`w-6 h-6 ${getTextColor()}`} />
                </button>
                <div />
                
                <button
                  onClick={() => movePlayer(-1, 0)}
                  disabled={isAIEnabled}
                  className={`w-16 h-16 bg-gradient-to-br ${getButtonStyle()} backdrop-blur-md border-2 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowLeft className={`w-6 h-6 ${getTextColor()}`} />
                </button>
                <button
                  onClick={() => movePlayer(0, 1)}
                  disabled={isAIEnabled}
                  className={`w-16 h-16 bg-gradient-to-br ${getButtonStyle()} backdrop-blur-md border-2 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowDown className={`w-6 h-6 ${getTextColor()}`} />
                </button>
                <button
                  onClick={() => movePlayer(1, 0)}
                  disabled={isAIEnabled}
                  className={`w-16 h-16 bg-gradient-to-br ${getButtonStyle()} backdrop-blur-md border-2 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowRight className={`w-6 h-6 ${getTextColor()}`} />
                </button>
              </div>

              {/* Info Panel */}
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <h3 className={`text-sm font-bold ${getTextColor()} mb-2`}>Level Info</h3>
                <div className="space-y-1 text-xs text-gray-300">
                  <p>👾 Enemies: {levelConfig.enemyCount}</p>
                  <p>🚧 Obstacles: {levelConfig.obstacleCount}</p>
                  <p>⏱️ Time: {timeElapsed}s</p>
                  <p>🎯 Moves: {moveCount}</p>
                  <p className="pt-2 border-t border-white/10 text-gray-400">⌨️ Use WASD or Arrow keys</p>
                </div>
              </div>

              {/* Back Button */}
              <button
                onClick={onBackToMap}
                className={`w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full ${getTextColor()} hover:bg-white/20 transition-all flex items-center justify-center gap-2`}
              >
                <Map className="w-5 h-5" />
                Back to Map
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Win/Loss Messages */}
      <AnimatePresence>
        {(gameWon || gameLost) && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-gradient-to-br ${
                gameWon
                  ? world === 'candy' ? 'from-pink-500/20 to-purple-500/20 border-pink-400' :
                    world === 'cyber' ? 'from-green-500/20 to-blue-500/20 border-green-400' :
                    'from-yellow-500/20 to-purple-500/20 border-yellow-400'
                  : 'from-red-500/20 to-gray-800/20 border-red-400'
              } backdrop-blur-xl border-2 rounded-3xl p-8 text-center max-w-md mx-4`}
              initial={{ scale: 0, rotate: gameWon ? -180 : 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <motion.div
                animate={gameWon ? { rotate: 360 } : { rotate: [0, 10, -10, 0] }}
                transition={gameWon ? { duration: 2, repeat: Infinity, ease: 'linear' } : { duration: 0.5, repeat: Infinity }}
              >
                {gameWon ? (
                  <Sparkles className={`w-16 h-16 ${theme.goal.color} mx-auto mb-4`} />
                ) : (
                  <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
                )}
              </motion.div>
              <h2 className={`${getTextColor()} text-3xl font-bold mb-2`}>
                {gameWon ? 'Victory!' : 'Game Over'}
              </h2>
              <p className={`${theme.player.color} mb-4`}>
                {gameWon ? `Level ${level} Complete!` : 'Try again!'}
              </p>
              {gameWon && (
                <div className="mb-4 space-y-1 text-sm text-gray-300">
                  <p>⏱️ Time: {timeElapsed}s</p>
                  <p>🎯 Moves: {moveCount}</p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                {gameLost && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:shadow-lg transition-all"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={onBackToMap}
                  className={`px-6 py-3 bg-gradient-to-r ${
                    world === 'candy' ? 'from-pink-500 to-purple-500' :
                    world === 'cyber' ? 'from-green-500 to-blue-500' :
                    'from-cyan-500 to-purple-500'
                  } text-white rounded-full hover:shadow-lg transition-all`}
                >
                  {gameWon ? 'Continue' : 'Back to Map'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
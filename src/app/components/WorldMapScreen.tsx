import { motion, AnimatePresence } from 'motion/react';
import { Star, Lock, Rocket, Candy, Cpu, Play } from 'lucide-react';
import { WorldTheme, Level } from '../types/game';
import { WORLD_THEMES } from '../config/themes';

interface WorldMapScreenProps {
  currentWorld: WorldTheme;
  levels: Level[];
  onSelectLevel: (level: number) => void;
  onSelectWorld: (world: WorldTheme) => void;
  completedLevels: number;
}

export function WorldMapScreen({ 
  currentWorld, 
  levels, 
  onSelectLevel, 
  onSelectWorld,
  completedLevels 
}: WorldMapScreenProps) {
  const theme = WORLD_THEMES[currentWorld];

  // Calculate positions for a curved path
  const getLevelPosition = (index: number) => {
    const baseY = 120 + index * 90;
    const amplitude = 80;
    const frequency = 0.5;
    const xOffset = Math.sin(index * frequency) * amplitude;
    
    return {
      x: 50 + xOffset,
      y: baseY,
    };
  };

  const getWorldIcon = (world: WorldTheme) => {
    switch (world) {
      case 'space':
        return <Rocket className="w-4 h-4" />;
      case 'candy':
        return <Candy className="w-4 h-4" />;
      case 'cyber':
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getBackgroundParticles = () => {
    if (currentWorld === 'candy') {
      return [...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${6 + Math.random() * 12}px`,
            height: `${6 + Math.random() * 12}px`,
            background: ['#fbbf24', '#ec4899', '#a855f7', '#06b6d4'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ));
    } else if (currentWorld === 'cyber') {
      return (
        <>
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />
          </div>
          {/* Animated lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"
              style={{
                width: '100%',
                top: `${20 + i * 20}%`,
              }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
          {/* Glowing particles */}
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-green-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 8px #4ade80',
              }}
              animate={{
                opacity: [0.1, 1, 0.1],
                scale: [0.3, 1.2, 0.3],
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
      // Space world
      return [...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ));
    }
  };

  const totalStars = levels.reduce((sum, level) => sum + level.stars, 0);
  const maxStars = levels.length * 3;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.background.gradient} relative overflow-hidden`}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        {getBackgroundParticles()}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.h1
            className={`text-4xl md:text-5xl font-bold mb-2 ${
              currentWorld === 'candy' 
                ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent'
                : currentWorld === 'cyber'
                ? 'bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
            }`}
          >
            PATHORIA
          </motion.h1>
          <p className={`text-sm md:text-base ${
            currentWorld === 'candy' ? 'text-pink-300/70' :
            currentWorld === 'cyber' ? 'text-green-300/70' :
            'text-cyan-300/70'
          }`}>
            Think. Move. Learn.
          </p>
        </motion.div>

        {/* World Selector */}
        <motion.div
          className="flex gap-3 justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(['space', 'candy', 'cyber'] as WorldTheme[]).map((world) => {
            const isActive = currentWorld === world;
            const worldTheme = WORLD_THEMES[world];
            
            return (
              <motion.button
                key={world}
                onClick={() => onSelectWorld(world)}
                className={`relative px-5 py-2.5 md:px-6 md:py-3 rounded-full border-2 flex items-center gap-2 transition-all ${
                  isActive
                    ? world === 'candy'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-400 shadow-lg shadow-pink-500/50'
                      : world === 'cyber'
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 border-green-400 shadow-lg shadow-green-500/50'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getWorldIcon(world)}
                <span className={`text-sm md:text-base ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {worldTheme.name.replace(' World', '')}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/50"
                    layoutId="activeWorld"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Current World Title */}
        <motion.div
          className="text-center mb-6"
          key={currentWorld}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-xl md:text-2xl font-bold ${
            currentWorld === 'candy' ? 'text-pink-200' :
            currentWorld === 'cyber' ? 'text-green-200' :
            'text-cyan-200'
          }`}>
            {theme.name}
          </h2>
        </motion.div>

        {/* Level Map - Responsive Container */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWorld}
              className="relative h-[500px] md:h-[600px] overflow-y-auto scrollbar-hide w-full max-w-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Path connecting levels */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: levels.length * 90 + 200 }}>
                <defs>
                  <linearGradient id={`pathGradient-${currentWorld}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    {currentWorld === 'candy' ? (
                      <>
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                      </>
                    ) : currentWorld === 'cyber' ? (
                      <>
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                      </>
                    )}
                  </linearGradient>
                </defs>
                {levels.slice(0, -1).map((_, index) => {
                  const start = getLevelPosition(index);
                  const end = getLevelPosition(index + 1);
                  return (
                    <motion.line
                      key={index}
                      x1={`${start.x}%`}
                      y1={start.y}
                      x2={`${end.x}%`}
                      y2={end.y}
                      stroke={`url(#pathGradient-${currentWorld})`}
                      strokeWidth="4"
                      strokeDasharray="10,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    />
                  );
                })}
              </svg>

              {/* Level Nodes */}
              {levels.map((level, index) => {
                const pos = getLevelPosition(index);
                const isCurrentLevel = !level.locked && !level.completed;
                
                return (
                  <motion.div
                    key={level.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}px`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  >
                    <motion.button
                      onClick={() => !level.locked && onSelectLevel(level.id)}
                      disabled={level.locked}
                      className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all border-2 ${
                        level.locked
                          ? `bg-gradient-to-br ${theme.levelNode.locked} border-gray-700/50 cursor-not-allowed`
                          : level.completed
                          ? `bg-gradient-to-br ${theme.levelNode.completed} ${
                              currentWorld === 'candy' ? 'border-green-400' :
                              currentWorld === 'cyber' ? 'border-cyan-400' :
                              'border-yellow-400'
                            } shadow-lg`
                          : `bg-gradient-to-br ${theme.levelNode.active} ${theme.levelNode.border} shadow-lg`
                      }`}
                      whileHover={!level.locked ? { scale: 1.1, rotate: 5 } : {}}
                      whileTap={!level.locked ? { scale: 0.95 } : {}}
                      animate={
                        isCurrentLevel
                          ? {
                              boxShadow: [
                                currentWorld === 'candy' ? '0 0 20px #ec489980' : currentWorld === 'cyber' ? '0 0 20px #4ade8080' : '0 0 20px #06b6d480',
                                currentWorld === 'candy' ? '0 0 40px #a855f7cc' : currentWorld === 'cyber' ? '0 0 40px #3b82f6cc' : '0 0 40px #a855f7cc',
                                currentWorld === 'candy' ? '0 0 20px #ec489980' : currentWorld === 'cyber' ? '0 0 20px #4ade8080' : '0 0 20px #06b6d480',
                              ],
                            }
                          : {}
                      }
                      transition={{
                        boxShadow: { duration: 2, repeat: Infinity },
                      }}
                    >
                      {/* Glassmorphism overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                      
                      {/* Level content */}
                      <div className="relative z-10 flex flex-col items-center">
                        {level.locked ? (
                          <Lock className="w-8 h-8 text-gray-500" />
                        ) : (
                          <>
                            {isCurrentLevel && (
                              <motion.div
                                className="absolute -top-1"
                                animate={{ y: [-2, 2, -2] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <Play className={`w-4 h-4 ${
                                  currentWorld === 'candy' ? 'text-pink-300' :
                                  currentWorld === 'cyber' ? 'text-green-300' :
                                  'text-cyan-300'
                                } fill-current`} />
                              </motion.div>
                            )}
                            <span className={`text-xl font-bold ${
                              currentWorld === 'candy' ? 'text-pink-100' :
                              currentWorld === 'cyber' ? 'text-green-100' :
                              'text-white'
                            }`}>
                              {level.id}
                            </span>
                            {level.completed && (
                              <div className="flex gap-0.5 mt-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < level.stars
                                        ? currentWorld === 'candy'
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : currentWorld === 'cyber'
                                          ? 'text-cyan-400 fill-cyan-400'
                                          : 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Completion badge */}
                      {level.completed && (
                        <motion.div
                          className="absolute -top-2 -right-2"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: 0.6 + index * 0.1 }}
                        >
                          <div className={`w-6 h-6 rounded-full ${
                            currentWorld === 'candy' ? 'bg-green-500' :
                            currentWorld === 'cyber' ? 'bg-cyan-500' :
                            'bg-yellow-500'
                          } flex items-center justify-center`}>
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Level label */}
                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className={`text-xs font-medium ${
                        level.locked 
                          ? 'text-gray-600' 
                          : level.completed
                          ? currentWorld === 'candy' ? 'text-green-400' :
                            currentWorld === 'cyber' ? 'text-cyan-400' :
                            'text-yellow-400'
                          : isCurrentLevel
                          ? currentWorld === 'candy' ? 'text-pink-300' :
                            currentWorld === 'cyber' ? 'text-green-300' :
                            'text-cyan-300'
                          : 'text-gray-400'
                      }`}>
                        {level.locked ? 'Locked' : isCurrentLevel ? 'Play Now!' : `Level ${level.id}`}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Info */}
        <motion.div
          className="mt-8 p-4 md:p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-2xl mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between text-sm md:text-base">
            <div>
              <span className="text-gray-400">Progress:</span>
              <span className={`ml-2 font-bold ${
                currentWorld === 'candy' ? 'text-pink-200' :
                currentWorld === 'cyber' ? 'text-green-200' :
                'text-white'
              }`}>
                {completedLevels}/{levels.length}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Stars:</span>
              <span className="ml-2 flex items-center gap-1">
                <Star className={`w-4 h-4 md:w-5 md:h-5 ${
                  currentWorld === 'candy' ? 'text-yellow-400 fill-yellow-400' :
                  currentWorld === 'cyber' ? 'text-cyan-400 fill-cyan-400' :
                  'text-yellow-400 fill-yellow-400'
                }`} />
                <span className="font-bold text-yellow-400">{totalStars}/{maxStars}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
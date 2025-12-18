import { useState, useEffect } from 'react';
import { GameScreen } from './components/GameScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { WorldTheme, Level } from './types/game';
import { LEVELS_PER_WORLD } from './config/themes';
import { useSound } from './utils/useSound';

type Screen = 'map' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [currentWorld, setCurrentWorld] = useState<WorldTheme>('space');
  const [selectedLevel, setSelectedLevel] = useState(1);

  // 🔊 sounds
  const clickSound = useSound('/sounds/click.mp3', 1);
  const spaceBGM = useSound('/sounds/ai.mp3', 0.3);

  // 🎵 play bgm per world
  useEffect(() => {
    spaceBGM.play();
    return () => spaceBGM.stop();
  }, [currentWorld]);

  // --- levels init ---
  const [levels, setLevels] = useState<Record<WorldTheme, Level[]>>(() => {
    const worlds: WorldTheme[] = ['space', 'candy', 'cyber'];
    const initialLevels = {} as Record<WorldTheme, Level[]>;
    worlds.forEach(world => {
      initialLevels[world] = Array.from(
        { length: LEVELS_PER_WORLD },
        (_, i) => ({
          id: i + 1,
          worldId: world,
          completed: false,
          locked: i > 0,
          stars: 0,
        })
      );
    });
    return initialLevels;
  });

  // --- handlers ---
  const handleSelectLevel = (level: number) => {
    clickSound.play();
    setSelectedLevel(level);
    setCurrentScreen('game');
  };

  const handleBackToMap = () => {
    clickSound.play();
    setCurrentScreen('map');
  };

  const handleSelectWorld = (world: WorldTheme) => {
    clickSound.play();
    setCurrentWorld(world);
  };

  // ⭐ LEVEL COMPLETE (WITH STARS + NEXT LEVEL)
  const handleLevelComplete = (stars: number) => {
    setLevels(prev => {
      const updated = { ...prev };
      const worldLevels = [...updated[currentWorld]];

      const index = worldLevels.findIndex(l => l.id === selectedLevel);

      if (index !== -1) {
        // mark completed
        worldLevels[index] = {
          ...worldLevels[index],
          completed: true,
          stars,
        };

        // unlock next level
        if (index < worldLevels.length - 1) {
          worldLevels[index + 1] = {
            ...worldLevels[index + 1],
            locked: false,
          };

          // 🔥 move to next level
          setSelectedLevel(worldLevels[index + 1].id);
        }
      }

      updated[currentWorld] = worldLevels;
      return updated;
    });

    // return to map
    setTimeout(() => {
      setCurrentScreen('map');
    }, 700);
  };

  const currentWorldLevels = levels[currentWorld];
  const completedLevelsCount = currentWorldLevels.filter(l => l.completed).length;

  return (
    <div className="size-full">
      {currentScreen === 'map' ? (
        <WorldMapScreen
          currentWorld={currentWorld}
          levels={currentWorldLevels}
          onSelectLevel={handleSelectLevel}
          onSelectWorld={handleSelectWorld}
          completedLevels={completedLevelsCount}
        />
      ) : (
        <GameScreen
          level={selectedLevel}
          world={currentWorld}
          onBackToMap={handleBackToMap}
          onLevelComplete={handleLevelComplete} // ⭐ IMPORTANT
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { GameScreen } from './components/GameScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { WorldTheme, Level } from './types/game';
import { LEVELS_PER_WORLD } from './config/themes';

type Screen = 'map' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [currentWorld, setCurrentWorld] = useState<WorldTheme>('space');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Initialize levels for each world
  const [levels, setLevels] = useState<Record<WorldTheme, Level[]>>(() => {
    const worlds: WorldTheme[] = ['space', 'candy', 'cyber'];
    const initialLevels: Record<WorldTheme, Level[]> = {} as any;
    
    worlds.forEach(world => {
      initialLevels[world] = Array.from({ length: LEVELS_PER_WORLD }, (_, i) => ({
        id: i + 1,
        worldId: world,
        completed: false,
        locked: i > 0, // Only first level is unlocked
        stars: 0,
      }));
    });
    
    return initialLevels;
  });

  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level);
    setCurrentScreen('game');
  };

  const handleBackToMap = () => {
    setCurrentScreen('map');
  };

  const handleSelectWorld = (world: WorldTheme) => {
    setCurrentWorld(world);
  };

  const handleLevelComplete = () => {
    setLevels(prevLevels => {
      const newLevels = { ...prevLevels };
      const worldLevels = [...newLevels[currentWorld]];
      
      // Mark current level as completed with 3 stars
      const currentLevelIndex = worldLevels.findIndex(l => l.id === selectedLevel);
      if (currentLevelIndex !== -1) {
        worldLevels[currentLevelIndex] = {
          ...worldLevels[currentLevelIndex],
          completed: true,
          stars: 3,
        };
        
        // Unlock next level
        if (currentLevelIndex < worldLevels.length - 1) {
          worldLevels[currentLevelIndex + 1] = {
            ...worldLevels[currentLevelIndex + 1],
            locked: false,
          };
        }
      }
      
      newLevels[currentWorld] = worldLevels;
      return newLevels;
    });
    
    // Return to map after a delay
    setTimeout(() => {
      setCurrentScreen('map');
    }, 500);
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
          onLevelComplete={handleLevelComplete}
        />
      )}
    </div>
  );
}

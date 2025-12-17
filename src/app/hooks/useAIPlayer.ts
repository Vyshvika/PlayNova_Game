import { useEffect, useState, useRef } from 'react';
import { Position, Enemy, findPathToGoal, isSamePosition } from '../utils/gameLogic';

interface UseAIPlayerProps {
  isEnabled: boolean;
  playerPos: Position;
  goalPos: Position;
  obstacles: Position[];
  enemies: Enemy[];
  onMove: (dx: number, dy: number) => void;
  gameWon: boolean;
}

export function useAIPlayer({
  isEnabled,
  playerPos,
  goalPos,
  obstacles,
  enemies,
  onMove,
  gameWon,
}: UseAIPlayerProps) {
  const [isThinking, setIsThinking] = useState(false);
  const [currentPath, setCurrentPath] = useState<Position[]>([]);
  const pathIndexRef = useRef(0);
  const lastMoveTimeRef = useRef(0);

  useEffect(() => {
    if (!isEnabled || gameWon) {
      setCurrentPath([]);
      pathIndexRef.current = 0;
      return;
    }

    // Recalculate path when obstacles or enemies change, or when we don't have a path
    const shouldRecalculatePath =
      currentPath.length === 0 ||
      pathIndexRef.current >= currentPath.length - 1 ||
      // Check if current path is blocked
      currentPath.some(
        (pos, index) =>
          index > pathIndexRef.current &&
          (obstacles.some(obs => isSamePosition(obs, pos)) ||
            enemies.some(enemy => isSamePosition(enemy.position, pos)))
      );

    if (shouldRecalculatePath) {
      setIsThinking(true);
      
      // Add a small delay to simulate "thinking"
      setTimeout(() => {
        const path = findPathToGoal(playerPos, goalPos, obstacles, enemies);
        setCurrentPath(path);
        pathIndexRef.current = 0;
        setIsThinking(false);
      }, 300);
    }
  }, [isEnabled, playerPos, goalPos, obstacles, enemies, gameWon, currentPath]);

  useEffect(() => {
    if (!isEnabled || gameWon || currentPath.length === 0) {
      return;
    }

    const moveInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastMoveTimeRef.current < 500) {
        return; // Wait at least 500ms between moves
      }

      const nextIndex = pathIndexRef.current + 1;
      if (nextIndex < currentPath.length) {
        const currentPos = currentPath[pathIndexRef.current];
        const nextPos = currentPath[nextIndex];
        
        const dx = nextPos.x - currentPos.x;
        const dy = nextPos.y - currentPos.y;
        
        onMove(dx, dy);
        pathIndexRef.current = nextIndex;
        lastMoveTimeRef.current = now;
      }
    }, 500);

    return () => clearInterval(moveInterval);
  }, [isEnabled, currentPath, onMove, gameWon]);

  return {
    isThinking,
    hasPath: currentPath.length > 0,
    pathLength: currentPath.length,
  };
}

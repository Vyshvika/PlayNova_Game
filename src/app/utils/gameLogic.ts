export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: number;
  position: Position;
  lastMove: number;
}

export const GRID_SIZE = 5;

// Check if two positions are the same
export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// Check if position is valid and within bounds
export function isValidPosition(pos: Position): boolean {
  return pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE;
}

// Check if position collides with any obstacles
export function collidesWithObstacles(pos: Position, obstacles: Position[]): boolean {
  return obstacles.some(obs => isSamePosition(obs, pos));
}

// Check if position collides with any enemies
export function collidesWithEnemies(pos: Position, enemies: Enemy[]): boolean {
  return enemies.some(enemy => isSamePosition(enemy.position, pos));
}

// Generate random position that doesn't collide with existing entities
export function generateSafePosition(
  existingPositions: Position[],
  attempts: number = 50
): Position {
  for (let i = 0; i < attempts; i++) {
    const pos: Position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    const isOccupied = existingPositions.some(p => isSamePosition(p, pos));
    if (!isOccupied) {
      return pos;
    }
  }
  
  // Fallback: return first available position
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const pos = { x, y };
      const isOccupied = existingPositions.some(p => isSamePosition(p, pos));
      if (!isOccupied) {
        return pos;
      }
    }
  }
  
  return { x: 0, y: 0 }; // Last resort
}

// Generate level configuration based on difficulty
export function generateLevelConfig(level: number) {
  const obstacleCount = Math.min(2 + level, 8);
  const enemyCount = Math.min(Math.floor(level / 2) + 1, 4);
  const enemySpeed = Math.max(3000 - level * 200, 1500); // Faster with higher levels
  
  return {
    obstacleCount,
    enemyCount,
    enemySpeed,
  };
}

// Generate obstacles for a level
export function generateObstacles(
  count: number,
  playerPos: Position,
  goalPos: Position,
  enemies: Enemy[]
): Position[] {
  const obstacles: Position[] = [];
  const occupied = [playerPos, goalPos, ...enemies.map(e => e.position)];
  
  for (let i = 0; i < count; i++) {
    const pos = generateSafePosition([...occupied, ...obstacles]);
    obstacles.push(pos);
  }
  
  return obstacles;
}

// Get adjacent positions
export function getAdjacentPositions(pos: Position): Position[] {
  return [
    { x: pos.x, y: pos.y - 1 }, // Up
    { x: pos.x, y: pos.y + 1 }, // Down
    { x: pos.x - 1, y: pos.y }, // Left
    { x: pos.x + 1, y: pos.y }, // Right
  ].filter(p => isValidPosition(p));
}

// Simple pathfinding (BFS) to find path to goal
export function findPathToGoal(
  start: Position,
  goal: Position,
  obstacles: Position[],
  enemies: Enemy[]
): Position[] {
  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (isSamePosition(current.pos, goal)) {
      return current.path;
    }
    
    const adjacent = getAdjacentPositions(current.pos);
    
    for (const next of adjacent) {
      const key = `${next.x},${next.y}`;
      
      if (
        !visited.has(key) &&
        !collidesWithObstacles(next, obstacles) &&
        !collidesWithEnemies(next, enemies)
      ) {
        visited.add(key);
        queue.push({
          pos: next,
          path: [...current.path, next],
        });
      }
    }
  }
  
  return []; // No path found
}

// AI decision for enemy movement (random or chase player)
export function getEnemyNextMove(
  enemy: Enemy,
  playerPos: Position,
  obstacles: Position[],
  otherEnemies: Enemy[],
  chaseChance: number = 0.3
): Position {
  const shouldChase = Math.random() < chaseChance;
  
  if (shouldChase) {
    // Try to move closer to player
    const dx = playerPos.x - enemy.position.x;
    const dy = playerPos.y - enemy.position.y;
    
    let targetPos: Position;
    if (Math.abs(dx) > Math.abs(dy)) {
      targetPos = { x: enemy.position.x + Math.sign(dx), y: enemy.position.y };
    } else {
      targetPos = { x: enemy.position.x, y: enemy.position.y + Math.sign(dy) };
    }
    
    // Check if target position is valid
    if (
      isValidPosition(targetPos) &&
      !collidesWithObstacles(targetPos, obstacles) &&
      !collidesWithEnemies(targetPos, otherEnemies.filter(e => e.id !== enemy.id))
    ) {
      return targetPos;
    }
  }
  
  // Random movement
  const adjacent = getAdjacentPositions(enemy.position);
  const validMoves = adjacent.filter(
    pos =>
      !collidesWithObstacles(pos, obstacles) &&
      !collidesWithEnemies(pos, otherEnemies.filter(e => e.id !== enemy.id))
  );
  
  if (validMoves.length > 0) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
  
  return enemy.position; // Stay in place if no valid moves
}

// Calculate Manhattan distance
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}
export function getRandomEnemyMove(
  enemy: Enemy,
  playerPos: Position,
  obstacles: Position[],
  otherEnemies: Enemy[]
): Position {
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  // Shuffle directions
  for (let i = directions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [directions[i], directions[j]] = [directions[j], directions[i]];
  }

  for (const dir of directions) {
    const newPos = {
      x: enemy.position.x + dir.x,
      y: enemy.position.y + dir.y,
    };

    if (!isValidPosition(newPos)) continue;
    if (collidesWithObstacles(newPos, obstacles)) continue;
    if (collidesWithEnemies(newPos, otherEnemies)) continue;
    if (isSamePosition(newPos, playerPos)) continue;

    return newPos;
  }

  // If no valid move, stay
  return enemy.position;
}

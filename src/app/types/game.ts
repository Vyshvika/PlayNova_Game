export type WorldTheme = 'space' | 'candy' | 'cyber';

export interface Level {
  id: number;
  worldId: WorldTheme;
  completed: boolean;
  locked: boolean;
  stars: number;
}

export interface WorldConfig {
  id: WorldTheme;
  name: string;
  icon: string;
  background: {
    gradient: string;
    particleColor: string;
  };
  tiles: {
    empty: string;
    explored: string;
    obstacle: string;
  };
  player: {
    color: string;
    glowColor: string;
  };
  goal: {
    color: string;
    glowColor: string;
  };
  levelNode: {
    active: string;
    completed: string;
    locked: string;
    border: string;
  };
}

export interface GameState {
  currentWorld: WorldTheme;
  levels: Record<WorldTheme, Level[]>;
  completedLevels: Set<string>;
}
export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: number;
  position: Position;
  lastMove: number;
}


export interface Level {
  id: number;
  worldId: WorldTheme;
  completed: boolean;
  locked: boolean;
  stars: number;
}

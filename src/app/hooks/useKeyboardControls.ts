import { useEffect } from 'react';

interface UseKeyboardControlsProps {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  enabled: boolean;
}

export function useKeyboardControls({
  onUp,
  onDown,
  onLeft,
  onRight,
  enabled,
}: UseKeyboardControlsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onDown();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onRight();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUp, onDown, onLeft, onRight, enabled]);
}

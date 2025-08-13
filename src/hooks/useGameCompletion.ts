import { useState, useEffect } from "react";

interface Circle {
  id: string;
  x: number;
  y: number;
  number: number;
  isClicked: boolean;
  clickedAt?: number;
  isWrong?: boolean;
}

interface UseGameCompletionProps {
  isPlaying: boolean;
  circles: Circle[];
  points: number;
  onGameComplete?: () => void;
  onStopTimer?: () => void;
}

export const useGameCompletion = ({
  isPlaying,
  circles,
  points,
  onGameComplete,
  onStopTimer,
}: UseGameCompletionProps) => {
  const [hasStartedGame, setHasStartedGame] = useState(false);

  // Track when game starts
  useEffect(() => {
    if (isPlaying && circles.length > 0 && !hasStartedGame) {
      setHasStartedGame(true);
    } else if (!isPlaying) {
      setHasStartedGame(false);
    }
  }, [isPlaying, circles.length, hasStartedGame]);

  // Check if game is complete - when all circles have disappeared and no wrong circles
  useEffect(() => {
    const hasWrongCircle = circles.some((c) => c.isWrong);

    if (
      isPlaying &&
      hasStartedGame &&
      circles.length === 0 &&
      !hasWrongCircle
    ) {
      // Game is complete when no circles remain, we had started the game, and no wrong clicks
      if (onStopTimer) {
        onStopTimer(); // Stop the timer first
      }
      if (onGameComplete) {
        onGameComplete(); // Then mark game as complete
      }
    }
  }, [circles, isPlaying, hasStartedGame, onGameComplete, onStopTimer]);

  return {
    hasStartedGame,
  };
};

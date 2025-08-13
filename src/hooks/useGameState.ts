import { useState, useEffect, useRef, useCallback } from "react";

export interface GameState {
  points: number;
  time: number;
  isPlaying: boolean;
  autoPlay: boolean;
  score: number;
  gameStatus: "idle" | "playing" | "finished" | "gameOver";
  isGameComplete: boolean;
  isGameOver: boolean;
  wrongCircleId: string | null;
}

export const useGameState = () => {
  const [points, setPoints] = useState(5);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<
    "idle" | "playing" | "finished" | "gameOver"
  >("idle");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wrongCircleId, setWrongCircleId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [gameKey, setGameKey] = useState(0); // Add game key for forcing re-render
  const validationTimeoutRef = useRef<number | null>(null);

  const intervalRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlay = () => {
    // Validate points before starting game
    if (points < 5) {
      setValidationError("Bạn phải nhập số lượng >= 5 vào Point để chơi");

      // Clear validation error after 3 seconds
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      validationTimeoutRef.current = setTimeout(() => {
        setValidationError("");
      }, 3000);

      return;
    }

    // Clear validation error and start game
    setValidationError("");
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    setIsPlaying(true);
    setGameStatus("playing");
    setTime(0);
    setScore(0);
    setIsGameComplete(false);
  };

  const handleRestart = () => {
    // First, stop the current game completely
    setIsPlaying(false);
    setGameStatus("idle");

    // Reset all game state
    setTime(0);
    setScore(0);
    setAutoPlay(false);
    setIsGameComplete(false);
    setIsGameOver(false);
    setWrongCircleId(null);
    setGameKey((prev) => prev + 1); // Force re-render by changing key

    // Clear validation error if any
    setValidationError("");
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Use setTimeout to ensure state updates are processed before starting new game
    setTimeout(() => {
      if (points >= 5) {
        setIsPlaying(true);
        setGameStatus("playing");
      }
    }, 50); // Small delay to ensure state is updated
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  const updatePoints = (newPoints: number) => {
    if (!isPlaying) {
      setPoints(newPoints);
      // Clear validation error when user changes points
      if (validationError) {
        setValidationError("");
        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current);
        }
      }
    }
  };

  const handleCircleClick = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  const handleGameComplete = () => {
    setIsGameComplete(true);
    setAutoPlay(false); // Turn off auto play when game completes
    setIsPlaying(false); // Stop the game
    setGameStatus("finished");
  };

  const stopTimer = () => {
    setIsPlaying(false); // This will stop the timer
  };

  const handleGameOver = (circleId: string) => {
    setIsGameOver(true);
    setWrongCircleId(circleId);
    setGameStatus("gameOver");
    setIsPlaying(false);
    setAutoPlay(false);
  };

  return {
    // State
    points,
    time,
    isPlaying,
    autoPlay,
    score,
    gameStatus,
    isGameComplete,
    isGameOver,
    wrongCircleId,
    validationError,
    gameKey,

    // Actions
    handlePlay,
    handleRestart,
    toggleAutoPlay,
    updatePoints,
    handleCircleClick,
    handleGameComplete,
    stopTimer,
    handleGameOver,
  };
};

import { useState, useEffect, useRef, useCallback } from "react";

interface Circle {
  id: string;
  x: number;
  y: number;
  number: number;
  isClicked: boolean;
  clickedAt?: number;
  isWrong?: boolean;
}

interface UseCircleManagementProps {
  isPlaying: boolean;
  points: number;
  autoPlay: boolean;
  gameKey?: number;
  isGameOver?: boolean;
  onCircleClick?: () => void;
  onGameOver?: (circleId: string) => void;
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
}

export const useCircleManagement = ({
  isPlaying,
  points,
  autoPlay,
  gameKey,
  isGameOver,
  onCircleClick,
  onGameOver,
  gameAreaRef,
}: UseCircleManagementProps) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const intervalRef = useRef<number | null>(null);
  const autoPlayIntervalRef = useRef<number | null>(null);

  // Generate random position within game area bounds
  const generateRandomPosition = useCallback(() => {
    if (!gameAreaRef.current) return { x: 0, y: 0 };

    const rect = gameAreaRef.current.getBoundingClientRect();
    const circleSize = 60; // Circle diameter
    const padding = 0; // No padding - circles can touch edges

    const maxX = rect.width - circleSize - padding;
    const maxY = rect.height - circleSize - padding;

    return {
      x: Math.random() * maxX + padding,
      y: Math.random() * maxY + padding,
    };
  }, [gameAreaRef]);

  // Create new circle with random position
  const createCircle = useCallback(
    (number: number): Circle => {
      const position = generateRandomPosition();
      return {
        id: Math.random().toString(36).substring(2, 11),
        x: position.x,
        y: position.y,
        number: number,
        isClicked: false,
      };
    },
    [generateRandomPosition]
  );

  // Reset circles when gameKey changes (restart)
  useEffect(() => {
    setCircles([]);
  }, [gameKey]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, []);

  // Start game - create initial circles
  useEffect(() => {
    if (isPlaying) {
      const initialCircles = Array.from({ length: points }, (_, index) =>
        createCircle(index + 1)
      );
      setCircles(initialCircles);
    } else if (!isGameOver) {
      // Only clear circles when not playing AND not in game over state
      // This preserves the wrong circle display during game over
      setCircles([]);
    }
  }, [isPlaying, points, createCircle, isGameOver]);

  // Timer for countdown display and removing circles after 3s
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCircles((prevCircles) => {
          // Don't run timer if there's a wrong circle (game over state)
          const hasWrongCircle = prevCircles.some((c) => c.isWrong);
          if (hasWrongCircle) return prevCircles;

          // Only process if there are clicked circles
          const hasClickedCircles = prevCircles.some(
            (c) => c.isClicked && c.clickedAt
          );
          if (!hasClickedCircles) return prevCircles;

          return prevCircles.filter((circle) => {
            // Keep unclicked circles and wrong circles
            if (!circle.isClicked || !circle.clickedAt || circle.isWrong)
              return true;

            // Remove clicked circles after 3 seconds
            const elapsed = (Date.now() - circle.clickedAt) / 1000;
            return elapsed < 3;
          });
        });
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
    };
  }, [isPlaying]); // Removed 'circles' from dependency array

  // Auto play logic - click the next number in sequence
  useEffect(() => {
    // Clear any existing auto play interval when autoPlay or isPlaying changes
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    if (autoPlay && isPlaying) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCircles((prevCircles) => {
          // Don't auto play if there's a wrong circle (game over state)
          const hasWrongCircle = prevCircles.some((c) => c.isWrong);
          if (hasWrongCircle) return prevCircles;

          // Find the smallest unclicked number (excluding wrong circles)
          const unclickedNumbers = prevCircles
            .filter((c) => !c.isClicked && !c.isWrong)
            .map((c) => c.number)
            .sort((a, b) => a - b);

          if (unclickedNumbers.length > 0) {
            const nextNumber = unclickedNumbers[0];
            const targetCircle = prevCircles.find(
              (c) => !c.isClicked && !c.isWrong && c.number === nextNumber
            );

            if (targetCircle) {
              // Call onCircleClick callback to update score
              if (onCircleClick) {
                onCircleClick();
              }

              // Update the circle state to clicked
              return prevCircles.map((circle) =>
                circle.id === targetCircle.id
                  ? { ...circle, isClicked: true, clickedAt: Date.now() }
                  : circle
              );
            }
          }
          return prevCircles;
        });
      }, 800); // Auto click every 800ms for better visibility
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [autoPlay, isPlaying, onCircleClick]);

  // Handle manual circle click - allow clicking any unclicked circle in sequence
  const handleCircleClick = (circleId: string) => {
    if (!isPlaying) return;

    const clickedCircle = circles.find((c) => c.id === circleId);

    // Only allow clicking unclicked and non-wrong circles
    if (clickedCircle && !clickedCircle.isClicked && !clickedCircle.isWrong) {
      // Find the smallest unclicked number (excluding wrong circles)
      const unclickedNumbers = circles
        .filter((c) => !c.isClicked && !c.isWrong)
        .map((c) => c.number)
        .sort((a, b) => a - b);

      const nextExpectedNumber = unclickedNumbers[0];

      // Check if clicked the correct number
      if (clickedCircle.number === nextExpectedNumber) {
        // Correct click
        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === circleId
              ? { ...circle, isClicked: true, clickedAt: Date.now() }
              : circle
          )
        );

        if (onCircleClick) {
          onCircleClick();
        }
      } else {
        // Wrong click - mark as wrong and trigger game over
        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === circleId ? { ...circle, isWrong: true } : circle
          )
        );

        if (onGameOver) {
          onGameOver(circleId);
        }
      }
    }
  };

  return {
    circles,
    handleCircleClick,
  };
};

import React, { useRef } from "react";
import { useGameCompletion } from "../hooks/useGameCompletion";
import { useCircleManagement } from "../hooks/useCircleManagement";
import { useCircleUtils } from "../hooks/useCircleUtils";

interface GameAreaProps {
  isPlaying: boolean;
  points: number;
  autoPlay: boolean;
  isGameOver?: boolean;
  gameKey?: number;
  onCircleClick?: () => void;
  onGameComplete?: () => void;
  onStopTimer?: () => void;
  onGameOver?: (circleId: string) => void;
}

const GameArea: React.FC<GameAreaProps> = ({
  isPlaying,
  points,
  autoPlay,
  isGameOver,
  gameKey,
  onCircleClick,
  onGameComplete,
  onStopTimer,
  onGameOver,
}) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Use circle management hook
  const { circles, handleCircleClick } = useCircleManagement({
    isPlaying,
    points,
    autoPlay,
    gameKey,
    isGameOver,
    onCircleClick,
    onGameOver,
    gameAreaRef,
  });

  // Use circle utilities hook
  const { getCircleColor, getCircleOpacity, getCountdownDisplay } =
    useCircleUtils();

  // Use game completion hook
  useGameCompletion({
    isPlaying,
    circles,
    onGameComplete,
    onStopTimer,
  });

  // Calculate next number to click
  const getNextNumber = () => {
    if (!isPlaying || circles.length === 0) return 1;

    const unclickedNumbers = circles
      .filter((c) => !c.isClicked && !c.isWrong)
      .map((c) => c.number)
      .sort((a, b) => a - b);

    return unclickedNumbers.length > 0 ? unclickedNumbers[0] : points;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Game Area</h2>
          {isPlaying && (
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    Next:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {getNextNumber()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div
          ref={gameAreaRef}
          className="relative w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50"
          style={{
            minHeight: "600px",
            height:
              points > 100 ? "600px" : `${Math.max(600, 400 + points * 2)}px`, // Fixed height for large numbers
          }}
        >
          {!isPlaying && !isGameOver ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  Click Play to start the game
                </p>
              </div>
            </div>
          ) : (
            <>
              {autoPlay && isPlaying && (
                <div className="absolute top-4 right-4 z-50">
                  <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="text-sm font-medium">Auto Playing</span>
                  </div>
                </div>
              )}

              {circles.map((circle) => {
                const countdown = getCountdownDisplay(circle);
                return (
                  <div
                    key={circle.id}
                    className={`absolute w-15 h-15 rounded-full cursor-pointer transform transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center ${
                      circle.isClicked || circle.isWrong
                        ? "text-white"
                        : "text-black"
                    } font-bold shadow-lg ${getCircleColor(
                      circle.isClicked,
                      circle.isWrong
                    )} ${getCircleOpacity(circle.isClicked)}`}
                    style={{
                      left: `${circle.x}px`,
                      top: `${circle.y}px`,
                      width: "60px",
                      height: "60px",
                      zIndex: 10000 - circle.number, // Smaller numbers have higher z-index
                    }}
                    onClick={() => handleCircleClick(circle.id)}
                  >
                    <div className="text-lg">{circle.number}</div>
                    {countdown && (
                      <div className="text-xs mt-1">{countdown}s</div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameArea;

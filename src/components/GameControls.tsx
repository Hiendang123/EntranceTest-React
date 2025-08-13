import React from "react";

interface GameControlsProps {
  points: number;
  time: number;
  isPlaying: boolean;
  autoPlay: boolean;
  isGameOver?: boolean;
  onPointsChange: (points: number) => void;
  onPlay: () => void;
  onRestart: () => void;
  onToggleAutoPlay: () => void;
  validationError?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  points,
  time,
  isPlaying,
  autoPlay,
  isGameOver,
  onPointsChange,
  onPlay,
  onRestart,
  onToggleAutoPlay,
  validationError,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Points Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Points:
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={points}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow numbers
              if (/^\d*$/.test(value)) {
                if (value === "" || value === "0") {
                  onPointsChange(0);
                } else {
                  // Remove leading zeros
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue)) {
                    onPointsChange(numValue);
                  }
                }
              }
            }}
            disabled={isPlaying}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-medium transition-all duration-200 ${
              isPlaying
                ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                : validationError
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
            min="5"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Time:
          </label>
          <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-lg font-mono font-bold text-gray-800">
            {time.toFixed(1)}s
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Controls:
          </label>
          <div className="flex gap-2">
            {!isPlaying && !isGameOver ? (
              <button
                onClick={onPlay}
                className="flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                Play
              </button>
            ) : (
              <button
                onClick={onRestart}
                className="flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                Restart
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Auto Play:
          </label>
          <div className="flex items-center">
            <button
              onClick={onToggleAutoPlay}
              disabled={!isPlaying}
              className={`relative inline-flex h-12 w-20 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                autoPlay && isPlaying
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
                  : "bg-gray-300"
              } ${
                !isPlaying
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:scale-105"
              }`}
              title={
                !isPlaying
                  ? "Start the game first to enable Auto Play"
                  : autoPlay
                  ? "Turn off Auto Play"
                  : "Turn on Auto Play"
              }
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                  autoPlay && isPlaying ? "translate-x-10" : "translate-x-2"
                }`}
              >
                {autoPlay && isPlaying && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </span>
            </button>
            <div className="ml-3 flex flex-col">
              <span
                className={`text-sm font-medium ${
                  isPlaying ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {autoPlay && isPlaying ? "ON" : "OFF"}
              </span>
              {!isPlaying && (
                <span className="text-xs text-gray-400">
                  (Start game first)
                </span>
              )}
              {autoPlay && isPlaying && (
                <span className="text-xs text-green-600 font-medium">
                  Auto playing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="mt-4 text-center">
          <p className="text-red-500 text-sm font-medium">{validationError}</p>
        </div>
      )}
    </div>
  );
};

export default GameControls;

import { useGameState } from "../hooks/useGameState";
import GameControls from "./GameControls";
import GameArea from "./GameArea";

const FormTableGame = () => {
  const {
    points,
    time,
    isPlaying,
    autoPlay,
    isGameComplete,
    isGameOver,
    validationError,
    gameKey,
    handlePlay,
    handleRestart,
    toggleAutoPlay,
    updatePoints,
    handleCircleClick,
    handleGameComplete,
    stopTimer,
    handleGameOver,
  } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold mb-2 tracking-wide ${
              isGameComplete
                ? "text-green-600"
                : isGameOver
                ? "text-red-600"
                : "text-gray-800"
            }`}
          >
            {isGameComplete
              ? "All CLEARED"
              : isGameOver
              ? "GAME OVER"
              : "LET'S PLAY"}
          </h1>
          <div
            className={`w-24 h-1 mx-auto rounded-full ${
              isGameComplete
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : isGameOver
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-blue-500 to-purple-500"
            }`}
          ></div>
        </div>

        <GameControls
          points={points}
          time={time}
          isPlaying={isPlaying}
          autoPlay={autoPlay}
          isGameOver={isGameOver}
          onPointsChange={updatePoints}
          onPlay={handlePlay}
          onRestart={handleRestart}
          onToggleAutoPlay={toggleAutoPlay}
          validationError={validationError}
        />

        <GameArea
          isPlaying={isPlaying}
          points={points}
          autoPlay={autoPlay}
          isGameOver={isGameOver}
          gameKey={gameKey}
          onCircleClick={handleCircleClick}
          onGameComplete={handleGameComplete}
          onStopTimer={stopTimer}
          onGameOver={handleGameOver}
        />
      </div>
    </div>
  );
};

export default FormTableGame;

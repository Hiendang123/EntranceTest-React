interface Circle {
  id: string;
  x: number;
  y: number;
  number: number;
  isClicked: boolean;
  clickedAt?: number;
  isWrong?: boolean;
}

export const useCircleUtils = () => {
  // Get circle color - white background with black border, blue when clicked, red when wrong
  const getCircleColor = (isClicked: boolean, isWrong?: boolean) => {
    if (isWrong) return "bg-red-500"; // Wrong circles turn red
    if (isClicked) return "bg-blue-500"; // Clicked circles turn blue
    return "bg-white border-2 border-black"; // Unclicked: white background with black border
  };

  // Get circle opacity and styling
  const getCircleOpacity = (isClicked: boolean) => {
    if (isClicked) return "opacity-100";
    return "opacity-100";
  };

  // Get countdown display for clicked circles
  const getCountdownDisplay = (circle: Circle) => {
    if (!circle.isClicked || !circle.clickedAt) return null;

    const elapsed = (Date.now() - circle.clickedAt) / 1000;
    const remaining = Math.max(0, 3 - elapsed);

    if (remaining <= 0) return null;

    return remaining.toFixed(1);
  };

  return {
    getCircleColor,
    getCircleOpacity,
    getCountdownDisplay,
  };
};

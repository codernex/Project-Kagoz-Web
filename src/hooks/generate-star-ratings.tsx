import { Star } from "lucide-react";
import { useMemo } from "react";

export const useStarRatings = (starCount: number, size = 16) => {
  const elem = useMemo((): JSX.Element[] => {
    const totalLength = 5;
    const maxStars = 5;

    if (starCount < 0 || starCount > maxStars) {
      throw new Error("Star count should be between 0 and 5");
    }

    const fullStars = Math.floor(starCount);
    const partialStar = starCount % 1; // This will be a value between 0 and 1
    const starIcons = [];

    for (let i = 0; i < totalLength; i++) {
      if (i < fullStars) {
        // Full star
        starIcons.push(
          <Star
            size={size}
            key={i}
            className="text-yellow-500 fill-yellow-500"
          />,
        );
      } else if (i === fullStars && partialStar > 0) {
        // Partial star
        starIcons.push(
          <div
            key={i}
            className="relative inline-block"
            style={{ width: "16px", height: "16px" }} // Adjust size if needed
          >
            <Star size={size} className="absolute top-0 left-0 text-gray-300" />
            <Star
              size={size}
              className="absolute top-0 left-0 overflow-hidden text-yellow-500 fill-yellow-500"
              style={{ clipPath: `inset(0 ${100 - partialStar * 100}% 0 0)` }}
            />
          </div>,
        );
      } else {
        // Empty star
        starIcons.push(<Star size={size} key={i} className="text-gray-300" />);
      }
    }

    return starIcons;
  }, [starCount, size]);

  return elem;
};

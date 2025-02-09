// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import "../styles/Stars.css"; // ✅ Import CSS for styling

const STAR_COUNT = 15; // ✅ Only 5 stars

const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const Stars = () => {
  const [stars, setStars] = useState<
    { id: number; top: string; left: string; delay: string }[]
  >([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: STAR_COUNT }, (_, index) => ({
      id: index,
      top: `${getRandom(-10, 40)}px`, // ✅ Spread out more vertically
      left: `${getRandom(-20, 240)}px`, // ✅ Spread out horizontally
      delay: `${getRandom(0, 3)}s`,
    }));

    setStars(generatedStars);
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Stars;

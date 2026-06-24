import { useState } from 'react';

export default function StarRating({ currentRating, onRate }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isActive = starValue <= (hover || currentRating);
        return (
          <button
            key={starValue}
            type="button"
            className={`star ${isActive ? 'active' : ''}`}
            onClick={() => onRate(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            title={`Rate ${starValue} Stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}


import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  reviewCount, 
  size = 16,
  className = ""
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - Math.ceil(rating);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {/* Étoiles pleines */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            size={size}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        
        {/* Étoile à moitié remplie */}
        {hasHalfStar && (
          <div className="relative">
            <Star
              size={size}
              className="text-gray-300"
            />
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${(rating % 1) * 100}%` }}
            >
              <Star
                size={size}
                className="fill-yellow-400 text-yellow-400"
              />
            </div>
          </div>
        )}
        
        {/* Étoiles vides */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            size={size}
            className="text-gray-300"
          />
        ))}
      </div>
      
      <span className="text-sm text-gray-600 ml-1">
        {rating.toFixed(1)}
        {reviewCount && (
          <span className="text-gray-400 ml-1">({reviewCount})</span>
        )}
      </span>
    </div>
  );
};

export default StarRating;

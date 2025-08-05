
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
  // Sécurisation pour éviter les erreurs si rating est undefined
  const safeRating = rating || 0;
  
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;
  const emptyStars = maxRating - Math.ceil(safeRating);

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
              style={{ width: `${(safeRating % 1) * 100}%` }}
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
        {safeRating.toFixed(1)}
        {reviewCount && (
          <span className="text-gray-400 ml-1">({reviewCount})</span>
        )}
      </span>
    </div>
  );
};

export default StarRating;

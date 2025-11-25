import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BoxReviewStats {
  boxId: number;
  averageRating: number;
  totalReviews: number;
}

export const useBoxesReviews = () => {
  const [stats, setStats] = useState<Map<number, BoxReviewStats>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviewsStats = async () => {
      try {
        setLoading(true);
        
        const { data: reviewsData, error } = await supabase
          .from('box_reviews')
          .select('box_id, rating');

        if (error) throw error;

        if (reviewsData && reviewsData.length > 0) {
          const statsMap = new Map<number, BoxReviewStats>();
          
          // Group reviews by box_id
          const reviewsByBox = reviewsData.reduce((acc, review) => {
            if (!acc[review.box_id]) {
              acc[review.box_id] = [];
            }
            acc[review.box_id].push(review.rating);
            return acc;
          }, {} as Record<number, number[]>);

          // Calculate stats for each box
          Object.entries(reviewsByBox).forEach(([boxId, ratings]) => {
            const totalReviews = ratings.length;
            const averageRating = ratings.reduce((sum, r) => sum + r, 0) / totalReviews;
            
            statsMap.set(Number(boxId), {
              boxId: Number(boxId),
              averageRating,
              totalReviews
            });
          });

          setStats(statsMap);
        }
      } catch (error) {
        console.error('Error fetching reviews stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviewsStats();
  }, []);

  const getBoxStats = (boxId: number): BoxReviewStats => {
    return stats.get(boxId) || { boxId, averageRating: 0, totalReviews: 0 };
  };

  return {
    stats,
    loading,
    getBoxStats
  };
};

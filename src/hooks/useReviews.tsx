import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Review {
  id: string;
  user_id: string;
  box_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export const useReviews = (boxId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews with user profiles
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('box_reviews')
        .select('*')
        .eq('box_id', boxId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch profiles for all reviews
      if (reviewsData && reviewsData.length > 0) {
        const userIds = [...new Set(reviewsData.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        const reviewsWithProfiles = reviewsData.map(review => ({
          ...review,
          user_profile: profilesData?.find(p => p.id === review.user_id)
        }));

        setReviews(reviewsWithProfiles);

        // Calculate stats
        const totalReviews = reviewsWithProfiles.length;
        const averageRating = totalReviews > 0
          ? reviewsWithProfiles.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

        setStats({ averageRating, totalReviews });

        // Find user's review if logged in
        if (user) {
          const userReviewData = reviewsWithProfiles.find(r => r.user_id === user.id);
          setUserReview(userReviewData || null);
        }
      } else {
        setReviews([]);
        setStats({ averageRating: 0, totalReviews: 0 });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [boxId, user]);

  const submitReview = async (rating: number, comment: string) => {
    if (!user) {
      throw new Error('Vous devez être connecté pour laisser un avis');
    }

    try {
      const reviewData = {
        user_id: user.id,
        box_id: boxId,
        rating,
        comment: comment.trim() || null
      };

      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('box_reviews')
          .update(reviewData)
          .eq('id', userReview.id);

        if (error) throw error;
      } else {
        // Create new review
        const { error } = await supabase
          .from('box_reviews')
          .insert(reviewData);

        if (error) throw error;
      }

      await fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const deleteReview = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from('box_reviews')
        .delete()
        .eq('id', userReview.id);

      if (error) throw error;

      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  return {
    reviews,
    stats,
    loading,
    userReview,
    submitReview,
    deleteReview,
    refreshReviews: fetchReviews
  };
};

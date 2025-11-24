import React from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '@/hooks/useReviews';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewsListProps {
  reviews: Review[];
  loading: boolean;
}

const ReviewsList = ({ reviews, loading }: ReviewsListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-full mb-1"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun avis pour le moment. Soyez le premier à laisser un avis !
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {review.user_profile?.avatar_url ? (
                <img
                  src={review.user_profile.avatar_url}
                  alt={review.user_profile.full_name || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {review.user_profile?.full_name || 'Utilisateur'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              
              {review.comment && (
                <p className="text-sm text-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;

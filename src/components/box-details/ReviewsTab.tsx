import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { useReviews } from '@/hooks/useReviews';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import StarRating from '@/components/StarRating';

interface ReviewsTabProps {
  boxId: number;
}

const ReviewsTab = ({ boxId }: ReviewsTabProps) => {
  const { reviews, stats, loading, userReview, submitReview } = useReviews(boxId);

  return (
    <TabsContent value="reviews" className="p-3 sm:p-6 pt-3 sm:pt-4">
      <div className="space-y-6">
        {/* Statistics */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <StarRating 
              rating={stats.averageRating} 
              reviewCount={stats.totalReviews}
              size={20}
            />
          </div>
        </div>

        {/* Review Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Laisser un avis
          </h3>
          <ReviewForm
            onSubmit={submitReview}
            hasExistingReview={!!userReview}
          />
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Avis des clients ({stats.totalReviews})
          </h3>
          <ReviewsList reviews={reviews} loading={loading} />
        </div>
      </div>
    </TabsContent>
  );
};

export default ReviewsTab;

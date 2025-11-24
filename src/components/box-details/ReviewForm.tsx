import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  hasExistingReview?: boolean;
}

const ReviewForm = ({ onSubmit, hasExistingReview }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(rating, comment);
      toast.success('Avis publié avec succès');
      setRating(0);
      setComment('');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la soumission de l\'avis');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Connectez-vous pour laisser un avis
      </div>
    );
  }

  if (hasExistingReview) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Vous avez déjà laissé un avis pour cette box. Les avis ne peuvent être modifiés que par un administrateur.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Votre note *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Votre commentaire (optionnel)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec cette box..."
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length}/500 caractères
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || rating === 0}>
          {submitting ? 'Publication...' : 'Publier mon avis'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;

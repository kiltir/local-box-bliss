
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedReview {
  id: string;
  rating: number;
  comment: string | null;
  box_id: number;
  profiles: {
    full_name: string | null;
  } | null;
}

const boxNames: Record<number, string> = {
  1: 'Box Découverte',
  2: 'Box Racine',
  3: 'Box Saison',
  4: 'Box Bourbon',
};

const TestimonialsSection = () => {
  const { data: featuredReviews, isLoading } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      const { data: reviews, error } = await supabase
        .from('box_reviews')
        .select('id, rating, comment, box_id, user_id')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Fetch profiles for each review
      const reviewsWithProfiles = await Promise.all(
        (reviews || []).map(async (review) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', review.user_id)
            .single();

          return {
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            box_id: review.box_id,
            profiles: profile
          };
        })
      );

      return reviewsWithProfiles as FeaturedReview[];
    }
  });

  // Fallback testimonials if no featured reviews
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      name: "Marie L.",
      location: "Paris",
      text: "Une découverte incroyable ! Les produits sont authentiques et de qualité. J'ai pu ramener un peu de la Réunion chez moi.",
      rating: 5
    },
    {
      id: 'fallback-2',
      name: "Pierre D.",
      location: "Lyon",
      text: "Parfait pour offrir ! Ma famille a adoré découvrir les saveurs réunionnaises. Service impeccable.",
      rating: 5
    },
    {
      id: 'fallback-3',
      name: "Sophie M.",
      location: "Marseille",
      text: "Les box sont magnifiquement présentées et les produits délicieux. Une vraie invitation au voyage !",
      rating: 5
    }
  ];

  const hasRealReviews = featuredReviews && featuredReviews.length > 0;

  return (
    <section className="py-16 bg-soft-beige/20">
      <div className="container-section">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les témoignages de ceux qui ont déjà goûté à l'expérience de nos box.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-6 rounded-xl shadow-lg">
                <div className="flex mb-4 gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Skeleton key={s} className="h-5 w-5" />
                  ))}
                </div>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
            {hasRealReviews
              ? featuredReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-background p-6 rounded-xl shadow-lg">
                    <div className="flex mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-leaf-green" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">"{review.comment}"</p>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{review.profiles?.full_name || 'Client satisfait'}</strong>
                      <span> • {boxNames[review.box_id]}</span>
                    </div>
                  </div>
                ))
              : fallbackTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-background p-6 rounded-xl shadow-lg">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-leaf-green" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{testimonial.name}</strong>
                      <span> • {testimonial.location}</span>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;

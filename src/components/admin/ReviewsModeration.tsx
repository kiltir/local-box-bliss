import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import StarRating from '@/components/StarRating';

interface Review {
  id: string;
  box_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
  };
}

const boxNames: Record<number, string> = {
  1: 'Box Découverte',
  2: 'Box Racine',
  3: 'Box Saison',
  4: 'Box Bourbon',
};

export const ReviewsModeration = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [boxFilter, setBoxFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('box_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile data separately for each review
      const reviewsWithProfiles = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', review.user_id)
            .single();

          return {
            ...review,
            profiles: profile || { full_name: null }
          };
        })
      );

      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('box_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Avis supprimé avec succès');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Erreur lors de la suppression de l\'avis');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesBox = boxFilter === 'all' || review.box_id.toString() === boxFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return matchesBox && matchesRating;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modération des avis</CardTitle>
        <div className="flex gap-4 mt-4">
          <Select value={boxFilter} onValueChange={setBoxFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par box" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les box</SelectItem>
              <SelectItem value="1">Box Découverte</SelectItem>
              <SelectItem value="2">Box Racine</SelectItem>
              <SelectItem value="3">Box Saison</SelectItem>
              <SelectItem value="4">Box Bourbon</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par note" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="5">5 étoiles</SelectItem>
              <SelectItem value="4">4 étoiles</SelectItem>
              <SelectItem value="3">3 étoiles</SelectItem>
              <SelectItem value="2">2 étoiles</SelectItem>
              <SelectItem value="1">1 étoile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auteur</TableHead>
              <TableHead>Box</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.profiles?.full_name || 'Anonyme'}</TableCell>
                <TableCell>{boxNames[review.box_id]}</TableCell>
                <TableCell>
                  <StarRating rating={review.rating} size={14} />
                </TableCell>
                <TableCell className="max-w-md">
                  {review.comment || <span className="text-muted-foreground italic">Pas de commentaire</span>}
                </TableCell>
                <TableCell>{format(new Date(review.created_at), 'dd MMM yyyy', { locale: fr })}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteReview(review.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

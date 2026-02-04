import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BoxCardImage {
  id: string;
  box_id: number;
  image_url: string;
  display_order: number;
  purchase_type: string;
}

export const useBoxCardImages = () => {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['box-card-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching box card images:', error);
        return [];
      }

      return data as BoxCardImage[];
    },
  });

  const getImageForBox = (boxId: number, purchaseType: 'one-time' | 'subscription'): string | null => {
    const boxImages = images.filter(
      img => img.box_id === boxId && img.purchase_type === purchaseType
    );
    return boxImages.length > 0 ? boxImages[0].image_url : null;
  };

  const getImagesForBox = (boxId: number, purchaseType: 'one-time' | 'subscription'): string[] => {
    const boxImages = images.filter(
      img => img.box_id === boxId && img.purchase_type === purchaseType
    );
    return boxImages.map(img => img.image_url);
  };

  return {
    images,
    getImageForBox,
    getImagesForBox,
    isLoading,
  };
};

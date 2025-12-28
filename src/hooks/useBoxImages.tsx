import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBoxImages = () => {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['box-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching box images:', error);
        return [];
      }

      return data;
    },
  });

  const getImagesForBox = (boxId: number): string[] => {
    const boxImages = images.filter(img => img.box_id === boxId);
    return boxImages.map(img => img.image_url);
  };

  return {
    images,
    getImagesForBox,
    isLoading,
  };
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BoxDimensions {
  id: string;
  box_id: number;
  theme: string;
  weight_limit: number;
  width: number;
  height: number;
  depth: number;
  shipping_box_weight: number | null;
}

// Default values if no data in database
const DEFAULT_DIMENSIONS = {
  weight_limit: 2,
  width: 30,
  height: 18,
  depth: 8,
};

export function useBoxDimensions(theme?: string) {
  const { data: dimensions, isLoading } = useQuery({
    queryKey: ['box-dimensions', theme],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_dimensions')
        .select('*')
        .eq('theme', theme)
        .maybeSingle();

      if (error) throw error;
      return data as BoxDimensions | null;
    },
    enabled: !!theme,
  });

  const weightLimit = dimensions?.weight_limit ?? DEFAULT_DIMENSIONS.weight_limit;
  const width = dimensions?.width ?? DEFAULT_DIMENSIONS.width;
  const height = dimensions?.height ?? DEFAULT_DIMENSIONS.height;
  const depth = dimensions?.depth ?? DEFAULT_DIMENSIONS.depth;
  const shippingBoxWeight = dimensions?.shipping_box_weight ?? 0.3;
  // Volume maximum fixé à 3600 cm³
  const boxVolume = 3600;

  return {
    dimensions,
    isLoading,
    weightLimit,
    width,
    height,
    depth,
    boxVolume,
    shippingBoxWeight,
    BOX_DIMENSIONS: {
      unique: { width, height, depth },
    },
  };
}

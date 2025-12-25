import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BoxProduct } from '@/types/boxes';

interface SupabaseBoxProduct {
  id: string;
  box_id: number;
  theme: string;
  name: string;
  quantity: string;
  producer: string;
  description: string | null;
  dimension_width: number | null;
  dimension_height: number | null;
  dimension_depth: number | null;
  weight: number | null;
  image_url: string | null;
  display_order: number | null;
}

const mapSupabaseProductToBoxProduct = (product: SupabaseBoxProduct): BoxProduct => ({
  name: product.name,
  quantity: product.quantity,
  producer: product.producer,
  description: product.description || undefined,
  dimensions: product.dimension_width && product.dimension_height && product.dimension_depth
    ? {
        width: product.dimension_width,
        height: product.dimension_height,
        depth: product.dimension_depth,
      }
    : undefined,
  weight: product.weight || undefined,
  image: product.image_url || undefined,
});

export const useBoxProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['box-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_products')
        .select('*')
        .order('theme')
        .order('display_order');

      if (error) throw error;
      return data as SupabaseBoxProduct[];
    },
  });

  // Grouper les produits par box_id et theme
  const getProductsForBox = (boxId: number, theme: string): BoxProduct[] | null => {
    if (!products) return null;
    
    const boxProducts = products.filter(
      p => p.box_id === boxId && p.theme.toLowerCase() === theme.toLowerCase()
    );
    
    // Retourne null si aucun produit n'existe dans Supabase (fallback sur statique)
    if (boxProducts.length === 0) return null;
    
    return boxProducts.map(mapSupabaseProductToBoxProduct);
  };

  return {
    products,
    getProductsForBox,
    isLoading,
    error,
  };
};

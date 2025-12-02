import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BoxStock {
  id: string;
  box_id: number;
  theme: string;
  available_stock: number;
  safety_stock: number;
  created_at: string;
  updated_at: string;
}

export const useStock = () => {
  const queryClient = useQueryClient();

  const { data: stocks, isLoading } = useQuery({
    queryKey: ['box-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_stock')
        .select('*')
        .order('box_id');
      
      if (error) throw error;
      return data as BoxStock[];
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand l'onglet redevient actif
    staleTime: 10000, // Données considérées fraîches pendant 10 secondes
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ 
      id, 
      available_stock, 
      safety_stock 
    }: { 
      id: string; 
      available_stock: number; 
      safety_stock: number;
    }) => {
      const { data, error } = await supabase
        .from('box_stock')
        .update({ available_stock, safety_stock })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box-stock'] });
      toast({
        title: 'Stock mis à jour',
        description: 'Les modifications ont été enregistrées avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le stock.',
        variant: 'destructive',
      });
      console.error('Error updating stock:', error);
    },
  });

  const getStockByTheme = (theme: string) => {
    return stocks?.find(s => s.theme === theme);
  };

  const isOutOfStock = (theme: string) => {
    const stock = getStockByTheme(theme);
    return stock ? stock.available_stock === 0 : false;
  };

  // Vérifier si le stock est suffisant pour un type d'achat donné
  const isOutOfStockForPurchaseType = (
    theme: string, 
    purchaseType: 'one-time' | 'subscription',
    subscriptionMonths?: number
  ): boolean => {
    const stock = getStockByTheme(theme);
    if (!stock) return true;

    let requiredStock = 1; // Achat unique par défaut
    
    if (purchaseType === 'subscription' && subscriptionMonths) {
      requiredStock = subscriptionMonths;
    }

    return stock.available_stock < requiredStock;
  };

  return {
    stocks,
    isLoading,
    updateStock: updateStockMutation.mutate,
    getStockByTheme,
    isOutOfStock,
    isOutOfStockForPurchaseType,
  };
};

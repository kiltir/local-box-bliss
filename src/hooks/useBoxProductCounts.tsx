import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BoxProductCount {
  id: string;
  box_id: number;
  theme: string;
  one_time_count: number;
  subscription_count: number;
}

export const useBoxProductCounts = () => {
  const [productCounts, setProductCounts] = useState<BoxProductCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductCounts = useCallback(async () => {
    const { data, error } = await supabase
      .from('box_product_counts')
      .select('*')
      .order('box_id');

    if (error) {
      console.error('Error fetching product counts:', error);
    } else {
      setProductCounts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProductCounts();
  }, [fetchProductCounts]);

  const getProductCount = useCallback((boxId: number, purchaseType: 'one-time' | 'subscription'): number => {
    const count = productCounts.find(pc => pc.box_id === boxId);
    if (!count) return 5; // Default value
    return purchaseType === 'one-time' ? count.one_time_count : count.subscription_count;
  }, [productCounts]);

  return {
    productCounts,
    loading,
    getProductCount,
    refetch: fetchProductCounts,
  };
};

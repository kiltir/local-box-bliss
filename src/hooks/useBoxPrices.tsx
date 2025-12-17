
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BoxPrice {
  box_id: number;
  theme: string;
  unit_price: number;
  subscription_6_months_price: number;
  subscription_12_months_price: number;
}

export const useBoxPrices = () => {
  const [prices, setPrices] = useState<BoxPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase
        .from('box_prices')
        .select('box_id, theme, unit_price, subscription_6_months_price, subscription_12_months_price');

      if (error) {
        console.error('Error fetching prices:', error);
      } else {
        setPrices(data || []);
      }
      setLoading(false);
    };

    fetchPrices();
  }, []);

  const getPriceByBoxId = (boxId: number): BoxPrice | undefined => {
    return prices.find(p => p.box_id === boxId);
  };

  const getPriceByTheme = (theme: string): BoxPrice | undefined => {
    return prices.find(p => p.theme === theme);
  };

  return { prices, loading, getPriceByBoxId, getPriceByTheme };
};

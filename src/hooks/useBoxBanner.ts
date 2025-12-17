import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BoxBanner {
  id: string;
  box_id: number;
  message: string;
  message_2: string;
  is_active: boolean;
}

export const useBoxBanner = (boxId?: number) => {
  const [banner, setBanner] = useState<BoxBanner | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBanner = async () => {
    if (!boxId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('box_banners')
        .select('*')
        .eq('box_id', boxId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setBanner(data);
    } catch (error) {
      console.error('Error fetching banner:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [boxId]);

  return { banner, loading, refetch: fetchBanner };
};

export const useAllBoxBanners = () => {
  const [banners, setBanners] = useState<BoxBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('box_banners')
        .select('*')
        .order('box_id');

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (boxId: number, message: string, message2: string, isActive: boolean) => {
    try {
      const existingBanner = banners.find(b => b.box_id === boxId);
      
      if (existingBanner) {
        const { error } = await supabase
          .from('box_banners')
          .update({ message, message_2: message2, is_active: isActive })
          .eq('box_id', boxId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('box_banners')
          .insert({ box_id: boxId, message, message_2: message2, is_active: isActive });
        
        if (error) throw error;
      }
      
      await fetchBanners();
      return { success: true };
    } catch (error) {
      console.error('Error updating banner:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return { banners, loading, updateBanner, refetch: fetchBanners };
};

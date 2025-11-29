import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('[useAdminCheck] Checking admin role for user:', user?.id);
      
      if (!user) {
        console.log('[useAdminCheck] No user, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('[useAdminCheck] Querying user_roles for user:', user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        console.log('[useAdminCheck] Query result:', { data, error });

        if (error) {
          console.error('[useAdminCheck] Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          const hasAdminRole = !!data;
          console.log('[useAdminCheck] Setting isAdmin to:', hasAdminRole);
          setIsAdmin(hasAdminRole);
        }
      } catch (error) {
        console.error('[useAdminCheck] Exception checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      console.log('[useAdminCheck] Auth loading complete, checking admin role');
      checkAdminRole();
    } else {
      console.log('[useAdminCheck] Auth still loading, waiting...');
    }
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
};

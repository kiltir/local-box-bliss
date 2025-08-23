
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  boxType: string;
  unitPrice: number;
  quantity: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [itemCount, setItemCount] = useState(0);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  // Generate unique order number
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `KB-${timestamp}-${random}`.toUpperCase();
  };

  // Get or create pending order
  const getOrCreatePendingOrder = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des articles au panier.",
        variant: "destructive",
      });
      navigate('/auth');
      return null;
    }

    try {
      // Check if there's already a pending order
      const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('user_id', user.id)
        .eq('status', 'en_attente')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingOrder) {
        setPendingOrderId(existingOrder.id);
        return existingOrder.id;
      }

      // Create new pending order
      const { data: newOrder, error: createError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: generateOrderNumber(),
          status: 'en_attente',
          total_amount: 0,
          shipping_address_country: 'France'
        })
        .select('id')
        .single();

      if (createError) throw createError;

      setPendingOrderId(newOrder.id);
      return newOrder.id;
    } catch (error) {
      console.error('Error getting/creating pending order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Add item to cart
  const addItem = async ({ boxType, unitPrice, quantity = 1 }: CartItem) => {
    const orderId = await getOrCreatePendingOrder();
    if (!orderId) return;

    try {
      // Add item to order_items
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          box_type: boxType,
          quantity: quantity,
          unit_price: unitPrice
        });

      if (itemError) throw itemError;

      // Get current total amount to calculate new total
      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      const newTotalAmount = Number(currentOrder.total_amount) + (unitPrice * quantity);

      // Update total amount
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          total_amount: newTotalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Update item count
      await updateItemCount();

      toast({
        title: "Article ajouté !",
        description: `${boxType} a été ajouté à votre panier.`,
      });

    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier.",
        variant: "destructive",
      });
    }
  };

  // Update item count
  const updateItemCount = async () => {
    if (!user || !pendingOrderId) {
      setItemCount(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('quantity')
        .eq('order_id', pendingOrderId);

      if (error) throw error;

      const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(total);
    } catch (error) {
      console.error('Error updating item count:', error);
      setItemCount(0);
    }
  };

  // Get item count
  const getItemCount = () => itemCount;

  // Initialize cart on user change
  useEffect(() => {
    if (user) {
      getOrCreatePendingOrder().then(() => {
        updateItemCount();
      });
    } else {
      setItemCount(0);
      setPendingOrderId(null);
    }
  }, [user]);

  return {
    addItem,
    getItemCount,
    itemCount
  };
};


import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address_street?: string;
  shipping_address_city?: string;
  shipping_address_postal_code?: string;
  shipping_address_country?: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  box_type: string;
  quantity: number;
  unit_price: number;
}

const MesCommandes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);

        // Fetch order items
        const orderIds = ordersData.map(order => order.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;
        setOrderItems(itemsData || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const getItemsForOrder = (orderId: string) => {
    return orderItems.filter(item => item.order_id === orderId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'en_attente': { label: 'En attente', variant: 'secondary' as const },
      'confirmee': { label: 'Confirmée', variant: 'default' as const },
      'expediee': { label: 'Expédiée', variant: 'default' as const },
      'livree': { label: 'Livrée', variant: 'default' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading || isLoadingOrders) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mes commandes</h1>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">Aucune commande pour le moment</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez nos délicieuses box réunionnaises et passez votre première commande !
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Découvrir nos box
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const items = getItemsForOrder(order.id);
                return (
                  <Card key={order.id} className="border border-border">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">
                            Commande {order.order_number}
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            {order.shipping_address_city && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {order.shipping_address_city}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          {getStatusBadge(order.status)}
                          <div className="text-lg font-semibold text-foreground">
                            {order.total_amount.toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {items.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground mb-3">Articles commandés :</h4>
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                              <div>
                                <span className="font-medium text-foreground">{item.box_type}</span>
                                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                              </div>
                              <span className="text-foreground font-medium">
                                {(Number(item.unit_price) * item.quantity).toFixed(2)} €
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MesCommandes;

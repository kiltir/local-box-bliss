
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Calendar, MapPin, Plane, Truck, Eye, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { boxes } from '@/data/boxes';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
  shipping_address_street?: string;
  shipping_address_city?: string;
  shipping_address_postal_code?: string;
  shipping_address_country?: string;
}

interface Profile {
  delivery_preference?: string;
  arrival_date_reunion?: string;
  departure_date_reunion?: string;
  arrival_time_reunion?: string;
  departure_time_reunion?: string;
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
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

      // Fetch user profile for delivery preferences
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('delivery_preference, arrival_date_reunion, departure_date_reunion, arrival_time_reunion, departure_time_reunion')
        .eq('id', user?.id)
        .single();

      if (!profileError) {
        setUserProfile(profileData);
      }

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

  const getBoxData = (boxType: string) => {
    return boxes.find(box => 
      boxType.toLowerCase().includes(box.theme.toLowerCase()) ||
      boxType.toLowerCase().includes(box.baseTitle.toLowerCase())
    );
  };

  const getOrderType = (items: OrderItem[]) => {
    // Pour l'instant, on considère tout comme achat unique
    // TODO: Détecter les abonnements quand ils seront implémentés
    return 'Achat unique';
  };

  const getDeliveryInfo = () => {
    if (!userProfile?.delivery_preference) return { type: 'Non défini', icon: Package };
    
    if (userProfile.delivery_preference === 'airport') {
      return { 
        type: 'Récupération à l\'aéroport', 
        icon: Plane,
        date: userProfile.arrival_date_reunion 
      };
    } else {
      return { 
        type: 'Livraison en métropole', 
        icon: Truck,
        date: null 
      };
    }
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
            <>
              <div className="space-y-6">
                {orders.map((order) => {
                  const items = getItemsForOrder(order.id);
                  const firstItem = items[0];
                  const boxData = firstItem ? getBoxData(firstItem.box_type) : null;
                  const deliveryInfo = getDeliveryInfo();
                  const DeliveryIcon = deliveryInfo.icon;

                  return (
                  <Card key={order.id} className="border border-border hover:shadow-md transition-shadow cursor-pointer group">
                    <div onClick={() => setSelectedOrder(order)}>
                      <CardHeader className="pb-4">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            {boxData?.image ? (
                              <img 
                                src={boxData.image} 
                                alt={boxData.baseTitle}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Informations principales */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg font-semibold text-foreground">
                                    {boxData?.baseTitle || firstItem?.box_type || 'Commande'}
                                  </CardTitle>
                                  <span className="text-sm text-muted-foreground">#{order.order_number}</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                  </div>
                                  
                                  {deliveryInfo.type !== 'Non défini' && (
                                    <div className="flex items-center gap-1">
                                      <DeliveryIcon className="h-4 w-4" />
                                      {deliveryInfo.type}
                                    </div>
                                  )}

                                  {deliveryInfo.date && (
                                    <div className="flex items-center gap-1">
                                      <span>Date: {new Date(deliveryInfo.date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>

                              <div className="flex flex-col sm:items-end gap-2">
                                <div className="text-xl font-bold text-foreground">
                                  {order.total_amount.toFixed(2)} €
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                  <Eye className="h-4 w-4" />
                                  <span>Voir détails</span>
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Aperçu des articles */}
                      <CardContent className="pt-0">
                        {items.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <div className="text-sm text-muted-foreground mb-2">
                              {items.length} article{items.length > 1 ? 's' : ''} commandé{items.length > 1 ? 's' : ''}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {items.slice(0, 3).map((item) => (
                                <Badge key={item.id} variant="secondary" className="text-xs">
                                  {item.box_type} x{item.quantity}
                                </Badge>
                              ))}
                              {items.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{items.length - 3} autre{items.length - 3 > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                );
                })}
              </div>

              {/* Modal de détails */}
              <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Détails de la commande #{selectedOrder?.order_number}</DialogTitle>
                  </DialogHeader>
                  
                  {selectedOrder && (
                    <div className="space-y-6">
                      {/* Informations générales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Informations générales</h4>
                           <div className="space-y-2 text-sm">
                             <div><span className="text-muted-foreground">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</div>
                             <div><span className="text-muted-foreground">Type:</span> {getOrderType(getItemsForOrder(selectedOrder.id))}</div>
                             <div><span className="text-muted-foreground">Statut:</span> {getStatusBadge(selectedOrder.status)}</div>
                             <div><span className="text-muted-foreground">Total:</span> <span className="font-semibold">{selectedOrder.total_amount.toFixed(2)} €</span></div>
                           </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Livraison</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              {React.createElement(getDeliveryInfo().icon, { className: "h-4 w-4" })}
                              <span>{getDeliveryInfo().type}</span>
                            </div>
                            {selectedOrder.shipping_address_street && (
                              <div className="text-muted-foreground">
                                {selectedOrder.shipping_address_street}<br />
                                {selectedOrder.shipping_address_postal_code} {selectedOrder.shipping_address_city}<br />
                                {selectedOrder.shipping_address_country}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Articles détaillés */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Articles commandés</h4>
                        <div className="space-y-3">
                          {getItemsForOrder(selectedOrder.id).map((item) => {
                            const boxData = getBoxData(item.box_type);
                            return (
                              <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                                {boxData?.image ? (
                                  <img 
                                    src={boxData.image} 
                                    alt={boxData.baseTitle}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                
                                <div className="flex-1">
                                  <h5 className="font-medium text-foreground">{item.box_type}</h5>
                                  <div className="text-sm text-muted-foreground">
                                    Quantité: {item.quantity} • Prix unitaire: {Number(item.unit_price).toFixed(2)} €
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="font-semibold text-foreground">
                                    {(Number(item.unit_price) * item.quantity).toFixed(2)} €
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MesCommandes;

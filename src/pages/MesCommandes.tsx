
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Calendar, Euro } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  box_type: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address_street?: string;
  shipping_address_city?: string;
  shipping_address_postal_code?: string;
  shipping_address_country?: string;
  order_items: OrderItem[];
}

const MesCommandes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos commandes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmee': return 'bg-blue-100 text-blue-800';
      case 'preparee': return 'bg-purple-100 text-purple-800';
      case 'expediee': return 'bg-orange-100 text-orange-800';
      case 'livree': return 'bg-green-100 text-green-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'confirmee': return 'Confirmée';
      case 'preparee': return 'Préparée';
      case 'expediee': return 'Expédiée';
      case 'livree': return 'Livrée';
      case 'annulee': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-green/5 to-yellow-400/5 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-leaf-green mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-green/5 to-yellow-400/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center">
              <Package className="h-6 w-6 text-leaf-green mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Mes commandes</h1>
            </div>
          </div>

          {orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore passé de commande.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-leaf-green hover:bg-dark-green"
                >
                  Découvrir nos boxes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Commande #{order.order_number}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <div className="flex items-center mt-2 text-lg font-semibold">
                          <Euro className="h-4 w-4 mr-1" />
                          {formatPrice(order.total_amount)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Articles de la commande */}
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-gray-700">Articles commandés :</h4>
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                          <span>{item.box_type}</span>
                          <span>
                            {item.quantity} × {formatPrice(item.unit_price)} = {formatPrice(item.quantity * item.unit_price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Adresse de livraison */}
                    {order.shipping_address_street && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h4 className="font-medium text-gray-700 mb-1">Adresse de livraison :</h4>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address_street}<br />
                          {order.shipping_address_postal_code} {order.shipping_address_city}<br />
                          {order.shipping_address_country}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesCommandes;

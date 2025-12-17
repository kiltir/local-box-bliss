import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, CreditCard, ArrowLeft, Crown, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type DeliveryOption = 'metropole' | 'reunion';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('metropole');

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Vérifier si la livraison métropole est sélectionnée par défaut (pas de travelInfo ou metropole)
  const isMetropoleDefault = () => {
    const travelInfo = localStorage.getItem('travelInfo');
    if (!travelInfo) return true;
    try {
      const parsed = JSON.parse(travelInfo);
      return !parsed.delivery_preference || parsed.delivery_preference === 'metropole';
    } catch {
      return true;
    }
  };

  const showDeliverySelector = isMetropoleDefault();

  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Starting payment process with items:', items);
      
      // Get travel information from localStorage
      const travelInfo = localStorage.getItem('travelInfo');
      let parsedTravelInfo = null;
      if (travelInfo) {
        try {
          parsedTravelInfo = JSON.parse(travelInfo);
        } catch (error) {
          console.warn('Failed to parse travel info from localStorage:', error);
        }
      }

      // Si le sélecteur de livraison est affiché, on utilise la sélection de l'utilisateur
      if (showDeliverySelector) {
        parsedTravelInfo = {
          ...parsedTravelInfo,
          delivery_preference: selectedDelivery === 'reunion' ? 'reunion_delivery' : 'metropole'
        };
      }
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { items, currency: 'eur', travelInfo: parsedTravelInfo }
      });

      if (error) {
        console.error('Payment error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Redirect to Stripe checkout in the same tab
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error('Erreur lors de la création de la session de paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const getItemDisplayName = (item: any) => {
    if (item.subscriptionType) {
      const subscriptionLabel = item.subscriptionType === '6months' ? '6 mois' : '1 an';
      return `${item.box.baseTitle.replace(/ - Abonnement.*/, '')} - Abonnement ${subscriptionLabel}`;
    }
    return item.box.baseTitle;
  };

  const getItemDescription = (item: any) => {
    if (item.subscriptionType) {
      return `Abonnement ${item.subscriptionType === '6months' ? '6 mois' : '1 an'}`;
    }
    return item.box.theme;
  };

  const getBaseDeliveryCost = () => {
    // Si le sélecteur est affiché, utiliser la sélection de l'utilisateur
    if (showDeliverySelector) {
      if (selectedDelivery === 'reunion') {
        return { label: 'Livraison Réunion', baseCost: 12 };
      }
      return { label: 'Livraison métropole', baseCost: 25 };
    }

    // Sinon, utiliser les préférences de voyage stockées
    const travelInfo = localStorage.getItem('travelInfo');
    if (!travelInfo) return { label: 'Livraison métropole', baseCost: 25 };
    
    try {
      const parsed = JSON.parse(travelInfo);
      switch (parsed.delivery_preference) {
        case 'airport_pickup_arrival':
          return { label: 'Récupération à l\'aéroport (Arrivée)', baseCost: 15 };
        case 'airport_pickup_departure':
          return { label: 'Récupération à l\'aéroport (Départ)', baseCost: 15 };
        case 'reunion_delivery':
          return { label: 'Livraison Réunion', baseCost: 15 };
        default:
          return { label: 'Livraison métropole', baseCost: 25 };
      }
    } catch {
      return { label: 'Livraison métropole', baseCost: 25 };
    }
  };

  const calculateTotalShippingCost = () => {
    const { baseCost } = getBaseDeliveryCost();
    let totalShipping = 0;

    items.forEach(item => {
      let multiplier = 1;
      if (item.subscriptionType === '6months') {
        multiplier = 6;
      } else if (item.subscriptionType === '1year') {
        multiplier = 12;
      }
      totalShipping += baseCost * item.quantity * multiplier;
    });

    return totalShipping;
  };

  const deliveryInfo = { ...getBaseDeliveryCost(), cost: calculateTotalShippingCost() };
  const totalWithShipping = getTotalPrice() + deliveryInfo.cost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
              <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour procéder au paiement.</p>
              <Button onClick={() => navigate('/')} className="bg-leaf-green hover:bg-dark-green">
                Retourner aux produits
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser votre commande</h1>
          <p className="text-gray-600 mt-2">Vérifiez votre panier et procédez au paiement sécurisé</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Récapitulatif de votre panier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-center">Quantité</TableHead>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={`${item.box.id}-${item.subscriptionType || 'single'}-${index}`}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img 
                                src="/lovable-uploads/bbbefcf8-6fc3-45be-9a11-df15e8ecd5eb.png" 
                                alt={item.box.baseTitle}
                                className="w-12 h-12 object-contain rounded"
                              />
                              {item.subscriptionType && (
                                <Crown className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{getItemDisplayName(item)}</p>
                              <p className="text-sm text-gray-500">{getItemDescription(item)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.box.price.toFixed(2)}€</TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.box.price * item.quantity).toFixed(2)}€
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {showDeliverySelector && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Choisissez votre mode de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedDelivery}
                    onValueChange={(value) => setSelectedDelivery(value as DeliveryOption)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="metropole" id="metropole" />
                      <Label htmlFor="metropole" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Livraison métropole</p>
                          <span className="font-semibold text-leaf-green">25,00€ <span className="font-normal text-muted-foreground">par box</span></span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="reunion" id="reunion" />
                      <Label htmlFor="reunion" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Livraison Réunion</p>
                          <span className="font-semibold text-leaf-green">12,00€ <span className="font-normal text-muted-foreground">par box</span></span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Type de livraison</span>
                  <span className="font-medium text-leaf-green">{deliveryInfo.label}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{getTotalPrice().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>{deliveryInfo.cost.toFixed(2)}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{totalWithShipping.toFixed(2)}€</span>
                </div>
                
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing || items.length === 0}
                  className="w-full bg-leaf-green hover:bg-dark-green text-white py-3 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payer
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Paiement sécurisé par Stripe. Vos informations sont protégées.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

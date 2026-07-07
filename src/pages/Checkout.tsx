import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, CreditCard, ArrowLeft, Crown, Truck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBoxImages } from '@/hooks/useBoxImages';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type DeliveryOption = 'metropole' | 'reunion';

interface ShippingCostData {
  delivery_type: string;
  label: string;
  cost: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const { getImagesForBox } = useBoxImages();
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('metropole');
  const [shippingCosts, setShippingCosts] = useState<ShippingCostData[]>([]);
  const [shippingLoading, setShippingLoading] = useState(true);

  // Charger les frais de livraison depuis la base de données
  useEffect(() => {
    const fetchShippingCosts = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_costs')
          .select('delivery_type, label, cost')
          .eq('is_active', true);
        if (error) throw error;
        setShippingCosts(data || []);
      } catch (error) {
        console.error('Error fetching shipping costs:', error);
      } finally {
        setShippingLoading(false);
      }
    };
    fetchShippingCosts();
  }, []);

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

      // Sanitize cart items for payment validation:
      // some UI components use a “display id” (or other non-canonical ids) in the cart,
      // but the payment validation expects the real box_id (1..4) matching DB pricing.
      const themeToBoxId: Record<string, number> = {
        'Découverte': 1,
        'Bourbon': 2,
        'Racine': 3,
        'Saison': 4,
      };

      const getCanonicalBoxId = (box: any): number => {
        const candidates = [box?.boxId, box?.id];
        for (const c of candidates) {
          if (typeof c === 'number' && Number.isFinite(c) && Number.isInteger(c) && c >= 1 && c <= 4) {
            return c;
          }
        }

        const fromTheme = themeToBoxId[String(box?.theme ?? '')];
        return fromTheme ?? 1;
      };

      const itemsForPayment = items.map((item: any) => {
        const canonicalBoxId = getCanonicalBoxId(item?.box);
        return {
          ...item,
          box: {
            ...item.box,
            // Ensure create-payment reads a stable id for DB price lookup
            id: canonicalBoxId,
            boxId: canonicalBoxId,
          },
        };
      });
      
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
        body: { items: itemsForPayment, currency: 'eur', travelInfo: parsedTravelInfo }
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
      const months = item.subscriptionType === '6months' ? 6 : 12;
      return `Prélèvement mensuel pendant ${months} mois`;
    }
    return item.box.theme;
  };

  const getItemPriceDisplay = (item: any) => {
    if (item.subscriptionType) {
      // For subscriptions, item.box.price is already the total subscription cost
      // Show it directly as the unit price
      return `${item.box.price.toFixed(0)}€`;
    }
    return `${item.box.price.toFixed(2)}€`;
  };

  const getItemTotalDisplay = (item: any) => {
    if (item.subscriptionType) {
      // For subscriptions: item.box.price is the total subscription cost
      // Calculate monthly price by dividing by duration
      const months = item.subscriptionType === '6months' ? 6 : 12;
      const totalSubscriptionCost = item.box.price;
      const monthlyPrice = totalSubscriptionCost / months;
      const totalEngagement = totalSubscriptionCost * item.quantity;
      return (
        <div className="text-right">
          <p className="font-medium">{monthlyPrice.toFixed(0)}€/mois</p>
          <p className="text-xs text-muted-foreground">Total engagement: {totalEngagement.toFixed(0)}€</p>
        </div>
      );
    }
    return <span className="font-medium">{(item.box.price * item.quantity).toFixed(2)}€</span>;
  };

  const getShippingByType = (type: string): { label: string; baseCost: number } => {
    const found = shippingCosts.find(s => s.delivery_type === type);
    if (found) return { label: found.label, baseCost: Number(found.cost) };
    // Fallback par défaut
    return { label: 'Livraison métropole', baseCost: 25 };
  };

  const getBaseDeliveryCost = () => {
    // Si le sélecteur est affiché, utiliser la sélection de l'utilisateur
    if (showDeliverySelector) {
      return getShippingByType(selectedDelivery);
    }

    // Sinon, utiliser les préférences de voyage stockées
    const travelInfo = localStorage.getItem('travelInfo');
    if (!travelInfo) return getShippingByType('metropole');
    
    try {
      const parsed = JSON.parse(travelInfo);
      switch (parsed.delivery_preference) {
        case 'airport_pickup_arrival':
        case 'airport_pickup_departure':
          return getShippingByType('airport');
        case 'reunion_delivery':
          return getShippingByType('reunion');
        default:
          return getShippingByType('metropole');
      }
    } catch {
      return getShippingByType('metropole');
    }
  };

  const calculateTotalShippingCost = () => {
    const { baseCost } = getBaseDeliveryCost();
    let totalShipping = 0;

    items.forEach(item => {
      if (item.subscriptionType === '6months') {
        // Abonnement 6 mois : frais de livraison × 6 × quantité
        totalShipping += baseCost * 6 * item.quantity;
      } else if (item.subscriptionType === '1year') {
        // Abonnement 12 mois : frais de livraison × 12 × quantité
        totalShipping += baseCost * 12 * item.quantity;
      } else {
        // Achat unique : frais de livraison × quantité (1 livraison par box)
        totalShipping += baseCost * item.quantity;
      }
    });

    return totalShipping;
  };

  // Calcul du total engagement (montant total de tous les abonnements sur leur durée)
  const calculateTotalEngagement = () => {
    const { baseCost } = getBaseDeliveryCost();
    let totalEngagement = 0;

    items.forEach(item => {
      if (item.subscriptionType) {
        // item.box.price est le coût total de l'abonnement
        const subscriptionCost = item.box.price * item.quantity;
        const months = item.subscriptionType === '6months' ? 6 : 12;
        const shippingCost = baseCost * months * item.quantity;
        totalEngagement += subscriptionCost + shippingCost;
      }
    });

    return totalEngagement;
  };

  // Calcul du premier paiement (premier mois des abonnements + achats uniques + livraison)
  const calculateFirstPayment = () => {
    const { baseCost } = getBaseDeliveryCost();
    let firstPayment = 0;

    items.forEach(item => {
      if (item.subscriptionType) {
        // Pour les abonnements : prix mensuel + livraison pour le premier mois
        const months = item.subscriptionType === '6months' ? 6 : 12;
        const monthlyPrice = item.box.price / months;
        firstPayment += (monthlyPrice + baseCost) * item.quantity;
      } else {
        // Achat unique : prix complet + livraison
        firstPayment += (item.box.price + baseCost) * item.quantity;
      }
    });

    return firstPayment;
  };

  // Vérifier s'il y a des abonnements dans le panier
  const hasSubscriptions = items.some(item => item.subscriptionType);

  const deliveryInfo = { ...getBaseDeliveryCost(), cost: calculateTotalShippingCost() };
  const totalWithShipping = getTotalPrice() + deliveryInfo.cost;
  const totalEngagement = calculateTotalEngagement();
  const firstPayment = calculateFirstPayment();

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
                    {items.map((item, index) => {
                      const displayImage = getImagesForBox(item.box.id)[0] || item.box.image;
                      return (
                        <TableRow key={`${item.box.id}-${item.subscriptionType || 'single'}-${index}`}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <img 
                                  src={displayImage} 
                                  alt={item.box.baseTitle}
                                  className="w-12 h-12 object-cover rounded"
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
                        <TableCell className="text-right">{getItemPriceDisplay(item)}</TableCell>
                        <TableCell className="text-right">
                          {getItemTotalDisplay(item)}
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
                    {(['metropole', 'reunion'] as DeliveryOption[]).map((type) => {
                      const shipping = getShippingByType(type);
                      return (
                        <div key={type} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{shipping.label}</p>
                              <span className="font-semibold text-leaf-green">{shipping.baseCost.toFixed(2)}€ <span className="font-normal text-muted-foreground">par box</span></span>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <Alert className="mt-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                      Attention ! Le mode de livraison sélectionné concerne toute la commande, y compris les abonnements.
                    </AlertDescription>
                  </Alert>
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
                  <span className="font-medium text-primary">{deliveryInfo.label}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Sous-total produits</span>
                  <span>{getTotalPrice().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison totale</span>
                  <span>{deliveryInfo.cost.toFixed(2)}€</span>
                </div>
                
                {hasSubscriptions && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm font-medium text-amber-600">
                      <span className="flex items-center">
                        <Crown className="h-4 w-4 mr-1" />
                        Total engagement
                      </span>
                      <span>{totalEngagement.toFixed(2)}€</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Montant total de vos abonnements sur toute leur durée (produits + livraison)
                    </p>
                  </>
                )}

                <Separator />
                <div className="flex justify-between gap-8 font-semibold text-base bg-muted/50 p-2 rounded-md">
                  <span>Premier paiement</span>
                  <span className="text-primary">{firstPayment.toFixed(2)}€</span>
                </div>
                {hasSubscriptions && (
                  <p className="text-xs text-muted-foreground">
                    Montant prélevé aujourd'hui (1er mois des abonnements + achats uniques)
                  </p>
                )}
                
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

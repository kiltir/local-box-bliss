import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Euro, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BoxPrice {
  id: string;
  box_id: number;
  theme: string;
  unit_price: number;
  subscription_6_months_price: number;
  subscription_12_months_price: number;
}

interface ShippingCost {
  id: string;
  delivery_type: string;
  label: string;
  cost: number;
  is_active: boolean;
}

export const PriceManagement = () => {
  const [prices, setPrices] = useState<BoxPrice[]>([]);
  const [shippingCosts, setShippingCosts] = useState<ShippingCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savingShipping, setSavingShipping] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pricesRes, shippingRes] = await Promise.all([
        supabase.from('box_prices').select('*').order('box_id'),
        supabase.from('shipping_costs').select('*').order('delivery_type'),
      ]);

      if (pricesRes.error) throw pricesRes.error;
      if (shippingRes.error) throw shippingRes.error;

      setPrices(pricesRes.data || []);
      setShippingCosts(shippingRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (boxId: number, field: keyof BoxPrice, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPrices(prev =>
      prev.map(p =>
        p.box_id === boxId ? { ...p, [field]: numValue } : p
      )
    );
  };

  const handleShippingChange = (id: string, field: 'cost' | 'label', value: string) => {
    setShippingCosts(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, [field]: field === 'cost' ? (parseFloat(value) || 0) : value }
          : s
      )
    );
  };

  const savePrice = async (boxPrice: BoxPrice) => {
    setSaving(boxPrice.id);
    try {
      const { error } = await supabase
        .from('box_prices')
        .update({
          unit_price: boxPrice.unit_price,
          subscription_6_months_price: boxPrice.subscription_6_months_price,
          subscription_12_months_price: boxPrice.subscription_12_months_price,
        })
        .eq('id', boxPrice.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: `Prix de la box ${boxPrice.theme} mis à jour`,
      });
    } catch (error) {
      console.error('Error saving price:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les prix',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const saveShippingCost = async (shipping: ShippingCost) => {
    setSavingShipping(shipping.id);
    try {
      const { error } = await supabase
        .from('shipping_costs')
        .update({ cost: shipping.cost, label: shipping.label })
        .eq('id', shipping.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: `Frais "${shipping.label}" mis à jour`,
      });
    } catch (error) {
      console.error('Error saving shipping cost:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les frais de livraison',
        variant: 'destructive',
      });
    } finally {
      setSavingShipping(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Section Prix des box */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Prix des box</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {prices.map((boxPrice) => (
            <Card key={boxPrice.id}>
              <CardHeader>
                <CardTitle className="text-lg">Box {boxPrice.theme}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`unit-${boxPrice.box_id}`}>
                    Prix achat unique (€)
                  </Label>
                  <Input
                    id={`unit-${boxPrice.box_id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={boxPrice.unit_price}
                    onChange={(e) =>
                      handlePriceChange(boxPrice.box_id, 'unit_price', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`sub6-${boxPrice.box_id}`}>
                    Prix abonnement 6 mois (€)
                  </Label>
                  <Input
                    id={`sub6-${boxPrice.box_id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={boxPrice.subscription_6_months_price}
                    onChange={(e) =>
                      handlePriceChange(
                        boxPrice.box_id,
                        'subscription_6_months_price',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Prix total 6 mois: {(boxPrice.subscription_6_months_price * 6).toFixed(2)}€
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`sub12-${boxPrice.box_id}`}>
                    Prix abonnement 12 mois (€)
                  </Label>
                  <Input
                    id={`sub12-${boxPrice.box_id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={boxPrice.subscription_12_months_price}
                    onChange={(e) =>
                      handlePriceChange(
                        boxPrice.box_id,
                        'subscription_12_months_price',
                        e.target.value
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Prix total 12 mois: {(boxPrice.subscription_12_months_price * 12).toFixed(2)}€
                  </p>
                </div>

                <Button
                  onClick={() => savePrice(boxPrice)}
                  disabled={saving === boxPrice.id}
                  className="w-full"
                >
                  {saving === boxPrice.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Section Frais de livraison */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Frais de livraison</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {shippingCosts.map((shipping) => (
            <Card key={shipping.id}>
              <CardHeader>
                <CardTitle className="text-lg">{shipping.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`shipping-label-${shipping.id}`}>Libellé</Label>
                  <Input
                    id={`shipping-label-${shipping.id}`}
                    value={shipping.label}
                    onChange={(e) =>
                      handleShippingChange(shipping.id, 'label', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`shipping-cost-${shipping.id}`}>Coût (€)</Label>
                  <Input
                    id={`shipping-cost-${shipping.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={shipping.cost}
                    onChange={(e) =>
                      handleShippingChange(shipping.id, 'cost', e.target.value)
                    }
                  />
                </div>

                <Button
                  onClick={() => saveShippingCost(shipping)}
                  disabled={savingShipping === shipping.id}
                  className="w-full"
                >
                  {savingShipping === shipping.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
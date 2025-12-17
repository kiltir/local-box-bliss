import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Euro } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BoxPrice {
  id: string;
  box_id: number;
  theme: string;
  unit_price: number;
  subscription_6_months_price: number;
  subscription_12_months_price: number;
}

export const PriceManagement = () => {
  const [prices, setPrices] = useState<BoxPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('box_prices')
        .select('*')
        .order('box_id');

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les prix',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Euro className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Gestion des prix</h2>
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
                  Prix mensuel: {(boxPrice.subscription_6_months_price / 6).toFixed(2)}€
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
                  Prix mensuel: {(boxPrice.subscription_12_months_price / 12).toFixed(2)}€
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
  );
};

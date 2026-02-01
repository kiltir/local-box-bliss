import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface BoxProductCount {
  id: string;
  box_id: number;
  theme: string;
  one_time_count: number;
  subscription_count: number;
}

export const ProductCountsManagement = () => {
  const [productCounts, setProductCounts] = useState<BoxProductCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('box_product_counts')
      .select('*')
      .order('box_id');

    if (error) {
      console.error('Error fetching product counts:', error);
      toast.error('Erreur lors du chargement');
    } else {
      setProductCounts(data || []);
    }
    setLoading(false);
  };

  const handleCountChange = (id: string, field: 'one_time_count' | 'subscription_count', value: string) => {
    const numValue = parseInt(value) || 0;
    setProductCounts(prev =>
      prev.map(pc => (pc.id === id ? { ...pc, [field]: numValue } : pc))
    );
  };

  const saveCount = async (productCount: BoxProductCount) => {
    setSaving(productCount.id);
    const { error } = await supabase
      .from('box_product_counts')
      .update({
        one_time_count: productCount.one_time_count,
        subscription_count: productCount.subscription_count,
      })
      .eq('id', productCount.id);

    if (error) {
      console.error('Error saving product count:', error);
      toast.error('Erreur lors de la sauvegarde');
    } else {
      toast.success(`Nombre de produits pour ${productCount.theme} mis à jour`);
    }
    setSaving(null);
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
        <Hash className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Nombre de produits affichés</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Définissez le nombre de produits affiché dans la section "Découvrez nos box" pour chaque thématique et type d'achat.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {productCounts.map((pc) => (
          <Card key={pc.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{pc.theme}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`one-time-${pc.id}`} className="text-sm">
                  Achat unique
                </Label>
                <Input
                  id={`one-time-${pc.id}`}
                  type="number"
                  min="1"
                  max="20"
                  value={pc.one_time_count}
                  onChange={(e) => handleCountChange(pc.id, 'one_time_count', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`sub-${pc.id}`} className="text-sm">
                  Abonnement
                </Label>
                <Input
                  id={`sub-${pc.id}`}
                  type="number"
                  min="1"
                  max="20"
                  value={pc.subscription_count}
                  onChange={(e) => handleCountChange(pc.id, 'subscription_count', e.target.value)}
                />
              </div>

              <Button
                onClick={() => saveCount(pc)}
                disabled={saving === pc.id}
                size="sm"
                className="w-full"
              >
                {saving === pc.id ? (
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

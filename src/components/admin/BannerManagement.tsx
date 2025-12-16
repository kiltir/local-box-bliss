import { useState, useEffect } from 'react';
import { useAllBoxBanners } from '@/hooks/useBoxBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Leaf } from 'lucide-react';

export const BannerManagement = () => {
  const { banners, loading, updateBanner } = useAllBoxBanners();
  const [saisonMessage, setSaisonMessage] = useState('');
  const [saisonActive, setSaisonActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Box Saison has id = 4
  const SAISON_BOX_ID = 4;

  useEffect(() => {
    const saisonBanner = banners.find(b => b.box_id === SAISON_BOX_ID);
    if (saisonBanner) {
      setSaisonMessage(saisonBanner.message);
      setSaisonActive(saisonBanner.is_active);
    }
  }, [banners]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateBanner(SAISON_BOX_ID, saisonMessage, saisonActive);
    setSaving(false);

    if (result.success) {
      toast.success('Bandeau mis à jour avec succès');
    } else {
      toast.error('Erreur lors de la mise à jour du bandeau');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-purple-600" />
            Bandeau Box Saison
          </CardTitle>
          <CardDescription>
            Personnalisez le message affiché sur la Box Saison selon la saison en cours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message du bandeau</Label>
            <Input
              id="message"
              value={saisonMessage}
              onChange={(e) => setSaisonMessage(e.target.value)}
              placeholder="Ex: Édition Été 2025 - Saveurs tropicales"
              className="max-w-xl"
            />
            <p className="text-sm text-muted-foreground">
              Ce message sera affiché sur la carte et dans les détails de la Box Saison
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={saisonActive}
              onCheckedChange={setSaisonActive}
            />
            <Label htmlFor="active">Afficher le bandeau</Label>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </CardContent>
      </Card>

      {/* Aperçu du bandeau */}
      {saisonActive && saisonMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg text-center text-sm font-medium">
              {saisonMessage}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

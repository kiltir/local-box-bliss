import { useState, useEffect } from 'react';
import { useAllBoxBanners } from '@/hooks/useBoxBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Compass, Coffee, TreeDeciduous, Leaf } from 'lucide-react';

interface BoxBannerConfig {
  id: number;
  name: string;
  icon: React.ReactNode;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  placeholder: string;
}

const BOX_CONFIGS: BoxBannerConfig[] = [
  {
    id: 1,
    name: 'Box Découverte',
    icon: <Compass className="h-5 w-5" />,
    iconColor: 'text-teal-600',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-teal-600',
    placeholder: 'Ex: Nouvelle édition disponible !'
  },
  {
    id: 2,
    name: 'Box Bourbon',
    icon: <Coffee className="h-5 w-5" />,
    iconColor: 'text-amber-600',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    placeholder: 'Ex: Édition limitée - Vanille Bourbon Premium'
  },
  {
    id: 3,
    name: 'Box Racine',
    icon: <TreeDeciduous className="h-5 w-5" />,
    iconColor: 'text-orange-600',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    placeholder: 'Ex: Spécial traditions créoles'
  },
  {
    id: 4,
    name: 'Box Saison',
    icon: <Leaf className="h-5 w-5" />,
    iconColor: 'text-purple-600',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    placeholder: 'Ex: Édition Été 2025 - Saveurs tropicales'
  }
];

interface BannerState {
  message: string;
  isActive: boolean;
}

export const BannerManagement = () => {
  const { banners, loading, updateBanner } = useAllBoxBanners();
  const [bannerStates, setBannerStates] = useState<Record<number, BannerState>>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);

  useEffect(() => {
    const states: Record<number, BannerState> = {};
    BOX_CONFIGS.forEach(config => {
      const existingBanner = banners.find(b => b.box_id === config.id);
      states[config.id] = {
        message: existingBanner?.message || '',
        isActive: existingBanner?.is_active ?? false
      };
    });
    setBannerStates(states);
  }, [banners]);

  const handleMessageChange = (boxId: number, message: string) => {
    setBannerStates(prev => ({
      ...prev,
      [boxId]: { ...prev[boxId], message }
    }));
  };

  const handleActiveChange = (boxId: number, isActive: boolean) => {
    setBannerStates(prev => ({
      ...prev,
      [boxId]: { ...prev[boxId], isActive }
    }));
  };

  const handleSave = async (boxId: number) => {
    const state = bannerStates[boxId];
    if (!state) return;

    setSavingIds(prev => [...prev, boxId]);
    const result = await updateBanner(boxId, state.message, state.isActive);
    setSavingIds(prev => prev.filter(id => id !== boxId));

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
      {BOX_CONFIGS.map(config => {
        const state = bannerStates[config.id] || { message: '', isActive: false };
        const isSaving = savingIds.includes(config.id);

        return (
          <Card key={config.id}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${config.iconColor}`}>
                {config.icon}
                <span className="text-foreground">Bandeau {config.name}</span>
              </CardTitle>
              <CardDescription>
                Personnalisez le message affiché sur la {config.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`message-${config.id}`}>Message du bandeau</Label>
                <Input
                  id={`message-${config.id}`}
                  value={state.message}
                  onChange={(e) => handleMessageChange(config.id, e.target.value)}
                  placeholder={config.placeholder}
                  className="max-w-xl"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`active-${config.id}`}
                  checked={state.isActive}
                  onCheckedChange={(checked) => handleActiveChange(config.id, checked)}
                />
                <Label htmlFor={`active-${config.id}`}>Afficher le bandeau</Label>
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={() => handleSave(config.id)} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Enregistrer
                </Button>

                {state.isActive && state.message && (
                  <div className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white px-4 py-2 rounded-lg text-sm font-medium`}>
                    {state.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

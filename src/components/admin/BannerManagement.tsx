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
  placeholder1: string;
  placeholder2: string;
}

const BOX_CONFIGS: BoxBannerConfig[] = [
  {
    id: 1,
    name: 'Box Découverte',
    icon: <Compass className="h-5 w-5" />,
    iconColor: 'text-blue-600',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    placeholder1: 'Ex: Nouvelle édition disponible !',
    placeholder2: 'Ex: Livraison offerte dès 50€'
  },
  {
    id: 2,
    name: 'Box Bourbon',
    icon: <Coffee className="h-5 w-5" />,
    iconColor: 'text-amber-600',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    placeholder1: 'Ex: Édition limitée - Vanille Bourbon Premium',
    placeholder2: 'Ex: Idéal pour les amateurs de café'
  },
  {
    id: 3,
    name: 'Box Racine',
    icon: <TreeDeciduous className="h-5 w-5" />,
    iconColor: 'text-green-600',
    gradientFrom: 'from-green-600',
    gradientTo: 'to-green-700',
    placeholder1: 'Ex: Spécial traditions créoles',
    placeholder2: 'Ex: Découvrez nos recettes ancestrales'
  },
  {
    id: 4,
    name: 'Box Saison',
    icon: <Leaf className="h-5 w-5" />,
    iconColor: 'text-purple-600',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    placeholder1: 'Ex: Édition Été 2025 - Saveurs tropicales',
    placeholder2: 'Ex: Produits frais de saison'
  }
];

interface BannerState {
  message: string;
  message2: string;
  isActive: boolean;
}

export const BannerManagement = () => {
  const { banners, loading, updateBanner } = useAllBoxBanners();
  const [bannerStates, setBannerStates] = useState<Record<number, BannerState>>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const states: Record<number, BannerState> = {};
    BOX_CONFIGS.forEach(config => {
      const existingBanner = banners.find(b => b.box_id === config.id);
      states[config.id] = {
        message: existingBanner?.message || '',
        message2: existingBanner?.message_2 || '',
        isActive: existingBanner?.is_active ?? false
      };
    });
    setBannerStates(states);
  }, [banners]);

  // Animation pour la prévisualisation
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewIndex(prev => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMessageChange = (boxId: number, field: 'message' | 'message2', value: string) => {
    setBannerStates(prev => ({
      ...prev,
      [boxId]: { ...prev[boxId], [field]: value }
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
    const result = await updateBanner(boxId, state.message, state.message2, state.isActive);
    setSavingIds(prev => prev.filter(id => id !== boxId));

    if (result.success) {
      toast.success('Bandeaux mis à jour avec succès');
    } else {
      toast.error('Erreur lors de la mise à jour des bandeaux');
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
        const state = bannerStates[config.id] || { message: '', message2: '', isActive: false };
        const isSaving = savingIds.includes(config.id);
        const hasMessages = state.message || state.message2;
        const currentMessage = previewIndex === 0 ? state.message : state.message2;
        const displayMessage = currentMessage || state.message || state.message2;

        return (
          <Card key={config.id}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${config.iconColor}`}>
                {config.icon}
                <span className="text-foreground">Bandeaux {config.name}</span>
              </CardTitle>
              <CardDescription>
                Configurez 2 messages qui défileront automatiquement sur la {config.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`message1-${config.id}`}>Message 1</Label>
                  <Input
                    id={`message1-${config.id}`}
                    value={state.message}
                    onChange={(e) => handleMessageChange(config.id, 'message', e.target.value)}
                    placeholder={config.placeholder1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`message2-${config.id}`}>Message 2</Label>
                  <Input
                    id={`message2-${config.id}`}
                    value={state.message2}
                    onChange={(e) => handleMessageChange(config.id, 'message2', e.target.value)}
                    placeholder={config.placeholder2}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`active-${config.id}`}
                  checked={state.isActive}
                  onCheckedChange={(checked) => handleActiveChange(config.id, checked)}
                />
                <Label htmlFor={`active-${config.id}`}>Afficher les bandeaux</Label>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <Button onClick={() => handleSave(config.id)} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Enregistrer
                </Button>

                {state.isActive && hasMessages && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">Prévisualisation (défilement auto) :</span>
                    <div 
                      className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500`}
                    >
                      {displayMessage}
                    </div>
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

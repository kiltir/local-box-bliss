import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, Trash2, Lightbulb, Coffee, Leaf, Sparkles } from 'lucide-react';

interface BoxAdvice {
  id: string;
  box_id: number;
  theme: string;
  info_title: string;
  info_content: string;
  why_title: string;
  why_content: string;
}

interface ProductAdvice {
  id: string;
  product_keyword: string;
  advice_title: string;
  advice_content: string;
  icon_name: string;
  icon_color: string;
}

const ICON_OPTIONS = [
  { value: 'Lightbulb', label: 'Ampoule', icon: Lightbulb },
  { value: 'Coffee', label: 'Café', icon: Coffee },
  { value: 'Leaf', label: 'Feuille', icon: Leaf },
  { value: 'Sparkles', label: 'Étoiles', icon: Sparkles },
];

const COLOR_OPTIONS = [
  { value: 'text-yellow-600', label: 'Jaune' },
  { value: 'text-amber-600', label: 'Ambre' },
  { value: 'text-amber-700', label: 'Ambre foncé' },
  { value: 'text-amber-800', label: 'Marron' },
  { value: 'text-green-600', label: 'Vert' },
  { value: 'text-red-600', label: 'Rouge' },
  { value: 'text-purple-600', label: 'Violet' },
  { value: 'text-orange-600', label: 'Orange' },
  { value: 'text-blue-600', label: 'Bleu' },
];

export const BoxAdviceManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [boxAdvice, setBoxAdvice] = useState<BoxAdvice[]>([]);
  const [productAdvice, setProductAdvice] = useState<ProductAdvice[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('Découverte');
  const [newProductKeyword, setNewProductKeyword] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [boxRes, productRes] = await Promise.all([
        supabase.from('box_advice').select('*').order('box_id'),
        supabase.from('box_product_advice').select('*').order('product_keyword')
      ]);

      if (boxRes.error) throw boxRes.error;
      if (productRes.error) throw productRes.error;

      setBoxAdvice(boxRes.data || []);
      setProductAdvice(productRes.data || []);
    } catch (error) {
      console.error('Error fetching advice data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les conseils',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBoxAdviceChange = (theme: string, field: keyof BoxAdvice, value: string) => {
    setBoxAdvice(prev => prev.map(advice => 
      advice.theme === theme ? { ...advice, [field]: value } : advice
    ));
  };

  const handleProductAdviceChange = (id: string, field: keyof ProductAdvice, value: string) => {
    setProductAdvice(prev => prev.map(advice => 
      advice.id === id ? { ...advice, [field]: value } : advice
    ));
  };

  const saveBoxAdvice = async (theme: string) => {
    setSaving(true);
    try {
      const advice = boxAdvice.find(a => a.theme === theme);
      if (!advice) return;

      const { error } = await supabase
        .from('box_advice')
        .update({
          info_title: advice.info_title,
          info_content: advice.info_content,
          why_title: advice.why_title,
          why_content: advice.why_content
        })
        .eq('id', advice.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: `Conseils de la box ${theme} mis à jour`
      });
    } catch (error) {
      console.error('Error saving box advice:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les conseils',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const saveProductAdvice = async (id: string) => {
    setSaving(true);
    try {
      const advice = productAdvice.find(a => a.id === id);
      if (!advice) return;

      const { error } = await supabase
        .from('box_product_advice')
        .update({
          product_keyword: advice.product_keyword,
          advice_title: advice.advice_title,
          advice_content: advice.advice_content,
          icon_name: advice.icon_name,
          icon_color: advice.icon_color
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Conseil produit mis à jour'
      });
    } catch (error) {
      console.error('Error saving product advice:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le conseil',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addProductAdvice = async () => {
    if (!newProductKeyword.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un mot-clé',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('box_product_advice')
        .insert({
          product_keyword: newProductKeyword.toLowerCase().trim(),
          advice_title: 'Nouveau conseil',
          advice_content: 'Description du conseil...',
          icon_name: 'Lightbulb',
          icon_color: 'text-yellow-600'
        })
        .select()
        .single();

      if (error) throw error;

      setProductAdvice(prev => [...prev, data]);
      setNewProductKeyword('');
      toast({
        title: 'Succès',
        description: 'Nouveau conseil produit ajouté'
      });
    } catch (error: any) {
      console.error('Error adding product advice:', error);
      toast({
        title: 'Erreur',
        description: error.code === '23505' ? 'Ce mot-clé existe déjà' : 'Impossible d\'ajouter le conseil',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteProductAdvice = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce conseil ?')) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('box_product_advice')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductAdvice(prev => prev.filter(a => a.id !== id));
      toast({
        title: 'Succès',
        description: 'Conseil produit supprimé'
      });
    } catch (error) {
      console.error('Error deleting product advice:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le conseil',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find(o => o.value === iconName);
    if (iconOption) {
      const Icon = iconOption.icon;
      return Icon;
    }
    return Lightbulb;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentBoxAdvice = boxAdvice.find(a => a.theme === selectedTheme);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="themes">Conseils par thématique</TabsTrigger>
          <TabsTrigger value="products">Conseils par produit</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Informations et "Pourquoi ?" par thématique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Sélectionner une thématique</Label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="w-full max-w-xs mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Découverte">Box Découverte</SelectItem>
                    <SelectItem value="Bourbon">Box Bourbon</SelectItem>
                    <SelectItem value="Racine">Box Racine</SelectItem>
                    <SelectItem value="Saison">Box Saison</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentBoxAdvice && (
                <div className="space-y-6 border rounded-lg p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-green-700">Section "Informations"</h3>
                    <div>
                      <Label htmlFor="info-title">Titre</Label>
                      <Input
                        id="info-title"
                        value={currentBoxAdvice.info_title}
                        onChange={(e) => handleBoxAdviceChange(selectedTheme, 'info_title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="info-content">Contenu</Label>
                      <Textarea
                        id="info-content"
                        value={currentBoxAdvice.info_content}
                        onChange={(e) => handleBoxAdviceChange(selectedTheme, 'info_content', e.target.value)}
                        className="mt-1 min-h-[120px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-blue-700">Section "Pourquoi ?"</h3>
                    <div>
                      <Label htmlFor="why-title">Titre</Label>
                      <Input
                        id="why-title"
                        value={currentBoxAdvice.why_title}
                        onChange={(e) => handleBoxAdviceChange(selectedTheme, 'why_title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="why-content">Contenu</Label>
                      <Textarea
                        id="why-content"
                        value={currentBoxAdvice.why_content}
                        onChange={(e) => handleBoxAdviceChange(selectedTheme, 'why_content', e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveBoxAdvice(selectedTheme)} 
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Enregistrer les modifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Conseils par type de produit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Nouveau mot-clé (ex: rhum, sucre...)"
                  value={newProductKeyword}
                  onChange={(e) => setNewProductKeyword(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addProductAdvice} disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Les conseils s'affichent automatiquement si le nom d'un produit contient le mot-clé défini.
              </p>

              <div className="space-y-4">
                {productAdvice.map((advice) => {
                  const IconComponent = getIconComponent(advice.icon_name);
                  return (
                    <div key={advice.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-5 w-5 ${advice.icon_color}`} />
                          <span className="font-medium">Mot-clé: "{advice.product_keyword}"</span>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteProductAdvice(advice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Mot-clé</Label>
                          <Input
                            value={advice.product_keyword}
                            onChange={(e) => handleProductAdviceChange(advice.id, 'product_keyword', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Titre du conseil</Label>
                          <Input
                            value={advice.advice_title}
                            onChange={(e) => handleProductAdviceChange(advice.id, 'advice_title', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Contenu du conseil</Label>
                        <Textarea
                          value={advice.advice_content}
                          onChange={(e) => handleProductAdviceChange(advice.id, 'advice_content', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Icône</Label>
                          <Select 
                            value={advice.icon_name} 
                            onValueChange={(v) => handleProductAdviceChange(advice.id, 'icon_name', v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="h-4 w-4" />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Couleur</Label>
                          <Select 
                            value={advice.icon_color} 
                            onValueChange={(v) => handleProductAdviceChange(advice.id, 'icon_color', v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLOR_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full bg-current ${opt.value}`} />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        onClick={() => saveProductAdvice(advice.id)} 
                        disabled={saving}
                        variant="outline"
                        className="w-full"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Enregistrer ce conseil
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoxAdviceManagement;

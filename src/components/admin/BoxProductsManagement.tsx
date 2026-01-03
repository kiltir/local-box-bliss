import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2, Package, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BoxProduct {
  id: string;
  box_id: number;
  theme: string;
  name: string;
  quantity: string;
  producer: string;
  description: string | null;
  weight: number;
  dimension_width: number;
  dimension_height: number;
  dimension_depth: number;
  image_url: string | null;
  display_order: number;
  is_visible: boolean;
}

const THEMES = [
  { id: 'Découverte', boxId: 1, label: 'Découverte' },
  { id: 'Bourbon', boxId: 2, label: 'Bourbon' },
  { id: 'Racine', boxId: 3, label: 'Racine' },
  { id: 'Saison', boxId: 4, label: 'Saison' },
];

export const BoxProductsManagement = () => {
  const [products, setProducts] = useState<BoxProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('Découverte');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    producer: '',
    description: '',
    weight: 0,
    dimension_width: 0,
    dimension_height: 0,
    dimension_depth: 0,
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('box_products')
      .select('*')
      .order('theme')
      .order('display_order');

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleUpdateProduct = async (product: BoxProduct) => {
    setSaving(product.id);
    const { error } = await supabase
      .from('box_products')
      .update({
        name: product.name,
        quantity: product.quantity,
        producer: product.producer,
        description: product.description,
        weight: product.weight,
        dimension_width: product.dimension_width,
        dimension_height: product.dimension_height,
        dimension_depth: product.dimension_depth,
        image_url: product.image_url,
        display_order: product.display_order,
        is_visible: product.is_visible,
      })
      .eq('id', product.id);

    if (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success('Produit mis à jour');
    }
    setSaving(null);
  };

  const toggleProductVisibility = async (productId: string, isVisible: boolean) => {
    // Update locally first for immediate feedback
    setProducts(products.map(p => 
      p.id === productId ? { ...p, is_visible: isVisible } : p
    ));
    
    const { error } = await supabase
      .from('box_products')
      .update({ is_visible: isVisible })
      .eq('id', productId);

    if (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Erreur lors de la mise à jour de la visibilité');
      // Revert on error
      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_visible: !isVisible } : p
      ));
    } else {
      toast.success(isVisible ? 'Produit visible' : 'Produit masqué');
    }
  };

  const handleAddProduct = async () => {
    const themeData = THEMES.find(t => t.id === selectedTheme);
    if (!themeData) return;

    const { error } = await supabase
      .from('box_products')
      .insert({
        box_id: themeData.boxId,
        theme: selectedTheme,
        name: newProduct.name,
        quantity: newProduct.quantity,
        producer: newProduct.producer,
        description: newProduct.description || null,
        weight: newProduct.weight,
        dimension_width: newProduct.dimension_width,
        dimension_height: newProduct.dimension_height,
        dimension_depth: newProduct.dimension_depth,
        image_url: newProduct.image_url || null,
        display_order: products.filter(p => p.theme === selectedTheme).length,
      });

    if (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout');
    } else {
      toast.success('Produit ajouté');
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        quantity: '',
        producer: '',
        description: '',
        weight: 0,
        dimension_width: 0,
        dimension_height: 0,
        dimension_depth: 0,
        image_url: '',
      });
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('box_products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Produit supprimé');
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const updateLocalProduct = (productId: string, field: keyof BoxProduct, value: any) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  const moveProduct = async (productId: string, direction: 'up' | 'down') => {
    const themeProducts = products
      .filter(p => p.theme === selectedTheme)
      .sort((a, b) => a.display_order - b.display_order);
    
    const currentIndex = themeProducts.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= themeProducts.length) return;
    
    // Swap display_order values
    const currentProduct = themeProducts[currentIndex];
    const swapProduct = themeProducts[newIndex];
    
    const currentOrder = currentProduct.display_order;
    const swapOrder = swapProduct.display_order;
    
    // Update locally first for immediate feedback
    setProducts(products.map(p => {
      if (p.id === currentProduct.id) return { ...p, display_order: swapOrder };
      if (p.id === swapProduct.id) return { ...p, display_order: currentOrder };
      return p;
    }));
    
    // Update in database
    const { error: error1 } = await supabase
      .from('box_products')
      .update({ display_order: swapOrder })
      .eq('id', currentProduct.id);
    
    const { error: error2 } = await supabase
      .from('box_products')
      .update({ display_order: currentOrder })
      .eq('id', swapProduct.id);
    
    if (error1 || error2) {
      console.error('Error reordering products:', error1 || error2);
      toast.error('Erreur lors du réordonnancement');
      fetchProducts(); // Reload to sync state
    } else {
      toast.success('Ordre mis à jour');
    }
  };

  const filteredProducts = products
    .filter(p => p.theme === selectedTheme)
    .sort((a, b) => a.display_order - b.display_order);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Gestion des Produits par Box
        </h2>
      </div>

      <Tabs value={selectedTheme} onValueChange={setSelectedTheme}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {THEMES.map(theme => (
              <TabsTrigger key={theme.id} value={theme.id}>
                {theme.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un produit à {selectedTheme}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Nom du produit *</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ex: Vanille Bourbon"
                  />
                </div>
                <div>
                  <Label>Quantité *</Label>
                  <Input
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    placeholder="Ex: 3 gousses"
                  />
                </div>
                <div>
                  <Label>Producteur *</Label>
                  <Input
                    value={newProduct.producer}
                    onChange={(e) => setNewProduct({ ...newProduct, producer: e.target.value })}
                    placeholder="Ex: Vanille de Bourbon"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Description optionnelle"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Poids (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={newProduct.weight}
                      onChange={(e) => setNewProduct({ ...newProduct, weight: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>URL Image</Label>
                    <Input
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      placeholder="/path/to/image.png"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Largeur (cm)</Label>
                    <Input
                      type="number"
                      value={newProduct.dimension_width}
                      onChange={(e) => setNewProduct({ ...newProduct, dimension_width: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Hauteur (cm)</Label>
                    <Input
                      type="number"
                      value={newProduct.dimension_height}
                      onChange={(e) => setNewProduct({ ...newProduct, dimension_height: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Profondeur (cm)</Label>
                    <Input
                      type="number"
                      value={newProduct.dimension_depth}
                      onChange={(e) => setNewProduct({ ...newProduct, dimension_depth: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.quantity || !newProduct.producer}
                >
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {THEMES.map(theme => (
          <TabsContent key={theme.id} value={theme.id} className="space-y-4">
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Aucun produit pour cette thématique. Ajoutez-en un !
                </CardContent>
              </Card>
            ) : (
              filteredProducts.map((product, index) => (
                <Collapsible
                  key={product.id}
                  open={expandedProducts.has(product.id)}
                  onOpenChange={() => toggleProductExpanded(product.id)}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Order controls */}
                          <div className="flex flex-col gap-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5"
                              onClick={() => moveProduct(product.id, 'up')}
                              disabled={index === 0}
                              title="Monter"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5"
                              onClick={() => moveProduct(product.id, 'down')}
                              disabled={index === filteredProducts.length - 1}
                              title="Descendre"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Order number badge */}
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            {index + 1}
                          </span>
                          
                          <CollapsibleTrigger asChild>
                            <button className="flex items-center gap-2 text-left hover:text-primary transition-colors">
                              {expandedProducts.has(product.id) ? (
                                <ChevronDown className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className={!product.is_visible ? 'text-muted-foreground line-through' : ''}>
                                {product.name}
                              </span>
                              {!product.is_visible && (
                                <span className="text-xs text-muted-foreground ml-2">(masqué)</span>
                              )}
                            </button>
                          </CollapsibleTrigger>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Visibility toggle */}
                          <div className="flex items-center gap-2">
                            {product.is_visible ? (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Switch
                              checked={product.is_visible}
                              onCheckedChange={(checked) => toggleProductVisibility(product.id, checked)}
                              title={product.is_visible ? 'Masquer le produit' : 'Afficher le produit'}
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateProduct(product)}
                            disabled={saving === product.id}
                          >
                            {saving === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Le produit "{product.name}" sera définitivement supprimé.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="space-y-4 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nom du produit</Label>
                            <Input
                              value={product.name}
                              onChange={(e) => updateLocalProduct(product.id, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Quantité</Label>
                            <Input
                              value={product.quantity}
                              onChange={(e) => updateLocalProduct(product.id, 'quantity', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Producteur</Label>
                            <Input
                              value={product.producer}
                              onChange={(e) => updateLocalProduct(product.id, 'producer', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Poids (kg)</Label>
                            <Input
                              type="number"
                              step="0.001"
                              value={product.weight}
                              onChange={(e) => updateLocalProduct(product.id, 'weight', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={product.description || ''}
                            onChange={(e) => updateLocalProduct(product.id, 'description', e.target.value)}
                            placeholder="Description optionnelle du produit"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Largeur (cm)</Label>
                            <Input
                              type="number"
                              value={product.dimension_width}
                              onChange={(e) => updateLocalProduct(product.id, 'dimension_width', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label>Hauteur (cm)</Label>
                            <Input
                              type="number"
                              value={product.dimension_height}
                              onChange={(e) => updateLocalProduct(product.id, 'dimension_height', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label>Profondeur (cm)</Label>
                            <Input
                              type="number"
                              value={product.dimension_depth}
                              onChange={(e) => updateLocalProduct(product.id, 'dimension_depth', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>URL de l'image</Label>
                          <Input
                            value={product.image_url || ''}
                            onChange={(e) => updateLocalProduct(product.id, 'image_url', e.target.value)}
                            placeholder="/path/to/image.png"
                          />
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
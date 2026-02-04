import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Plus, Image as ImageIcon, GripVertical, Box, Save } from 'lucide-react';
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

interface BoxImage {
  id: string;
  box_id: number;
  image_url: string;
  display_order: number;
  created_at: string;
}

interface BoxDimensions {
  id: string;
  box_id: number;
  theme: string;
  weight_limit: number;
  width: number;
  height: number;
  depth: number;
  shipping_box_weight: number;
}

const BOX_THEMES = [
  { id: 1, name: 'Découverte', theme: 'Découverte' },
  { id: 2, name: 'Racine', theme: 'Racine' },
  { id: 3, name: 'Bourbon', theme: 'Bourbon' },
  { id: 4, name: 'Saison', theme: 'Saison' },
];

export const BoxDetailsImagesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBoxId, setSelectedBoxId] = useState<number>(1);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // State for dimensions editing
  const [dimensionsForm, setDimensionsForm] = useState({
    weight_limit: 2,
    width: 30,
    height: 18,
    depth: 8,
    shipping_box_weight: 0.3,
  });

  const { data: images, isLoading } = useQuery({
    queryKey: ['box-images-admin', selectedBoxId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_images')
        .select('*')
        .eq('box_id', selectedBoxId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as BoxImage[];
    },
  });

  // Query for box dimensions
  const currentBox = BOX_THEMES.find(b => b.id === selectedBoxId);
  const { data: dimensions, isLoading: isDimensionsLoading } = useQuery({
    queryKey: ['box-dimensions-admin', currentBox?.theme],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('box_dimensions')
        .select('*')
        .eq('theme', currentBox?.theme)
        .maybeSingle();

      if (error) throw error;
      return data as BoxDimensions | null;
    },
    enabled: !!currentBox?.theme,
  });

  // Update form when dimensions data changes
  useEffect(() => {
    if (dimensions) {
      setDimensionsForm({
        weight_limit: dimensions.weight_limit,
        width: dimensions.width,
        height: dimensions.height,
        depth: dimensions.depth,
        shipping_box_weight: dimensions.shipping_box_weight ?? 0.3,
      });
    }
  }, [dimensions]);

  // Mutation for updating dimensions
  const updateDimensionsMutation = useMutation({
    mutationFn: async (newDimensions: typeof dimensionsForm) => {
      if (!dimensions?.id) {
        // Insert if not exists
        const { error } = await supabase
          .from('box_dimensions')
          .insert({
            box_id: selectedBoxId,
            theme: currentBox?.theme,
            ...newDimensions,
          });
        if (error) throw error;
      } else {
        // Update existing
        const { error } = await supabase
          .from('box_dimensions')
          .update(newDimensions)
          .eq('id', dimensions.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box-dimensions-admin'] });
      queryClient.invalidateQueries({ queryKey: ['box-dimensions'] });
      toast({
        title: 'Dimensions mises à jour',
        description: 'Le poids et les dimensions de la box ont été enregistrés.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les dimensions.',
        variant: 'destructive',
      });
    },
  });

  const addImageMutation = useMutation({
    mutationFn: async ({ imageUrl }: { imageUrl: string }) => {
      const maxOrder = images?.reduce((max, img) => Math.max(max, img.display_order), -1) ?? -1;
      
      const { error } = await supabase
        .from('box_images')
        .insert({
          box_id: selectedBoxId,
          image_url: imageUrl,
          display_order: maxOrder + 1,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box-images-admin', selectedBoxId] });
      queryClient.invalidateQueries({ queryKey: ['box-images'] });
      setNewImageUrl('');
      toast({
        title: 'Image ajoutée',
        description: "L'image a été ajoutée à la box.",
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter l'image.",
        variant: 'destructive',
      });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      const { error } = await supabase
        .from('box_images')
        .update({ image_url: imageUrl })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box-images-admin', selectedBoxId] });
      queryClient.invalidateQueries({ queryKey: ['box-images'] });
      toast({
        title: 'Image mise à jour',
        description: "L'URL de l'image a été modifiée.",
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de modifier l'image.",
        variant: 'destructive',
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('box_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box-images-admin', selectedBoxId] });
      queryClient.invalidateQueries({ queryKey: ['box-images'] });
      toast({
        title: 'Image supprimée',
        description: "L'image a été supprimée de la box.",
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'image.",
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `box-${selectedBoxId}-${Date.now()}.${fileExt}`;
      const filePath = `box-details/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('box-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('box-images')
        .getPublicUrl(filePath);

      setNewImageUrl(publicUrl);
      toast({
        title: 'Image uploadée',
        description: 'Cliquez sur "Ajouter" pour confirmer.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'uploader l'image.",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner ou entrer une URL d\'image.',
        variant: 'destructive',
      });
      return;
    }
    addImageMutation.mutate({ imageUrl: newImageUrl.trim() });
  };

  // currentBox is already defined above

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Gestion des images - Détails des Box
          </CardTitle>
          <CardDescription>
            Gérez les images du carrousel affiché dans la fenêtre de détails de chaque box
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Box theme selector */}
          <Tabs 
            value={selectedBoxId.toString()} 
            onValueChange={(v) => setSelectedBoxId(parseInt(v))}
          >
            <TabsList className="grid w-full grid-cols-4">
              {BOX_THEMES.map((box) => (
                <TabsTrigger key={box.id} value={box.id.toString()}>
                  {box.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Add new image form */}
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <h3 className="font-medium">
              Ajouter une image à la box {currentBox?.name}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Uploader une image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-url">Ou entrez une URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
              </div>
            </div>
            {newImageUrl && (
              <div className="flex items-center gap-4">
                <img
                  src={newImageUrl}
                  alt="Aperçu"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <Button
                  onClick={handleAddImage}
                  disabled={addImageMutation.isPending}
                >
                  {addImageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Ajouter à la box
                </Button>
              </div>
            )}
          </div>

          {/* Images list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">
                Images de la box {currentBox?.name} ({images?.length || 0})
              </h3>
              {images?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune image pour cette box. Ajoutez-en une ci-dessus.
                </p>
              ) : (
                <div className="space-y-3">
                  {images?.map((image, index) => (
                    <ImageRow
                      key={image.id}
                      image={image}
                      index={index}
                      onUpdate={(id, url) => updateImageMutation.mutate({ id, imageUrl: url })}
                      onDelete={(id) => deleteImageMutation.mutate(id)}
                      isUpdating={updateImageMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Box Dimensions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Dimensions et poids de la box {currentBox?.name}
          </CardTitle>
          <CardDescription>
            Modifiez les limites de poids et les dimensions physiques de la box
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isDimensionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Weight limit */}
              <div className="space-y-2">
                <Label htmlFor="weight-limit">Limite de poids (kg)</Label>
                <Input
                  id="weight-limit"
                  type="number"
                  step="0.1"
                  min="0"
                  value={dimensionsForm.weight_limit}
                  onChange={(e) => setDimensionsForm(prev => ({
                    ...prev,
                    weight_limit: parseFloat(e.target.value) || 0,
                  }))}
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground">
                  Poids maximum autorisé pour les produits dans la box
                </p>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <Label>Dimensions de la box (cm)</Label>
                <div className="grid gap-4 md:grid-cols-3 max-w-lg">
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-sm text-muted-foreground">
                      Largeur
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      min="0"
                      value={dimensionsForm.width}
                      onChange={(e) => setDimensionsForm(prev => ({
                        ...prev,
                        width: parseFloat(e.target.value) || 0,
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm text-muted-foreground">
                      Hauteur
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      min="0"
                      value={dimensionsForm.height}
                      onChange={(e) => setDimensionsForm(prev => ({
                        ...prev,
                        height: parseFloat(e.target.value) || 0,
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth" className="text-sm text-muted-foreground">
                      Profondeur
                    </Label>
                    <Input
                      id="depth"
                      type="number"
                      step="0.1"
                      min="0"
                      value={dimensionsForm.depth}
                      onChange={(e) => setDimensionsForm(prev => ({
                        ...prev,
                        depth: parseFloat(e.target.value) || 0,
                      }))}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Volume calculé : {(dimensionsForm.width * dimensionsForm.height * dimensionsForm.depth).toLocaleString('fr-FR')} cm³
                </p>
              </div>

              {/* Shipping box weight */}
              <div className="space-y-2">
                <Label htmlFor="shipping-box-weight">Poids du carton d'expédition (kg)</Label>
                <Input
                  id="shipping-box-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={dimensionsForm.shipping_box_weight}
                  onChange={(e) => setDimensionsForm(prev => ({
                    ...prev,
                    shipping_box_weight: parseFloat(e.target.value) || 0,
                  }))}
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground">
                  Poids du carton vide à ajouter au poids des produits pour le calcul du poids total d'expédition
                </p>
              </div>

              {/* Save button */}
              <Button
                onClick={() => updateDimensionsMutation.mutate(dimensionsForm)}
                disabled={updateDimensionsMutation.isPending}
                className="mt-4"
              >
                {updateDimensionsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Enregistrer les dimensions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface ImageRowProps {
  image: BoxImage;
  index: number;
  onUpdate: (id: string, url: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}

const ImageRow = ({ image, index, onUpdate, onDelete, isUpdating }: ImageRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(image.image_url);

  const handleSave = () => {
    if (editUrl.trim() && editUrl !== image.image_url) {
      onUpdate(image.id, editUrl.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-card">
      <div className="flex items-center gap-2 text-muted-foreground">
        <GripVertical className="h-4 w-4" />
        <span className="text-sm font-medium w-6">{index + 1}</span>
      </div>
      
      <img
        src={image.image_url}
        alt={`Image ${index + 1}`}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="URL de l'image"
              className="flex-1"
            />
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sauvegarder'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              setEditUrl(image.image_url);
              setIsEditing(false);
            }}>
              Annuler
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground truncate flex-1">
              {image.image_url}
            </span>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
          </div>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" className="flex-shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'image sera définitivement
              supprimée de la box.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(image.id)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

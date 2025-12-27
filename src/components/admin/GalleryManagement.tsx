import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Plus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
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

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export const GalleryManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery-images-admin'],
    queryFn: async () => {
      // Use service role through RPC or direct query with admin context
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const addImageMutation = useMutation({
    mutationFn: async ({ imageUrl, title }: { imageUrl: string; title: string }) => {
      const maxOrder = images?.reduce((max, img) => Math.max(max, img.display_order), -1) ?? -1;
      
      const { error } = await supabase
        .from('gallery_images')
        .insert({
          image_url: imageUrl,
          title: title || null,
          display_order: maxOrder + 1,
          is_active: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      setNewImageUrl('');
      setNewImageTitle('');
      toast({
        title: 'Image ajoutée',
        description: "L'image a été ajoutée à la galerie.",
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

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast({
        title: 'Visibilité mise à jour',
        description: 'La visibilité de l\'image a été modifiée.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la visibilité.',
        variant: 'destructive',
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast({
        title: 'Image supprimée',
        description: "L'image a été supprimée de la galerie.",
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
      const fileName = `gallery-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

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
    addImageMutation.mutate({ imageUrl: newImageUrl.trim(), title: newImageTitle.trim() });
  };

  if (isLoading) {
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
            <ImageIcon className="h-5 w-5" />
            Gestion de la galerie
          </CardTitle>
          <CardDescription>
            Gérez les images du carrousel "Une expérience inédite à partager ?"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new image form */}
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <h3 className="font-medium">Ajouter une nouvelle image</h3>
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
            <div className="space-y-2">
              <Label htmlFor="image-title">Titre (optionnel)</Label>
              <Input
                id="image-title"
                placeholder="Description de l'image"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
              />
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
                  Ajouter à la galerie
                </Button>
              </div>
            )}
          </div>

          {/* Images list */}
          <div className="space-y-4">
            <h3 className="font-medium">Images de la galerie ({images?.length || 0})</h3>
            {images?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucune image dans la galerie. Ajoutez-en une ci-dessus.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {images?.map((image) => (
                  <div
                    key={image.id}
                    className={`relative border rounded-lg overflow-hidden ${
                      !image.is_active ? 'opacity-50' : ''
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || 'Image galerie'}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {image.title && (
                        <p className="text-white text-sm mb-2 truncate">{image.title}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={image.is_active}
                            onCheckedChange={(checked) =>
                              toggleActiveMutation.mutate({ id: image.id, isActive: checked })
                            }
                          />
                          <span className="text-white text-xs flex items-center gap-1">
                            {image.is_active ? (
                              <>
                                <Eye className="h-3 w-3" /> Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" /> Masqué
                              </>
                            )}
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. L'image sera définitivement
                                supprimée de la galerie.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteImageMutation.mutate(image.id)}
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

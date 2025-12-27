import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Partner {
  id: string;
  raison_sociale: string;
  secteur_activite: string;
  description: string;
  display_order: number;
  is_active: boolean;
  image_url: string | null;
}

export function PartnersManagement() {
  const queryClient = useQueryClient();
  const [expandedPartners, setExpandedPartners] = useState<Set<string>>(new Set());
  const [editedPartners, setEditedPartners] = useState<Record<string, Partial<Partner>>>({});
  const [newPartnerImage, setNewPartnerImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const [newPartner, setNewPartner] = useState({
    raison_sociale: "",
    secteur_activite: "",
    description: "",
    display_order: 0,
    is_active: true,
  });

  const { data: partners, isLoading } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Partner[];
    },
  });

  const uploadImage = async (file: File, partnerId?: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${partnerId || 'new'}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('partner-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('partner-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (partner: typeof newPartner & { image_url?: string }) => {
      let imageUrl = null;
      if (newPartnerImage) {
        imageUrl = await uploadImage(newPartnerImage);
      }
      const { error } = await supabase.from("partners").insert({
        ...partner,
        image_url: imageUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      setNewPartner({
        raison_sociale: "",
        secteur_activite: "",
        description: "",
        display_order: 0,
        is_active: true,
      });
      setNewPartnerImage(null);
      if (newImageInputRef.current) {
        newImageInputRef.current.value = '';
      }
      toast.success("Partenaire créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du partenaire");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Partner> }) => {
      const { error } = await supabase.from("partners").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      toast.success("Partenaire mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      toast.success("Partenaire supprimé");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const toggleExpanded = (id: string) => {
    setExpandedPartners((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePartnerChange = (id: string, field: keyof Partner, value: string | number | boolean) => {
    setEditedPartners((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const getPartnerValue = (partner: Partner, field: keyof Partner) => {
    return editedPartners[partner.id]?.[field] ?? partner[field];
  };

  const savePartner = (id: string) => {
    const updates = editedPartners[id];
    if (updates) {
      updateMutation.mutate({ id, updates });
      setEditedPartners((prev) => {
        const newEdited = { ...prev };
        delete newEdited[id];
        return newEdited;
      });
    }
  };

  const handleImageUpload = async (partnerId: string, file: File) => {
    setUploadingImage(partnerId);
    const imageUrl = await uploadImage(file, partnerId);
    if (imageUrl) {
      updateMutation.mutate({ id: partnerId, updates: { image_url: imageUrl } });
    } else {
      toast.error("Erreur lors de l'upload de l'image");
    }
    setUploadingImage(null);
  };

  const removeImage = (partnerId: string) => {
    updateMutation.mutate({ id: partnerId, updates: { image_url: null } });
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Formulaire de création */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un partenaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Raison sociale</Label>
              <Input
                value={newPartner.raison_sociale}
                onChange={(e) => setNewPartner({ ...newPartner, raison_sociale: e.target.value })}
                placeholder="Nom du partenaire"
              />
            </div>
            <div className="space-y-2">
              <Label>Secteur d'activité (badge)</Label>
              <Input
                value={newPartner.secteur_activite}
                onChange={(e) => setNewPartner({ ...newPartner, secteur_activite: e.target.value })}
                placeholder="Ex: Agriculture, Artisanat..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newPartner.description}
              onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
              placeholder="Description du partenaire..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Photo du partenaire</Label>
            <div className="flex items-center gap-4">
              <Input
                ref={newImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setNewPartnerImage(e.target.files?.[0] || null)}
                className="flex-1"
              />
              {newPartnerImage && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{newPartnerImage.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setNewPartnerImage(null);
                      if (newImageInputRef.current) {
                        newImageInputRef.current.value = '';
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ordre d'affichage</Label>
              <Input
                type="number"
                value={newPartner.display_order}
                onChange={(e) => setNewPartner({ ...newPartner, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={newPartner.is_active}
                onCheckedChange={(checked) => setNewPartner({ ...newPartner, is_active: checked })}
              />
              <Label>Actif</Label>
            </div>
          </div>
          <Button
            onClick={() => createMutation.mutate(newPartner)}
            disabled={!newPartner.raison_sociale || !newPartner.secteur_activite || createMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le partenaire
          </Button>
        </CardContent>
      </Card>

      {/* Liste des partenaires */}
      <Card>
        <CardHeader>
          <CardTitle>Partenaires existants ({partners?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {partners?.map((partner) => (
            <Collapsible
              key={partner.id}
              open={expandedPartners.has(partner.id)}
              onOpenChange={() => toggleExpanded(partner.id)}
            >
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                    {expandedPartners.has(partner.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{getPartnerValue(partner, "raison_sociale")}</span>
                    <span className="text-sm text-muted-foreground">
                      ({getPartnerValue(partner, "secteur_activite")})
                    </span>
                    {!partner.is_active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactif</span>
                    )}
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => savePartner(partner.id)}
                      disabled={!editedPartners[partner.id] || updateMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Sauvegarder
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(partner.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Raison sociale</Label>
                      <Input
                        value={getPartnerValue(partner, "raison_sociale") as string}
                        onChange={(e) => handlePartnerChange(partner.id, "raison_sociale", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Secteur d'activité (badge)</Label>
                      <Input
                        value={getPartnerValue(partner, "secteur_activite") as string}
                        onChange={(e) => handlePartnerChange(partner.id, "secteur_activite", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={getPartnerValue(partner, "description") as string}
                      onChange={(e) => handlePartnerChange(partner.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Photo du partenaire</Label>
                    {partner.image_url ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={partner.image_url}
                          alt={partner.raison_sociale}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeImage(partner.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(partner.id, file);
                            }
                          }}
                          disabled={uploadingImage === partner.id}
                          className="flex-1"
                        />
                        {uploadingImage === partner.id && (
                          <span className="text-sm text-muted-foreground">Upload en cours...</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ordre d'affichage</Label>
                      <Input
                        type="number"
                        value={getPartnerValue(partner, "display_order") as number}
                        onChange={(e) => handlePartnerChange(partner.id, "display_order", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Switch
                        checked={getPartnerValue(partner, "is_active") as boolean}
                        onCheckedChange={(checked) => handlePartnerChange(partner.id, "is_active", checked)}
                      />
                      <Label>Actif</Label>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
          {partners?.length === 0 && (
            <p className="text-muted-foreground text-center py-4">Aucun partenaire</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

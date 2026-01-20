import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, X, Upload, Loader2 } from "lucide-react";
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
  const { user } = useAuth();

  const [expandedPartners, setExpandedPartners] = useState<Set<string>>(new Set());
  const [editedPartners, setEditedPartners] = useState<Record<string, Partial<Partner>>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingPartnerId, setUploadingPartnerId] = useState<string | null>(null);
  const [newPartner, setNewPartner] = useState({
    raison_sociale: "",
    secteur_activite: "",
    description: "",
    display_order: 0,
    is_active: true,
    image_url: "",
  });

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("partner-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("partner-images")
        .getPublicUrl(filePath);

      setNewPartner({ ...newPartner, image_url: publicUrlData.publicUrl });
      toast.success("Image téléchargée avec succès");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditFileUpload = async (partnerId: string, file: File) => {
    if (!file) return;

    setUploadingPartnerId(partnerId);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("partner-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("partner-images")
        .getPublicUrl(filePath);

      handlePartnerChange(partnerId, "image_url", publicUrlData.publicUrl);
      toast.success("Image téléchargée avec succès");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploadingPartnerId(null);
    }
  };

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

  const createMutation = useMutation({
    mutationFn: async (partner: typeof newPartner) => {
      const { error } = await supabase.from("partners").insert({
        ...partner,
        image_url: partner.image_url || null,
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
        image_url: "",
      });
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
    onError: (error: any) => {
      console.error("[PartnersManagement] Update failed:", error);
      const message = [
        error?.message,
        error?.details ? `Détails: ${error.details}` : null,
        error?.hint ? `Hint: ${error.hint}` : null,
        error?.code ? `Code: ${error.code}` : null,
      ]
        .filter(Boolean)
        .join(" • ");

      toast.error(message || "Erreur lors de la mise à jour");
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
    if (!user) {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    const updates = editedPartners[id];
    if (!updates) return;

    const normalizedUpdates: Partial<Partner> = {
      ...updates,
      image_url: updates.image_url === "" ? null : updates.image_url,
    };

    updateMutation.mutate(
      { id, updates: normalizedUpdates },
      {
        onSuccess: () => {
          setEditedPartners((prev) => {
            const newEdited = { ...prev };
            delete newEdited[id];
            return newEdited;
          });
        },
      }
    );
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Uploader une image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="flex-1"
                />
                {isUploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Ou entrez une URL</Label>
              <Input
                value={newPartner.image_url}
                onChange={(e) => setNewPartner({ ...newPartner, image_url: e.target.value })}
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
            {newPartner.image_url && (
              <div className="flex items-center gap-4">
                <img
                  src={newPartner.image_url}
                  alt="Aperçu"
                  className="w-16 h-16 object-cover rounded-lg border"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNewPartner({ ...newPartner, image_url: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Uploader une nouvelle image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={uploadingPartnerId === partner.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEditFileUpload(partner.id, file);
                          }}
                          className="flex-1"
                        />
                        {uploadingPartnerId === partner.id && (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Ou entrez une URL</Label>
                      <Input
                        value={getPartnerValue(partner, "image_url") as string || ""}
                        onChange={(e) => handlePartnerChange(partner.id, "image_url", e.target.value)}
                        placeholder="https://exemple.com/image.jpg"
                      />
                    </div>
                    {getPartnerValue(partner, "image_url") && (
                      <div className="flex items-center gap-4">
                        <img
                          src={getPartnerValue(partner, "image_url") as string}
                          alt={partner.raison_sociale}
                          className="w-16 h-16 object-cover rounded-lg border"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePartnerChange(partner.id, "image_url", "")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
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

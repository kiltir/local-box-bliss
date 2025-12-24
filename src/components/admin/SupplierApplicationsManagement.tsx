import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X, Eye, Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupplierApplication {
  id: string;
  nom: string;
  raison_sociale: string;
  siret: string;
  adresse: string;
  code_postal: string;
  ville: string;
  email: string;
  telephone: string;
  activite: string;
  motivation: string;
  produits: string;
  source: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface SupplierPhoto {
  id: string;
  photo_url: string;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  approved: { label: "Approuvée", variant: "default" },
  rejected: { label: "Refusée", variant: "destructive" },
};

const SupplierApplicationsManagement = () => {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<SupplierApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["supplier-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supplier_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SupplierApplication[];
    },
  });

  const { data: photos } = useQuery({
    queryKey: ["supplier-application-photos", selectedApplication?.id],
    queryFn: async () => {
      if (!selectedApplication) return [];
      const { data, error } = await supabase
        .from("supplier_application_photos")
        .select("*")
        .eq("application_id", selectedApplication.id);

      if (error) throw error;
      return data as SupplierPhoto[];
    },
    enabled: !!selectedApplication,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { error } = await supabase
        .from("supplier_applications")
        .update({ status, admin_notes: notes })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-applications"] });
      toast.success("Candidature mise à jour");
      setSelectedApplication(null);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("supplier_applications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-applications"] });
      toast.success("Candidature supprimée");
      setSelectedApplication(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleOpenDetails = (application: SupplierApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.admin_notes || "");
  };

  const handleUpdateStatus = (status: string) => {
    if (selectedApplication) {
      updateMutation.mutate({
        id: selectedApplication.id,
        status,
        notes: adminNotes,
      });
    }
  };

  const filteredApplications = applications?.filter((app) =>
    statusFilter === "all" ? true : app.status === statusFilter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Candidatures Fournisseurs</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvées</SelectItem>
            <SelectItem value="rejected">Refusées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune candidature {statusFilter !== "all" ? `(${statusLabels[statusFilter]?.label})` : ""}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications?.map((application) => (
            <Card key={application.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{application.raison_sociale}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {application.nom} - {application.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusLabels[application.status]?.variant || "secondary"}>
                      {statusLabels[application.status]?.label || application.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {application.activite}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Reçue le {new Date(application.created_at).toLocaleDateString("fr-FR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p>{selectedApplication.nom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Raison sociale</p>
                  <p>{selectedApplication.raison_sociale}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SIRET</p>
                  <p>{selectedApplication.siret}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p>{selectedApplication.telephone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                  <p>
                    {selectedApplication.adresse}, {selectedApplication.code_postal}{" "}
                    {selectedApplication.ville}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Activité</p>
                <p className="text-sm whitespace-pre-wrap">{selectedApplication.activite}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Motivation</p>
                <p className="text-sm whitespace-pre-wrap">{selectedApplication.motivation}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Produits proposés</p>
                <p className="text-sm whitespace-pre-wrap">{selectedApplication.produits}</p>
              </div>

              {selectedApplication.source && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Source</p>
                  <p className="text-sm">{selectedApplication.source}</p>
                </div>
              )}

              {photos && photos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Photos</p>
                  <div className="flex gap-2 flex-wrap">
                    {photos.map((photo) => (
                      <a
                        key={photo.id}
                        href={photo.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                      >
                        <img
                          src={photo.photo_url}
                          alt="Photo produit"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Notes administratives</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ajouter des notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(selectedApplication.id)}
                  disabled={updateMutation.isPending || deleteMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={updateMutation.isPending || deleteMutation.isPending}
                >
                  Refuser
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={updateMutation.isPending || deleteMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approuver
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierApplicationsManagement;

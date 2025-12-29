import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const supplierFormSchema = z.object({
  nom: z.string().trim().min(1, {
    message: "Le nom est requis"
  }).max(100, {
    message: "Le nom ne peut pas dépasser 100 caractères"
  }),
  raisonSociale: z.string().trim().min(1, {
    message: "La raison sociale est requise"
  }).max(200, {
    message: "La raison sociale ne peut pas dépasser 200 caractères"
  }),
  siret: z.string().trim().min(14, {
    message: "Le SIRET doit contenir 14 chiffres"
  }).max(14, {
    message: "Le SIRET doit contenir 14 chiffres"
  }),
  adresse: z.string().trim().min(1, {
    message: "L'adresse est requise"
  }).max(300, {
    message: "L'adresse ne peut pas dépasser 300 caractères"
  }),
  codePostal: z.string().trim().min(1, {
    message: "Le code postal est requis"
  }).max(10, {
    message: "Le code postal ne peut pas dépasser 10 caractères"
  }),
  ville: z.string().trim().min(1, {
    message: "La ville est requise"
  }).max(100, {
    message: "La ville ne peut pas dépasser 100 caractères"
  }),
  email: z.string().trim().min(1, {
    message: "L'email est requis"
  }).email({
    message: "L'email n'est pas valide"
  }).max(255, {
    message: "L'email ne peut pas dépasser 255 caractères"
  }),
  telephone: z.string().trim().min(1, {
    message: "Le téléphone est requis"
  }).max(20, {
    message: "Le téléphone ne peut pas dépasser 20 caractères"
  }),
  activite: z.string().trim().min(1, {
    message: "La description de l'activité est requise"
  }).max(2000, {
    message: "La description ne peut pas dépasser 2000 caractères"
  }),
  motivation: z.string().trim().min(1, {
    message: "La motivation est requise"
  }).max(2000, {
    message: "La motivation ne peut pas dépasser 2000 caractères"
  }),
  produits: z.string().trim().min(1, {
    message: "La description des produits est requise"
  }).max(2000, {
    message: "La description ne peut pas dépasser 2000 caractères"
  }),
  source: z.string().trim().max(200, {
    message: "Ce champ ne peut pas dépasser 200 caractères"
  }).optional()
});
type SupplierFormData = z.infer<typeof supplierFormSchema>;
const DevenirFournisseur = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      nom: "",
      raisonSociale: "",
      siret: "",
      adresse: "",
      codePostal: "",
      ville: "",
      email: "",
      telephone: "",
      activite: "",
      motivation: "",
      produits: "",
      source: ""
    }
  });
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).slice(0, 2 - photos.length);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 2));
    }
  };
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };
  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);

    try {
      // Submit application via edge function for server-side validation
      // Include photo count so the server can generate signed upload URLs
      const response = await supabase.functions.invoke('submit-supplier-application', {
        body: { ...data, photoCount: photos.length },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erreur lors de l\'envoi');
      }

      const result = response.data;
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }

      const applicationId = result.applicationId;
      const uploadUrls = result.uploadUrls || [];

      // Upload photos using signed URLs (more secure - controlled by server)
      if (photos.length > 0 && uploadUrls.length > 0) {
        for (let i = 0; i < Math.min(photos.length, uploadUrls.length); i++) {
          const photo = photos[i];
          const { path, signedUrl } = uploadUrls[i];

          try {
            // Upload using the signed URL
            const uploadResponse = await fetch(signedUrl, {
              method: 'PUT',
              body: photo,
              headers: {
                'Content-Type': photo.type,
              },
            });

            if (!uploadResponse.ok) {
              console.error("Error uploading photo via signed URL:", await uploadResponse.text());
              continue;
            }

            // Store just the path in the database
            const { error: photoInsertError } = await supabase.from("supplier_application_photos").insert({
              application_id: applicationId,
              photo_url: path,
            });

            if (photoInsertError) {
              console.error("Error inserting photo record:", photoInsertError);
            }
          } catch (uploadError) {
            console.error("Error uploading photo:", uploadError);
          }
        }
      }

      toast.success("Votre candidature a bien été envoyée ! Nous vous recontacterons dans les plus brefs délais.");
      form.reset();
      setPhotos([]);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue lors de l'envoi."}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#FEF7CD]/50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button onClick={() => navigate(-1)} className="flex items-center text-leaf-green hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Devenir notre fournisseur
            </h1>
            <p className="text-gray-700 mb-8 text-center max-w-2xl mx-auto">
              Vous êtes un(e) professionel(le) passionné(e) et engagé(e) ? Rejoignez l'aventure KiltirBox et faites découvrir VOS produits à travers NOS box !
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-2xl font-semibold text-leaf-green mb-6">Formulaire de candidature</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="nom" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Nom / Prénom(s)</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom et prénom(s)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="raisonSociale" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Raison sociale</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de votre entreprise" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="siret" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>SIRET</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro SIRET (14 chiffres)" maxLength={14} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Votre adresse email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="telephone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Votre numéro de téléphone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="adresse" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse de votre entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="codePostal" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>CP</FormLabel>
                          <FormControl>
                            <Input placeholder="Code postal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="ville" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="activite" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Décrivez votre activité et ce qui vous anime</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Parlez-nous de votre activité, de votre passion, de votre savoir-faire..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="motivation" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Pourquoi rejoindre l'aventure KiltirBox ?</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Qu'est-ce qui vous motive à rejoindre KiltirBox ?" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="produits" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Quels produits proposez-vous de nous fournir ? Pour quelle(s) thématiques ?</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Décrivez les produits que vous souhaitez proposer..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="space-y-2">
                    <FormLabel>Photos de vos produits (2 maximum)</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {photos.map((photo, index) => <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                          <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90">
                            <X className="w-3 h-3" />
                          </button>
                        </div>)}
                      {photos.length < 2 && <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-leaf-green transition-colors">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1">Ajouter</span>
                          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>}
                    </div>
                  </div>

                  <FormField control={form.control} name="source" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Comment avez-vous connu KiltirBox ? (facultatif)</FormLabel>
                        <FormControl>
                          <Input placeholder="Réseaux sociaux, bouche-à-oreille, événement..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default DevenirFournisseur;
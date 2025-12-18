import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";

const DevenirFournisseur = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    nom: "",
    raisonSociale: "",
    siret: "",
    adresse: "",
    telephone: "",
    activite: "",
    motivation: "",
    produits: "",
    source: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Votre candidature a bien été envoyée ! Nous vous recontacterons dans les plus brefs délais.");
    setIsSubmitting(false);
    setFormData({
      nom: "",
      raisonSociale: "",
      siret: "",
      adresse: "",
      telephone: "",
      activite: "",
      motivation: "",
      produits: "",
      source: "",
    });
    setPhotos([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-leaf-green hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-4">
              Devenir notre fournisseur
            </h1>
            <p className="text-muted-foreground mb-8">
              Vous êtes un producteur local ou un artisan passionné ? Rejoignez l'aventure KiltirBox et faites découvrir vos produits à travers nos box !
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom / Prénom(s) *</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre nom et prénom(s)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="raisonSociale">Raison sociale *</Label>
                  <Input
                    id="raisonSociale"
                    name="raisonSociale"
                    value={formData.raisonSociale}
                    onChange={handleInputChange}
                    required
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input
                    id="siret"
                    name="siret"
                    value={formData.siret}
                    onChange={handleInputChange}
                    required
                    placeholder="Numéro SIRET (14 chiffres)"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse *</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  required
                  placeholder="Adresse complète de votre entreprise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activite">Décrivez votre activité et ce qui vous anime *</Label>
                <Textarea
                  id="activite"
                  name="activite"
                  value={formData.activite}
                  onChange={handleInputChange}
                  required
                  placeholder="Parlez-nous de votre activité, de votre passion, de votre savoir-faire..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Pourquoi rejoindre l'aventure KiltirBox ? *</Label>
                <Textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  placeholder="Qu'est-ce qui vous motive à rejoindre KiltirBox ?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="produits">Quels produits proposez-vous de nous fournir ? *</Label>
                <Textarea
                  id="produits"
                  name="produits"
                  value={formData.produits}
                  onChange={handleInputChange}
                  required
                  placeholder="Décrivez les produits que vous souhaitez proposer..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Photos de vos produits (2 maximum)</Label>
                <div className="flex flex-wrap gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 2 && (
                    <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-leaf-green transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Comment avez-vous connu KiltirBox ? (facultatif)</Label>
                <Input
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="Réseaux sociaux, bouche-à-oreille, événement..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-leaf-green hover:bg-leaf-green/90 text-white py-6 text-lg"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DevenirFournisseur;

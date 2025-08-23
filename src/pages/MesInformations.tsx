
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MesInformations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    billing_address_street: '',
    billing_address_city: '',
    billing_address_postal_code: '',
    billing_address_country: 'France'
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          billing_address_street: data.billing_address_street || '',
          billing_address_city: data.billing_address_city || '',
          billing_address_postal_code: data.billing_address_postal_code || '',
          billing_address_country: data.billing_address_country || 'France'
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du profil.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-green/5 to-yellow-400/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center">
              <User className="h-6 w-6 text-leaf-green mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Mes informations</h1>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et votre adresse de facturation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Informations de base</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Prénom/Nom</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Edmond Albius"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date de naissance</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={profile.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select value={profile.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                        <SelectItem value="non-specifie">Non spécifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Adresse de facturation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Adresse de facturation</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing_address_street">Adresse</Label>
                    <Input
                      id="billing_address_street"
                      value={profile.billing_address_street}
                      onChange={(e) => handleInputChange('billing_address_street', e.target.value)}
                      placeholder="123 Rue de la République"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing_address_postal_code">Code postal</Label>
                      <Input
                        id="billing_address_postal_code"
                        value={profile.billing_address_postal_code}
                        onChange={(e) => handleInputChange('billing_address_postal_code', e.target.value)}
                        placeholder="97400"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="billing_address_city">Ville</Label>
                      <Input
                        id="billing_address_city"
                        value={profile.billing_address_city}
                        onChange={(e) => handleInputChange('billing_address_city', e.target.value)}
                        placeholder="Saint-Denis"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing_address_country">Pays</Label>
                    <Select value={profile.billing_address_country} onValueChange={(value) => handleInputChange('billing_address_country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Réunion">La Réunion</SelectItem>
                        <SelectItem value="Mayotte">Mayotte</SelectItem>
                        <SelectItem value="Guadeloupe">Guadeloupe</SelectItem>
                        <SelectItem value="Martinique">Martinique</SelectItem>
                        <SelectItem value="Guyane">Guyane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-leaf-green hover:bg-dark-green"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MesInformations;

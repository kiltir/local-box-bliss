import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { format, parse, isValid } from 'date-fns';
const profileFormSchema = z.object({
  full_name: z.string()
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" }),
  username: z.string()
    .max(50, { message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères" }),
  date_of_birth: z.string().refine((val) => {
    if (!val) return true; // Allow empty
    
    // Validate format
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(val)) return false;
    
    // Parse and validate date
    const parsedDate = parse(val, 'dd/MM/yyyy', new Date());
    if (!isValid(parsedDate)) return false;
    
    // Validate age range (0-120 years)
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    const monthDiff = today.getMonth() - parsedDate.getMonth();
    const dayDiff = today.getDate() - parsedDate.getDate();
    
    // Check if date is not in the future
    if (parsedDate > today) return false;
    
    // Calculate actual age
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      actualAge--;
    }
    
    return actualAge >= 0 && actualAge <= 120;
  }, {
    message: "La date doit être au format jj/mm/aaaa, ne pas être dans le futur et représenter un âge valide (0-120 ans)"
  }),
  gender: z.string(),
  billing_address_street: z.string()
    .max(200, { message: "L'adresse ne peut pas dépasser 200 caractères" }),
  billing_address_city: z.string()
    .max(100, { message: "La ville ne peut pas dépasser 100 caractères" }),
  billing_address_postal_code: z.string()
    .refine((val) => {
      if (!val) return true; // Allow empty
      // Basic validation for French postal codes (5 digits)
      return /^\d{5}$/.test(val);
    }, {
      message: "Le code postal doit contenir 5 chiffres"
    }),
  billing_address_country: z.string()
});

type ProfileFormData = z.infer<typeof profileFormSchema>;
interface ProfileData {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  billing_address_street: string | null;
  billing_address_city: string | null;
  billing_address_postal_code: string | null;
  billing_address_country: string | null;
  created_at: string;
  updated_at: string;
}
const MesInformations = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Fonction utilitaire pour convertir une date de la DB vers le format dd/mm/yyyy
  const formatDateFromDB = (dateString: string | null): string => {
    if (!dateString) return '';

    // Si c'est déjà au format dd/mm/yyyy
    if (dateString.includes('/')) {
      return dateString;
    }

    // Si c'est au format ISO (YYYY-MM-DD)
    if (dateString.includes('-') && dateString.length === 10) {
      const date = new Date(dateString + 'T00:00:00');
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy');
      }
    }
    return '';
  };
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      date_of_birth: '',
      gender: '',
      billing_address_street: '',
      billing_address_city: '',
      billing_address_postal_code: '',
      billing_address_country: 'France'
    }
  });
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);
  const loadProfile = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement du profil:', error);
        return;
      }
      if (data) {
        const profileData = data as ProfileData;
        setProfile(profileData);
        form.reset({
          full_name: profileData.full_name || '',
          username: profileData.username || '',
          date_of_birth: formatDateFromDB(profileData.date_of_birth),
          gender: profileData.gender || '',
          billing_address_street: profileData.billing_address_street || '',
          billing_address_city: profileData.billing_address_city || '',
          billing_address_postal_code: profileData.billing_address_postal_code || '',
          billing_address_country: profileData.billing_address_country || 'France'
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Convertir dd/mm/yyyy vers yyyy-MM-dd pour la DB
      let formattedDate: string | null = null;
      if (data.date_of_birth) {
        const parsedDate = parse(data.date_of_birth, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, 'yyyy-MM-dd');
        }
      }

      const profileData = {
        id: user.id,
        full_name: data.full_name,
        username: data.username,
        date_of_birth: formattedDate,
        gender: data.gender,
        billing_address_street: data.billing_address_street,
        billing_address_city: data.billing_address_city,
        billing_address_postal_code: data.billing_address_postal_code,
        billing_address_country: data.billing_address_country,
        updated_at: new Date().toISOString()
      };
      const {
        error
      } = await supabase.from('profiles').upsert(profileData);
      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        toast.error('Erreur lors de la sauvegarde des informations');
        return;
      }
      toast.success('Informations sauvegardées avec succès');
      loadProfile();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde des informations');
    } finally {
      setIsLoading(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-leaf-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes informations</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Informations personnelles */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="full_name" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom complet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="username" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom d'utilisateur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="date_of_birth" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Date de naissance</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="jj/mm/aaaa" 
                            {...field}
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="gender" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner votre genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="homme">Homme</SelectItem>
                            <SelectItem value="femme">Femme</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                            <SelectItem value="non_specifie">Préfère ne pas préciser</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                </div>
              </div>

              {/* Adresse de facturation */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Adresse du domicile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="billing_address_street" render={({
                  field
                }) => <FormItem className="md:col-span-2">
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro et nom de rue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="billing_address_city" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Ville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="billing_address_postal_code" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="Code postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="billing_address_country" render={({
                  field
                }) => <FormItem className="md:col-span-2">
                        <FormLabel>Pays</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un pays" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Belgique">Belgique</SelectItem>
                            <SelectItem value="Suisse">Suisse</SelectItem>
                            <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                </div>
              </div>

              {/* Email (lecture seule) */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de connexion</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email || ''} disabled className="bg-gray-50" />
                    <p className="text-sm text-gray-500 mt-1">
                      Pour modifier votre email, contactez notre support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>;
};
export default MesInformations;
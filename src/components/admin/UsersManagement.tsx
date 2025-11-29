import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
  user_roles: Array<{
    role: string;
  }>;
}

export const UsersManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user roles separately for each profile
      const profilesWithRoles = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          return {
            ...profile,
            user_roles: roles || []
          };
        })
      );

      setProfiles(profilesWithRoles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = (profile: Profile) => {
    return profile.user_roles.some(role => role.role === 'admin');
  };

  const toggleAdminRole = async (userId: string, currentlyAdmin: boolean) => {
    try {
      if (currentlyAdmin) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
        toast.success('Rôle administrateur retiré');
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
        toast.success('Rôle administrateur attribué');
      }

      fetchProfiles();
    } catch (error) {
      console.error('Error toggling admin role:', error);
      toast.error('Erreur lors de la modification du rôle');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => {
              const adminStatus = isAdmin(profile);
              return (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    {profile.full_name || 'Utilisateur sans nom'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(profile.created_at), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {adminStatus ? (
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge variant="outline">Utilisateur</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={adminStatus ? 'destructive' : 'default'} size="sm">
                          {adminStatus ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-1" />
                              Retirer admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-1" />
                              Définir admin
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {adminStatus ? 'Retirer le rôle administrateur' : 'Attribuer le rôle administrateur'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {adminStatus
                              ? 'Êtes-vous sûr de vouloir retirer le rôle administrateur à cet utilisateur ?'
                              : 'Êtes-vous sûr de vouloir attribuer le rôle administrateur à cet utilisateur ? Il aura accès à toutes les fonctionnalités d\'administration.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => toggleAdminRole(profile.id, adminStatus)}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

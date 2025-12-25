import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { OrdersManagement } from '@/components/admin/OrdersManagement';
import { StockManagement } from '@/components/admin/StockManagement';
import { ReviewsModeration } from '@/components/admin/ReviewsModeration';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { BannerManagement } from '@/components/admin/BannerManagement';
import { PriceManagement } from '@/components/admin/PriceManagement';
import { BoxProductsManagement } from '@/components/admin/BoxProductsManagement';
import SupplierApplicationsManagement from '@/components/admin/SupplierApplicationsManagement';
import { Loader2, Shield, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="boxes">Box</TabsTrigger>
            <TabsTrigger value="stock">Stocks</TabsTrigger>
            <TabsTrigger value="prices">Prix</TabsTrigger>
            <TabsTrigger value="banners">Bandeaux</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="boxes" className="space-y-4">
            <BoxProductsManagement />
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <StockManagement />
          </TabsContent>

          <TabsContent value="prices" className="space-y-4">
            <PriceManagement />
          </TabsContent>

          <TabsContent value="banners" className="space-y-4">
            <BannerManagement />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <ReviewsModeration />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <SupplierApplicationsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

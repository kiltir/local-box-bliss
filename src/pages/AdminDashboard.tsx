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
import { PartnersManagement } from '@/components/admin/PartnersManagement';
import { GalleryManagement } from '@/components/admin/GalleryManagement';
import { BoxDetailsImagesManagement } from '@/components/admin/BoxDetailsImagesManagement';
import { BoxAdviceManagement } from '@/components/admin/BoxAdviceManagement';
import { Loader2, Shield, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { signOut, user } = useAuth();

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-xl sm:text-3xl font-bold">Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
            )}
            <Button variant="outline" onClick={handleSignOut} size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <div className="overflow-x-auto mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-max sm:w-full h-auto gap-1 p-1">
              <TabsTrigger value="orders" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Cmd.</TabsTrigger>
              <TabsTrigger value="boxes" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Box</TabsTrigger>
              <TabsTrigger value="box-details" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Détails</TabsTrigger>
              <TabsTrigger value="box-advice" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Conseils</TabsTrigger>
              <TabsTrigger value="stock" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Stocks</TabsTrigger>
              <TabsTrigger value="prices" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Prix</TabsTrigger>
              <TabsTrigger value="banners" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Bandeau</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Avis</TabsTrigger>
              <TabsTrigger value="gallery" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Galerie</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Users</TabsTrigger>
              <TabsTrigger value="partners" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Partn.</TabsTrigger>
              <TabsTrigger value="suppliers" className="text-xs sm:text-sm whitespace-nowrap px-2.5 py-1.5">Fourn.</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="space-y-4">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="boxes" className="space-y-4">
            <BoxProductsManagement />
          </TabsContent>

          <TabsContent value="box-details" className="space-y-4">
            <BoxDetailsImagesManagement />
          </TabsContent>

          <TabsContent value="box-advice" className="space-y-4">
            <BoxAdviceManagement />
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

          <TabsContent value="gallery" className="space-y-4">
            <GalleryManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <PartnersManagement />
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

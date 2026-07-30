import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  };
}

interface AdminSubscription {
  id: string;
  user_id: string;
  theme: string;
  status: string;
  duration_months: number;
  total_price: number;
  total_paid_months: number;
  current_period_end: string | null;
  created_at: string;
  profiles: { full_name: string | null };
}

export const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
    fetchSubscriptions();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile data separately for each order
      const ordersWithProfiles = await Promise.all(
        (data || []).map(async (order) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', order.user_id)
            .single();

          return {
            ...order,
            profiles: profile || { full_name: null }
          };
        })
      );

      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const withProfiles = await Promise.all((data || []).map(async (s: any) => {
        const { data: profile } = await supabase
          .from('profiles').select('full_name').eq('id', s.user_id).single();
        return { ...s, profiles: profile || { full_name: null } };
      }));
      setSubscriptions(withProfiles as AdminSubscription[]);
    } catch (e) {
      console.error('Error fetching subscriptions:', e);
    }
  };


  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'purple' | 'yellow' | 'orange' }> = {
      en_cours: { label: 'En cours', variant: 'default' },
      expediee: { label: 'Expédiée', variant: 'secondary' },
      livree: { label: 'Livrée', variant: 'default' },
      annulee: { label: 'Annulée', variant: 'destructive' },
      interrompue: { label: 'Interrompue', variant: 'orange' },
    };
    const { label, variant } = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order as any).nom_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <CardTitle>Gestion des commandes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="subs">Abonnements ({subscriptions.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <div className="flex gap-4 mb-4">
          <Input
            placeholder="Rechercher par n° de commande ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="expediee">Expédiée</SelectItem>
              <SelectItem value="livree">Livrée</SelectItem>
              <SelectItem value="annulee">Annulée</SelectItem>
              <SelectItem value="interrompue">Interrompue</SelectItem>
            </SelectContent>
          </Select>
            </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Destinataire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{(order as any).nom_prenom || order.profiles?.full_name || 'N/A'}</TableCell>
                <TableCell>{(order as any).destinataire || '—'}</TableCell>
                <TableCell>{format(new Date(order.created_at), 'dd MMM yyyy', { locale: fr })}</TableCell>
                <TableCell>{order.total_amount.toFixed(2)} €</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          </TabsContent>
          <TabsContent value="subs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Box</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead className="min-w-[180px]">Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prochain prélèv.</TableHead>
                  <TableHead>Prix mensuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((s) => {
                  const pct = Math.min(100, Math.round((s.total_paid_months / s.duration_months) * 100));
                  const statusMap: Record<string, { label: string; variant: any }> = {
                    active: { label: 'Actif', variant: 'success' },
                    completed: { label: 'Terminé', variant: 'yellow' },
                    past_due: { label: 'En retard', variant: 'orange' },
                    canceled: { label: 'Annulé', variant: 'destructive' },
                  };
                  const st = statusMap[s.status] || { label: s.status, variant: 'secondary' };
                  const isActive = s.status === 'active' && s.total_paid_months < s.duration_months;
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{s.profiles?.full_name || 'N/A'}</TableCell>
                      <TableCell>{s.theme}</TableCell>
                      <TableCell>{s.duration_months} mois</TableCell>
                      <TableCell>
                        <div className="text-xs mb-1">{s.total_paid_months} / {s.duration_months}</div>
                        <Progress value={pct} className="h-2" />
                      </TableCell>
                      <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                      <TableCell>{isActive && s.current_period_end ? format(new Date(s.current_period_end), 'dd MMM yyyy', { locale: fr }) : '—'}</TableCell>
                      <TableCell>{Number(s.monthly_price).toFixed(2)} €</TableCell>
                    </TableRow>
                  );
                })}
                {subscriptions.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Aucun abonnement</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

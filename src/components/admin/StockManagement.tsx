import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useStock } from '@/hooks/useStock';
import { useState } from 'react';
import { Loader2, Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const StockManagement = () => {
  const { stocks, isLoading, updateStock } = useStock();
  const [editingStocks, setEditingStocks] = useState<Record<string, { available: number; safety: number }>>({});

  const handleInputChange = (stockId: string, field: 'available' | 'safety', value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingStocks(prev => ({
      ...prev,
      [stockId]: {
        ...prev[stockId],
        [field]: numValue,
      },
    }));
  };

  const handleSave = (stockId: string, currentAvailable: number, currentSafety: number) => {
    const edited = editingStocks[stockId];
    updateStock({
      id: stockId,
      available_stock: edited?.available ?? currentAvailable,
      safety_stock: edited?.safety ?? currentSafety,
    });
    
    // Clear editing state
    setEditingStocks(prev => {
      const newState = { ...prev };
      delete newState[stockId];
      return newState;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gestion des stocks
        </CardTitle>
        <CardDescription>
          Gérez le stock disponible et définissez les seuils d'alerte pour chaque thématique de box
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {stocks?.map((stock) => {
            const isLowStock = stock.available_stock <= stock.safety_stock && stock.available_stock > 0;
            const isOutOfStock = stock.available_stock === 0;
            const editedValues = editingStocks[stock.id];
            
            return (
              <div key={stock.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Box {stock.theme}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {isOutOfStock && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Rupture de stock
                        </Badge>
                      )}
                      {isLowStock && (
                        <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-800">
                          <AlertTriangle className="h-3 w-3" />
                          Stock faible
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`available-${stock.id}`}>Stock disponible</Label>
                    <Input
                      id={`available-${stock.id}`}
                      type="number"
                      min="0"
                      defaultValue={stock.available_stock}
                      onChange={(e) => handleInputChange(stock.id, 'available', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`safety-${stock.id}`}>Stock de sécurité</Label>
                    <Input
                      id={`safety-${stock.id}`}
                      type="number"
                      min="0"
                      defaultValue={stock.safety_stock}
                      onChange={(e) => handleInputChange(stock.id, 'safety', e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Seuil d'alerte pour le réapprovisionnement
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleSave(stock.id, stock.available_stock, stock.safety_stock)}
                  disabled={!editedValues}
                  className="w-full md:w-auto"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

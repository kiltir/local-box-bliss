
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Product } from '@/types/box';
import { useProductData } from '@/hooks/useProductData';

interface ProductSelectorProps {
  onAddProduct: (product: Product) => void;
  selectedProductIds: number[];
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onAddProduct, selectedProductIds }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const { availableProducts } = useProductData();
  
  const form = useForm({
    defaultValues: {
      name: '',
      width: 5,
      height: 5,
      depth: 5,
      color: '#8B4513'
    }
  });

  const handleProductSelect = (product: Product) => {
    onAddProduct(product);
    setIsDialogOpen(false);
  };

  const handleCustomProductSubmit = (data) => {
    const newProduct: Product = {
      id: Date.now(), // Use timestamp as temporary ID
      name: data.name,
      width: Number(data.width),
      height: Number(data.height),
      depth: Number(data.depth),
      color: data.color
    };
    
    onAddProduct(newProduct);
    form.reset();
    setIsCustomProduct(false);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un produit
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sélectionner un produit</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-between mb-4">
            <Button
              variant={isCustomProduct ? "outline" : "default"}
              onClick={() => setIsCustomProduct(false)}
              className="flex-1 mr-2"
            >
              Produits existants
            </Button>
            <Button
              variant={isCustomProduct ? "default" : "outline"}
              onClick={() => setIsCustomProduct(true)}
              className="flex-1"
            >
              Produit personnalisé
            </Button>
          </div>
          
          {isCustomProduct ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCustomProductSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du produit</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du produit" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Largeur (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hauteur (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="depth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profondeur (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <Input type="color" className="h-10 w-full" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Ajouter</Button>
              </form>
            </Form>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {availableProducts.length === 0 ? (
                <p className="text-center py-4 text-gray-500">Aucun produit disponible</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableProducts.map(product => (
                    <Button
                      key={product.id}
                      variant="outline"
                      onClick={() => handleProductSelect(product)}
                      disabled={selectedProductIds.includes(product.id)}
                      className={`h-auto p-3 justify-start text-left flex flex-col items-start ${
                        selectedProductIds.includes(product.id) ? 'opacity-50' : ''
                      }`}
                    >
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-xs text-gray-500">
                        {product.width} x {product.height} x {product.depth} cm
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSelector;

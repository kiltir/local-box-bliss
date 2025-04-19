
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { Product } from '@/types/box';
import { useProductData } from '@/hooks/useProductData';
import CustomProductForm from './product/CustomProductForm';
import ProductList from './product/ProductList';

interface ProductSelectorProps {
  onAddProduct: (product: Product) => void;
  selectedProductIds: number[];
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onAddProduct, selectedProductIds }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const { availableProducts } = useProductData();

  const handleProductSelect = (product: Product) => {
    onAddProduct(product);
    setIsDialogOpen(false);
  };

  const handleCustomProductSubmit = (product: Product) => {
    onAddProduct(product);
    setIsCustomProduct(false);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="w-full">
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
            <CustomProductForm 
              onSubmit={handleCustomProductSubmit}
              onCancel={() => setIsCustomProduct(false)}
            />
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <ProductList
                products={availableProducts}
                selectedProductIds={selectedProductIds}
                onProductSelect={handleProductSelect}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSelector;

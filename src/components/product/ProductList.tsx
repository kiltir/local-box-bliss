
import React from 'react';
import { Button } from "@/components/ui/button";
import { Product } from '@/types/box';

interface ProductListProps {
  products: Product[];
  selectedProductIds: number[];
  onProductSelect: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, selectedProductIds, onProductSelect }) => {
  if (products.length === 0) {
    return <p className="text-center py-4 text-gray-500">Aucun produit disponible</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {products.map(product => (
        <Button
          key={product.id}
          variant="outline"
          onClick={() => onProductSelect(product)}
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
  );
};

export default ProductList;

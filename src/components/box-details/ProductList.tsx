
import React from 'react';
import { BoxProduct } from '@/types/boxes';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: BoxProduct[];
  selectedProductIds: string[];
  productQuantities: Record<string, number>;
  onToggle: (productIndex: string, checked: boolean) => void;
  onQuantityChange: (productIndex: string, change: number) => void;
}

const ProductList = ({
  products,
  selectedProductIds,
  productQuantities,
  onToggle,
  onQuantityChange
}: ProductListProps) => {
  return (
    <ul className="divide-y">
      {products.map((product, index) => (
        <ProductItem
          key={index}
          product={product}
          index={index}
          isSelected={selectedProductIds.includes(index.toString())}
          quantity={productQuantities[index.toString()] || 1}
          onToggle={onToggle}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </ul>
  );
};

export default ProductList;

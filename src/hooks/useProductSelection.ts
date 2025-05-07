
import { useState } from 'react';
import { BoxProduct } from '@/types/boxes';

export function useProductSelection(products: BoxProduct[]) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.map((_, index) => index.toString())
  );
  
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>(
    products.reduce((acc, _, index) => {
      acc[index.toString()] = 1; // Initialize all products with quantity 1
      return acc;
    }, {} as Record<string, number>)
  );

  const handleProductToggle = (productIndex: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, productIndex]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productIndex));
    }
  };

  const handleQuantityChange = (productIndex: string, change: number) => {
    const currentQuantity = productQuantities[productIndex] || 1;
    const newQuantity = Math.max(1, currentQuantity + change); // Minimum quantity is 1
    
    setProductQuantities({
      ...productQuantities,
      [productIndex]: newQuantity
    });
  };

  return {
    selectedProductIds,
    productQuantities,
    handleProductToggle,
    handleQuantityChange
  };
}

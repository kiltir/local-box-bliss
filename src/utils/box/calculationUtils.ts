
import { BoxProduct } from '@/types/boxes';
import { WEIGHT_LIMITS, BOX_DIMENSIONS } from './constants';
import { boxes } from '@/data/boxes';

// Calculate volume for a single product in cm³
export const calculateProductVolume = (product: BoxProduct): number => {
  if (!product.dimensions) return 0;
  return (product.dimensions.width * 
          product.dimensions.height * 
          product.dimensions.depth); // Return in cm³
};

// Calculate total volume in cm³
export const calculateTotalVolume = (
  products: BoxProduct[],
  selectedProductIds: string[],
  productQuantities: Record<string, number>
): number => {
  return products
    .filter((_, index) => selectedProductIds.includes(index.toString()))
    .reduce((total, product, index) => {
      const productIndex = index.toString();
      const quantity = productQuantities[productIndex] || 1;
      return total + (calculateProductVolume(product) * quantity);
    }, 0);
};

// Calculate total weight in kg
export const calculateTotalWeight = (
  products: BoxProduct[],
  selectedProductIds: string[],
  productQuantities: Record<string, number>
): number => {
  return products
    .filter((_, index) => selectedProductIds.includes(index.toString()))
    .reduce((total, product, index) => {
      const productIndex = index.toString();
      const quantity = productQuantities[productIndex] || 1;
      return total + ((product.weight || 0) * quantity);
    }, 0);
};

// Pour le nouveau système, toutes les boxes ont la même taille
export const findAppropriateBox = (weight: number) => {
  return weight <= WEIGHT_LIMITS.unique ? 'unique' : null;
};

// Find box by theme instead of size
export const findBoxByTheme = (theme: 'Découverte' | 'Bourbon' | 'Tradition' | 'Saison') => {
  return boxes.find(box => box.theme === theme);
};

// Calculate box volume in cm³
export const calculateBoxVolume = (): number => {
  return BOX_DIMENSIONS.unique.width * 
         BOX_DIMENSIONS.unique.height * 
         BOX_DIMENSIONS.unique.depth;
};

// Calculate volume percentage
export const calculateVolumePercentage = (totalVolume: number): number => {
  const boxVolume = calculateBoxVolume();
  return (totalVolume / boxVolume) * 100;
};

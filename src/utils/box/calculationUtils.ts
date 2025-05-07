
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

// Find the appropriate box size for the current weight
export const findAppropriateBox = (weight: number) => {
  if (weight <= WEIGHT_LIMITS.small) {
    return 'small';
  } else if (weight <= WEIGHT_LIMITS.medium) {
    return 'medium';
  } else if (weight <= WEIGHT_LIMITS.large) {
    return 'large';
  }
  return null; // Weight exceeds all limits
};

// Find box with the specified size
export const findBoxBySize = (size: 'small' | 'medium' | 'large') => {
  return boxes.find(box => box.size === size);
};

// Calculate box volume in cm³
export const calculateBoxVolume = (boxSize: 'small' | 'medium' | 'large'): number => {
  return BOX_DIMENSIONS[boxSize].width * 
         BOX_DIMENSIONS[boxSize].height * 
         BOX_DIMENSIONS[boxSize].depth;
};

// Calculate volume percentage
export const calculateVolumePercentage = (
  totalVolume: number, 
  boxSize: 'small' | 'medium' | 'large'
): number => {
  const boxVolume = calculateBoxVolume(boxSize);
  return (totalVolume / boxVolume) * 100;
};

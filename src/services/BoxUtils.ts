
import { BoxProduct, BoxProductDimensions } from '@/types/boxes';

// Weight limits
export const WEIGHT_LIMITS = {
  small: 3, // 3kg for Petite Box
  medium: 4.5, // 4.5kg for Moyenne Box
  large: 6, // 6kg for Grande Box
};

// Calculate volume for a single product in cm³
export const calculateProductVolume = (product: BoxProduct) => {
  if (!product.dimensions) return 0;
  return (product.dimensions.width * 
          product.dimensions.height * 
          product.dimensions.depth); // Return in cm³
};

// Calculate total volume in cm³
export const calculateTotalVolume = (products: BoxProduct[], selectedProductIds: string[]) => {
  return products
    .filter((_, index) => selectedProductIds.includes(index.toString()))
    .reduce((total, product) => {
      return total + calculateProductVolume(product);
    }, 0);
};

// Calculate total weight in kg
export const calculateTotalWeight = (products: BoxProduct[], selectedProductIds: string[]) => {
  return products
    .filter((_, index) => selectedProductIds.includes(index.toString()))
    .reduce((total, product) => {
      return total + (product.weight || 0);
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

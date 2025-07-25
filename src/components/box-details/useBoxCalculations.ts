
import { useEffect } from 'react';
import { BoxProduct } from '@/types/boxes';
import { useProductSelection } from '@/hooks/useProductSelection';
import { useToastNotification } from '@/hooks/useToastNotification';
import { 
  WEIGHT_LIMITS, 
  BOX_DIMENSIONS 
} from '@/utils/box/constants';
import { 
  calculateTotalWeight,
  calculateTotalVolume,
  findAppropriateBox,
  findBoxByTheme,
  calculateVolumePercentage,
  calculateBoxVolume
} from '@/utils/box/calculationUtils';
import { mapProductsFor3DViewer } from '@/utils/box/productMappers';

export function useBoxCalculations(
  products: BoxProduct[], 
  boxTheme: 'Découverte' | 'Bourbon' | 'Tradition' | 'Saison',
  boxId: number,
  onBoxChange?: (boxId: number) => void
) {
  const { 
    selectedProductIds, 
    productQuantities, 
    handleProductToggle, 
    handleQuantityChange 
  } = useProductSelection(products);
  
  const { showWeightExceededToast } = useToastNotification();

  useEffect(() => {
    const totalWeight = calculateTotalWeight(products, selectedProductIds, productQuantities);
    const weightLimit = WEIGHT_LIMITS.unique;
    
    // Check if weight exceeds the limit
    if (totalWeight > weightLimit) {
      showWeightExceededToast(
        totalWeight,
        weightLimit,
        "Box unique",
        () => {} // No action needed since there's only one box size
      );
    }
  }, [selectedProductIds, productQuantities, showWeightExceededToast]);

  const totalWeight = calculateTotalWeight(products, selectedProductIds, productQuantities);
  const weightLimit = WEIGHT_LIMITS.unique;
  const weightExceeded = totalWeight > weightLimit;
  
  const totalVolume = calculateTotalVolume(products, selectedProductIds, productQuantities);
  const boxVolume = calculateBoxVolume();
  const volumePercentage = calculateVolumePercentage(totalVolume);

  const getProductsFor3DViewer = () => {
    return mapProductsFor3DViewer(products, selectedProductIds, productQuantities);
  };

  return {
    selectedProductIds,
    productQuantities,
    handleProductToggle,
    handleQuantityChange,
    totalWeight,
    weightLimit,
    weightExceeded,
    totalVolume,
    boxVolume,
    volumePercentage,
    BOX_DIMENSIONS,
    getProductsFor3DViewer
  };
}

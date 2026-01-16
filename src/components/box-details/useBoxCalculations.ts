
import { useEffect } from 'react';
import { BoxProduct } from '@/types/boxes';
import { useProductSelection } from '@/hooks/useProductSelection';
import { useToastNotification } from '@/hooks/useToastNotification';
import { useBoxDimensions } from '@/hooks/useBoxDimensions';
import { 
  calculateTotalWeight,
  calculateTotalVolume,
} from '@/utils/box/calculationUtils';
import { mapProductsFor3DViewer } from '@/utils/box/productMappers';

export function useBoxCalculations(
  products: BoxProduct[], 
  boxTheme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison',
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
  const { weightLimit, boxVolume, BOX_DIMENSIONS, shippingBoxWeight, isLoading: isDimensionsLoading } = useBoxDimensions(boxTheme);

  useEffect(() => {
    const totalWeight = calculateTotalWeight(products, selectedProductIds, productQuantities);
    
    // Check if weight exceeds the limit
    if (totalWeight > weightLimit) {
      showWeightExceededToast(
        totalWeight,
        weightLimit,
        "Box unique",
        () => {} // No action needed since there's only one box size
      );
    }
  }, [selectedProductIds, productQuantities, weightLimit, showWeightExceededToast]);

  const productsWeight = calculateTotalWeight(products, selectedProductIds, productQuantities);
  const totalWeight = productsWeight + shippingBoxWeight;
  const weightExceeded = totalWeight > weightLimit;
  
  const totalVolume = calculateTotalVolume(products, selectedProductIds, productQuantities);
  const volumePercentage = boxVolume > 0 ? (totalVolume / boxVolume) * 100 : 0;

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
    getProductsFor3DViewer,
    isDimensionsLoading
  };
}

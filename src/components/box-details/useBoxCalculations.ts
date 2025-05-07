
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
  findBoxBySize,
  calculateVolumePercentage,
  calculateBoxVolume
} from '@/utils/box/calculationUtils';
import { mapProductsFor3DViewer } from '@/utils/box/productMappers';

export function useBoxCalculations(
  products: BoxProduct[], 
  boxSize: 'small' | 'medium' | 'large',
  boxId: number,
  onBoxChange?: (boxId: number) => void
) {
  const { 
    selectedProductIds, 
    productQuantities, 
    handleProductToggle, 
    handleQuantityChange 
  } = useProductSelection(products);
  
  const { showWeightExceededToast, showBoxUpdatedToast } = useToastNotification();

  useEffect(() => {
    const totalWeight = calculateTotalWeight(products, selectedProductIds, productQuantities);
    const currentLimit = WEIGHT_LIMITS[boxSize];
    
    // Check if weight exceeds the current box's limit
    if (totalWeight > currentLimit) {
      const appropriateSize = findAppropriateBox(totalWeight);
      
      if (appropriateSize && appropriateSize !== boxSize) {
        // Find a box with the appropriate size
        const suggestedBox = findBoxBySize(appropriateSize);
        
        if (suggestedBox && onBoxChange) {
          const handleButtonClick = () => {
            onBoxChange(suggestedBox.id);
            showBoxUpdatedToast(suggestedBox.baseTitle);
          };

          showWeightExceededToast(
            totalWeight,
            currentLimit,
            suggestedBox.baseTitle,
            handleButtonClick
          );
        }
      }
    }
  }, [selectedProductIds, productQuantities, boxSize, onBoxChange]);

  const totalWeight = calculateTotalWeight(products, selectedProductIds, productQuantities);
  const weightLimit = WEIGHT_LIMITS[boxSize];
  const weightExceeded = totalWeight > weightLimit;
  
  const totalVolume = calculateTotalVolume(products, selectedProductIds, productQuantities);
  const boxVolume = calculateBoxVolume(boxSize);
  const volumePercentage = calculateVolumePercentage(totalVolume, boxSize);

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

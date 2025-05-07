
import { useState, useEffect } from 'react';
import { BoxProduct } from '@/types/boxes';
import { toast } from "@/hooks/use-toast";
import { boxes } from '@/data/boxes';
import { createElement } from 'react';
import ToastActionButton from './ToastActionButton';

// Weight limits
const WEIGHT_LIMITS = {
  small: 3, // 3kg for Petite Box
  medium: 4.5, // 4.5kg for Moyenne Box
  large: 6, // 6kg for Grande Box
};

// Box dimensions in cm (width × height × depth)
const BOX_DIMENSIONS = {
  small: { width: 30, height: 15, depth: 25 }, // 11250 cm³
  medium: { width: 35, height: 18, depth: 30 }, // 18900 cm³
  large: { width: 40, height: 22, depth: 35 }, // 30800 cm³
};

export function useBoxCalculations(
  products: BoxProduct[], 
  boxSize: 'small' | 'medium' | 'large',
  boxId: number,
  onBoxChange?: (boxId: number) => void
) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(products.map((_, index) => index.toString()));
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>(
    products.reduce((acc, _, index) => {
      acc[index.toString()] = 1; // Initialize all products with quantity 1
      return acc;
    }, {} as Record<string, number>)
  );

  // Calculate volume for a single product in cm³
  const calculateProductVolume = (product: BoxProduct) => {
    if (!product.dimensions) return 0;
    return (product.dimensions.width * 
            product.dimensions.height * 
            product.dimensions.depth); // Return in cm³
  };

  // Calculate total volume in cm³
  const calculateTotalVolume = () => {
    return products
      .filter((_, index) => selectedProductIds.includes(index.toString()))
      .reduce((total, product, index) => {
        const productIndex = index.toString();
        const quantity = productQuantities[productIndex] || 1;
        return total + (calculateProductVolume(product) * quantity);
      }, 0);
  };

  // Calculate total weight in kg
  const calculateTotalWeight = () => {
    return products
      .filter((_, index) => selectedProductIds.includes(index.toString()))
      .reduce((total, product, index) => {
        const productIndex = index.toString();
        const quantity = productQuantities[productIndex] || 1;
        return total + ((product.weight || 0) * quantity);
      }, 0);
  };

  // Find the appropriate box size for the current weight
  const findAppropriateBox = (weight: number) => {
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
  const findBoxBySize = (size: 'small' | 'medium' | 'large') => {
    return boxes.find(box => box.size === size);
  };

  // Convert BoxProduct to the format required by Box3DViewer
  const getProductsFor3DViewer = () => {
    const result: Array<{
      id: number;
      name: string;
      width: number;
      height: number;
      depth: number;
      color: string;
    }> = [];

    products
      .filter((_, index) => selectedProductIds.includes(index.toString()))
      .forEach((product, i) => {
        const productIndex = selectedProductIds[i];
        const quantity = productQuantities[productIndex] || 1;

        // Add one instance of the product for each quantity
        for (let q = 0; q < quantity; q++) {
          if (!product.dimensions) {
            result.push({
              id: result.length + 1,
              name: `${product.name} (${q + 1}/${quantity})`,
              width: 5, // default values if dimensions not provided
              height: 5,
              depth: 5,
              color: getRandomColor(product.name)
            });
          } else {
            result.push({
              id: result.length + 1,
              name: `${product.name} (${q + 1}/${quantity})`,
              width: product.dimensions.width,
              height: product.dimensions.height,
              depth: product.dimensions.depth,
              color: getRandomColor(product.name)
            });
          }
        }
      });

    return result;
  };

  // Generate a consistent color based on product name
  const getRandomColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    
    return `#${"00000".substring(0, 6 - c.length)}${c}`;
  };

  // Handle quantity change
  const handleQuantityChange = (productIndex: string, change: number) => {
    const currentQuantity = productQuantities[productIndex] || 1;
    const newQuantity = Math.max(1, currentQuantity + change); // Minimum quantity is 1
    
    setProductQuantities({
      ...productQuantities,
      [productIndex]: newQuantity
    });
  };

  useEffect(() => {
    const totalWeight = calculateTotalWeight();
    const currentLimit = WEIGHT_LIMITS[boxSize];
    
    // Check if weight exceeds the current box's limit
    if (totalWeight > currentLimit) {
      const appropriateSize = findAppropriateBox(totalWeight);
      
      if (appropriateSize && appropriateSize !== boxSize) {
        // Find a box with the appropriate size
        const suggestedBox = findBoxBySize(appropriateSize);
        
        if (suggestedBox && onBoxChange) {
          // Create the action element using createElement instead of JSX
          const handleButtonClick = () => {
            onBoxChange(suggestedBox.id);
            toast({
              title: "Box mise à jour",
              description: `Vous avez changé pour ${suggestedBox.baseTitle}.`
            });
          };

          // Show toast notification
          toast({
            title: "Limite de poids dépassée!",
            description: `Le poids total (${totalWeight.toFixed(2)}kg) dépasse la limite de ${currentLimit}kg. Nous vous recommandons la ${suggestedBox.baseTitle}.`,
            action: createElement(ToastActionButton, { onClick: handleButtonClick })
          });
        }
      }
    }
  }, [selectedProductIds, productQuantities, boxSize, onBoxChange]);

  const handleProductToggle = (productIndex: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, productIndex]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productIndex));
    }
  };

  const totalWeight = calculateTotalWeight();
  const weightLimit = WEIGHT_LIMITS[boxSize];
  const weightExceeded = totalWeight > weightLimit;
  
  const totalVolume = calculateTotalVolume();
  const boxVolume = BOX_DIMENSIONS[boxSize].width * 
                    BOX_DIMENSIONS[boxSize].height * 
                    BOX_DIMENSIONS[boxSize].depth;
  const volumePercentage = (totalVolume / boxVolume) * 100;

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

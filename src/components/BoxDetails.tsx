
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BoxProduct } from '@/types/boxes';
import { toast } from "@/hooks/use-toast";
import { boxes } from '@/data/boxes';
import ProductList from './box/ProductList';
import BoxActions from './box/BoxActions';
import { 
  WEIGHT_LIMITS, 
  calculateTotalVolume, 
  calculateTotalWeight,
  findAppropriateBox 
} from '@/services/BoxUtils';

interface BoxDetailsProps {
  title: string;
  price: number;
  description: string;
  image: string;
  products: BoxProduct[];
  onClose: () => void;
  boxSize: 'small' | 'medium' | 'large';
  boxId: number;
  onBoxChange?: (boxId: number) => void;
}

const BoxDetails = ({ 
  title, 
  price, 
  description, 
  image, 
  products, 
  onClose, 
  boxSize, 
  boxId,
  onBoxChange 
}: BoxDetailsProps) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(products.map((_, index) => index.toString()));
  
  // Find box with the specified size
  const findBoxBySize = (size: 'small' | 'medium' | 'large') => {
    return boxes.find(box => box.size === size);
  };

  const handleProductToggle = (productIndex: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, productIndex]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productIndex));
    }
  };

  useEffect(() => {
    const totalWeight = calculateTotalWeight(products, selectedProductIds);
    const currentLimit = WEIGHT_LIMITS[boxSize];
    
    // Check if weight exceeds the current box's limit
    if (totalWeight > currentLimit) {
      const appropriateSize = findAppropriateBox(totalWeight);
      
      if (appropriateSize && appropriateSize !== boxSize) {
        // Find a box with the appropriate size
        const suggestedBox = findBoxBySize(appropriateSize);
        
        if (suggestedBox && onBoxChange) {
          // Show toast notification
          toast({
            title: "Limite de poids dépassée!",
            description: `Le poids total (${totalWeight.toFixed(2)}kg) dépasse la limite de ${currentLimit}kg. Nous vous recommandons la ${suggestedBox.baseTitle}.`,
            action: (
              <Button variant="outline" onClick={() => {
                onBoxChange(suggestedBox.id);
                toast({
                  title: "Box mise à jour",
                  description: `Vous avez changé pour ${suggestedBox.baseTitle}.`
                });
              }}>
                Changer
              </Button>
            )
          });
        }
      }
    }
  }, [selectedProductIds, boxSize, onBoxChange]);

  const totalWeight = calculateTotalWeight(products, selectedProductIds);
  const totalVolume = calculateTotalVolume(products, selectedProductIds);
  const weightLimit = WEIGHT_LIMITS[boxSize];
  const weightExceeded = totalWeight > weightLimit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <div className="text-2xl font-bold text-leaf-green mb-4">
                {price.toFixed(2)}€
              </div>
              
              <p className="text-gray-600 mb-6">{description}</p>
              
              <ProductList
                products={products}
                selectedProductIds={selectedProductIds}
                onProductToggle={handleProductToggle}
                totalWeight={totalWeight}
                totalVolume={totalVolume}
                weightLimit={weightLimit}
                weightExceeded={weightExceeded}
              />
              
              <BoxActions 
                weightExceeded={weightExceeded}
                weightLimit={weightLimit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxDetails;

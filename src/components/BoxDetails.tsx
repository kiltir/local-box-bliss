
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from 'lucide-react';
import { BoxProduct } from '@/types/boxes';
import { toast } from "@/hooks/use-toast";
import { boxes } from '@/data/boxes';

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
  
  // Weight limits
  const WEIGHT_LIMITS = {
    small: 3, // 3kg for Petite Box
    medium: 4.5, // 4.5kg for Moyenne Box
    large: 6, // 6kg for Grande Box
  };

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
      .reduce((total, product) => {
        return total + calculateProductVolume(product);
      }, 0);
  };

  // Calculate total weight in kg
  const calculateTotalWeight = () => {
    return products
      .filter((_, index) => selectedProductIds.includes(index.toString()))
      .reduce((total, product) => {
        return total + (product.weight || 0);
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
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Contenu de la box</h3>
                <div className={`text-sm ${weightExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'} mb-1`}>
                  Poids total sélectionné: {totalWeight.toFixed(2)} kg / {weightLimit} kg {weightExceeded && '⚠️'}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Volume total sélectionné: {calculateTotalVolume().toFixed(2)} cm³
                </div>
                <ul className="divide-y">
                  {products.map((product, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          id={`product-${index}`}
                          checked={selectedProductIds.includes(index.toString())}
                          onCheckedChange={(checked) => handleProductToggle(index.toString(), checked === true)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label 
                              htmlFor={`product-${index}`}
                              className="font-medium cursor-pointer"
                            >
                              {product.name}
                            </label>
                            <span className="text-gray-600">{product.quantity}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Producteur: {product.producer}
                          </div>
                          {product.weight && (
                            <div className="text-sm text-gray-500">
                              Poids: {product.weight.toFixed(2)} kg
                            </div>
                          )}
                          {product.dimensions && (
                            <div className="text-sm text-gray-500 mt-1">
                              Dimensions: {product.dimensions.depth} × {product.dimensions.width} × {product.dimensions.height} cm (L×l×h)
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className={`w-full ${weightExceeded ? 'bg-gray-400 cursor-not-allowed' : 'bg-leaf-green hover:bg-dark-green'} text-white`}
                disabled={weightExceeded}
              >
                {weightExceeded ? 'Poids maximum dépassé' : 'Ajouter au panier'}
              </Button>
              
              {weightExceeded && (
                <p className="text-sm text-red-600 mt-2">
                  Le poids total dépasse la limite de {weightLimit}kg pour cette box.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxDetails;

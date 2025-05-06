import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Box } from 'lucide-react';
import { BoxProduct } from '@/types/boxes';
import { toast } from "@/hooks/use-toast";
import { boxes } from '@/data/boxes';
import Box3DViewer from './Box3DViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState<"details" | "3d">("details");
  
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

  // Convert BoxProduct to the format required by Box3DViewer
  const getProductsFor3DViewer = () => {
    return products
      .filter((_, index) => selectedProductIds.includes(index.toString()))
      .map((product, index) => {
        if (!product.dimensions) {
          return {
            id: index + 1,
            name: product.name,
            width: 5, // default values if dimensions not provided
            height: 5,
            depth: 5,
            color: getRandomColor(product.name)
          };
        }
        return {
          id: index + 1,
          name: product.name,
          width: product.dimensions.width,
          height: product.dimensions.height,
          depth: product.dimensions.depth,
          color: getRandomColor(product.name)
        };
      });
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
  
  const totalVolume = calculateTotalVolume();
  const boxVolume = BOX_DIMENSIONS[boxSize].width * 
                    BOX_DIMENSIONS[boxSize].height * 
                    BOX_DIMENSIONS[boxSize].depth;
  const volumePercentage = (totalVolume / boxVolume) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "details" | "3d")} className="w-full">
            <div className="border-b">
              <div className="px-6 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <div className="text-2xl font-bold text-leaf-green">
                    {price.toFixed(2)}€
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{description}</p>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="3d" className="flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    <span>Visualisation 3D</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="details" className="p-6 pt-4">
              <div className="md:flex">
                <div className="md:w-1/2 md:pr-6">
                  <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-48 md:h-64 object-cover rounded-md mb-4"
                  />
                </div>
                
                <div className="md:w-1/2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Contenu de la box</h3>
                    <div className={`text-sm ${weightExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'} mb-1`}>
                      Poids total sélectionné: {totalWeight.toFixed(2)} kg / {weightLimit} kg {weightExceeded && '⚠️'}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Volume total sélectionné: {totalVolume.toFixed(2)} cm³ ({volumePercentage.toFixed(1)}% de la capacité)
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
                                  Dimensions: {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm (L×H×P)
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
            </TabsContent>
            
            <TabsContent value="3d" className="p-6 pt-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Volume total sélectionné: {totalVolume.toFixed(2)} cm³ ({volumePercentage.toFixed(1)}% de la capacité)
                    </p>
                    <p className="text-sm text-gray-600">
                      Dimensions de la box: {BOX_DIMENSIONS[boxSize].width} × {BOX_DIMENSIONS[boxSize].height} × {BOX_DIMENSIONS[boxSize].depth} cm (L×H×P)
                    </p>
                  </div>
                </div>
                
                <div className="h-[500px] border rounded-md">
                  <Box3DViewer 
                    products={getProductsFor3DViewer()}
                    boxSize={boxSize}
                    boxDimensions={BOX_DIMENSIONS[boxSize]}
                  />
                </div>
                
                <div className="text-sm text-gray-500 italic">
                  Astuce: Utilisez la souris pour faire pivoter la box. Molette pour zoomer.
                </div>
                
                <Button 
                  className={`w-full ${weightExceeded ? 'bg-gray-400 cursor-not-allowed' : 'bg-leaf-green hover:bg-dark-green'} text-white`}
                  disabled={weightExceeded}
                >
                  {weightExceeded ? 'Poids maximum dépassé' : 'Ajouter au panier'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BoxDetails;

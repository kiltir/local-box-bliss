
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BoxProduct } from '@/types/boxes';
import { useBoxCalculations } from './useBoxCalculations';
import ProductList from './ProductList';
import AddToCartButton from './AddToCartButton';

interface BoxDetailsContentProps {
  isActive: boolean;
  products: BoxProduct[];
  image: string;
  boxTheme: 'Découverte' | 'Bourbon' | 'Tradition' | 'Saison';
  boxId: number;
  onBoxChange?: (boxId: number) => void;
}

const BoxDetailsContent = ({
  isActive,
  products,
  image,
  boxTheme,
  boxId,
  onBoxChange
}: BoxDetailsContentProps) => {
  const {
    selectedProductIds,
    productQuantities,
    handleProductToggle,
    handleQuantityChange,
    totalWeight,
    weightLimit,
    weightExceeded,
    totalVolume,
    volumePercentage
  } = useBoxCalculations(products, boxTheme, boxId, onBoxChange);

  return (
    <TabsContent value="details" className="p-3 sm:p-6 pt-3 sm:pt-4">
      <div className="flex flex-col">
        {/* Image de la box - optimisée pour mobile */}
        <div className="mb-4 sm:mb-6">
          <img 
            src={image} 
            alt="Box" 
            className="w-full h-32 sm:h-40 md:h-52 object-cover rounded-md"
          />
        </div>
        
        {/* Informations sur la box */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold mb-3">Contenu de la box</h3>
          
          {/* Informations de poids et volume - stack sur mobile */}
          <div className="space-y-1 mb-3">
            <div className={`text-sm ${weightExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              <span className="font-medium">Poids:</span> {totalWeight.toFixed(2)} kg / {weightLimit} kg {weightExceeded && '⚠️'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Volume:</span> {totalVolume.toFixed(2)} cm³ ({volumePercentage.toFixed(1)}%)
            </div>
          </div>
          
          <ProductList 
            products={products}
            selectedProductIds={selectedProductIds}
            productQuantities={productQuantities}
            onToggle={handleProductToggle}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>
      
      <AddToCartButton 
        weightExceeded={weightExceeded} 
        weightLimit={weightLimit} 
      />
    </TabsContent>
  );
};

export default BoxDetailsContent;

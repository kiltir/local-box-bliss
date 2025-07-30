
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
    <TabsContent value="details" className="p-6 pt-4">
      <div className="md:flex">
        <div className="md:w-1/2 md:pr-6">
          <img 
            src={image} 
            alt="Box" 
            className="w-full h-40 md:h-52 object-cover rounded-md mb-4"
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
            
            <ProductList 
              products={products}
              selectedProductIds={selectedProductIds}
              productQuantities={productQuantities}
              onToggle={handleProductToggle}
              onQuantityChange={handleQuantityChange}
            />
          </div>
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


import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { BoxProduct } from '@/types/boxes';
import Box3DViewer from '../Box3DViewer';
import { useBoxCalculations } from './useBoxCalculations';
import AddToCartButton from './AddToCartButton';

interface BoxDetails3DViewProps {
  isActive: boolean;
  products: BoxProduct[];
  boxSize: 'small' | 'medium' | 'large';
  boxId: number;
  onBoxChange?: (boxId: number) => void;
}

const BoxDetails3DView = ({ 
  isActive, 
  products, 
  boxSize, 
  boxId, 
  onBoxChange 
}: BoxDetails3DViewProps) => {
  const {
    BOX_DIMENSIONS,
    totalVolume,
    volumePercentage,
    weightExceeded,
    weightLimit,
    getProductsFor3DViewer
  } = useBoxCalculations(products, boxSize, boxId, onBoxChange);

  return (
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
        
        <AddToCartButton 
          weightExceeded={weightExceeded} 
          weightLimit={weightLimit} 
        />
      </div>
    </TabsContent>
  );
};

export default BoxDetails3DView;

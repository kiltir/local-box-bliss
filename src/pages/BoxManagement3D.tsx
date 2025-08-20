import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Box3DViewer from '@/components/Box3DViewer';
import ProductSelector from '@/components/ProductSelector';
import { Product, BoxSize } from '@/types/box';
import { BOX_DIMENSIONS } from '@/utils/box/constants';

const BoxManagement3D = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [currentBoxSize, setCurrentBoxSize] = useState<BoxSize>('unique');

  const handleAddProduct = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const calculateVolume = () => {
    let totalVolume = 0;
    selectedProducts.forEach(product => {
      totalVolume += product.width * product.height * product.depth;
    });
    return totalVolume;
  };

  const boxVolume = BOX_DIMENSIONS.unique.width * 
                    BOX_DIMENSIONS.unique.height * 
                    BOX_DIMENSIONS.unique.depth;
  
  const volumeUsedPercentage = (calculateVolume() / boxVolume) * 100;
  const isBoxOverfilled = volumeUsedPercentage > 100;

  return (
    <div className="container-section">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Gestion 3D des Box</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
          <Box3DViewer 
            products={selectedProducts} 
            boxSize={currentBoxSize}
            boxDimensions={BOX_DIMENSIONS.unique}
          />
        </div>
        
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Paramètres</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Box Unique</label>
            <div className="flex space-x-3">
              <Button 
                variant="default"
                disabled
              >
                Format Unique ({BOX_DIMENSIONS.unique.width}×{BOX_DIMENSIONS.unique.height}×{BOX_DIMENSIONS.unique.depth} cm)
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <ProductSelector 
              onAddProduct={handleAddProduct} 
              selectedProductIds={selectedProducts.map(p => p.id)}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Contenu de la Box</h3>
            {selectedProducts.length === 0 ? (
              <p className="text-gray-500">Aucun produit sélectionné</p>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {selectedProducts.map(product => (
                  <li key={product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{product.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-500 h-auto p-1"
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Espace utilisé</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${isBoxOverfilled ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min(volumeUsedPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{volumeUsedPercentage.toFixed(1)}% utilisé</span>
              <span>{isBoxOverfilled ? '⚠️ Dépassement' : 'OK'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxManagement3D;

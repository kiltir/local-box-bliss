
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from 'lucide-react';
import { BoxProduct } from '@/types/boxes';

interface BoxDetailsProps {
  title: string;
  price: number;
  description: string;
  image: string;
  products: BoxProduct[];
  onClose: () => void;
}

const BoxDetails = ({ title, price, description, image, products, onClose }: BoxDetailsProps) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(products.map((_, index) => index.toString()));

  // Calculate total volume in m³
  const calculateTotalVolume = () => {
    return products
      .filter((_, index) => selectedProductIds.includes(index.toString()))
      .reduce((total, product) => {
        const volume = (product.dimensions?.width || 0) * 
                      (product.dimensions?.height || 0) * 
                      (product.dimensions?.depth || 0) / 1000000; // Convert from cm³ to m³
        return total + volume;
      }, 0);
  };

  const handleProductToggle = (productIndex: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, productIndex]);
    } else {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productIndex));
    }
  };

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
                <div className="text-sm text-gray-600 mb-2">
                  Volume sélectionné : {calculateTotalVolume().toFixed(6)} m³
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
                          {product.dimensions && (
                            <div className="text-sm text-gray-500 mt-1">
                              Dimensions: {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button className="w-full bg-leaf-green hover:bg-dark-green text-white">
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxDetails;

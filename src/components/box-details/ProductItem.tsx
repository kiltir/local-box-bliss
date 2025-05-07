
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from 'lucide-react';
import { BoxProduct } from '@/types/boxes';

interface ProductItemProps {
  product: BoxProduct;
  index: number;
  isSelected: boolean;
  quantity: number;
  onToggle: (productIndex: string, checked: boolean) => void;
  onQuantityChange: (productIndex: string, change: number) => void;
}

const ProductItem = ({ 
  product, 
  index, 
  isSelected,
  quantity,
  onToggle,
  onQuantityChange
}: ProductItemProps) => {
  const calculateProductVolume = (product: BoxProduct) => {
    if (!product.dimensions) return 0;
    return (product.dimensions.width * 
            product.dimensions.height * 
            product.dimensions.depth);
  };

  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`product-${index}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(index.toString(), checked === true)}
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <label 
              htmlFor={`product-${index}`}
              className="font-medium cursor-pointer"
            >
              {product.name}
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-3">{product.quantity}</span>
              {isSelected && (
                <div className="flex items-center border rounded-md">
                  <button 
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={() => onQuantityChange(index.toString(), -1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-2 select-none">{quantity}</span>
                  <button 
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={() => onQuantityChange(index.toString(), 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Producteur: {product.producer}
          </div>
          {product.weight && (
            <div className="text-sm text-gray-500">
              Poids: {product.weight.toFixed(2)} kg {isSelected && quantity > 1 && 
                `× ${quantity} = ${(product.weight * quantity).toFixed(2)} kg`}
            </div>
          )}
          {product.dimensions && (
            <div className="text-sm text-gray-500 mt-1">
              Dimensions: {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm (L×H×P)
              {isSelected && quantity > 1 && (
                <span className="block">
                  Volume total: {(calculateProductVolume(product) * quantity).toFixed(2)} cm³
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default ProductItem;

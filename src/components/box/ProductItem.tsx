
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { BoxProduct } from '@/types/boxes';

interface ProductItemProps {
  product: BoxProduct;
  index: number;
  isSelected: boolean;
  onToggle: (productIndex: string, checked: boolean) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  product, 
  index, 
  isSelected, 
  onToggle 
}) => {
  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`product-${index}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(index.toString(), checked === true)}
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
  );
};

export default ProductItem;


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

  // Generate a placeholder image URL based on product name
  const getProductImage = (productName: string) => {
    // Create a simple mapping for product images based on keywords
    const name = productName.toLowerCase();
    if (name.includes('miel') || name.includes('honey')) {
      return 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=120&h=120&fit=crop';
    }
    if (name.includes('rhum') || name.includes('alcool')) {
      return 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=120&h=120&fit=crop';
    }
    if (name.includes('tisane') || name.includes('thé')) {
      return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120&h=120&fit=crop';
    }
    if (name.includes('piment')) {
      return 'https://images.unsplash.com/photo-1583076962938-713add2bf882?w=120&h=120&fit=crop';
    }
    if (name.includes('confiture') || name.includes('jam')) {
      return 'https://images.unsplash.com/photo-1486893732792-ab0085cb2d43?w=120&h=120&fit=crop';
    }
    if (name.includes('bonbons') || name.includes('chocolat')) {
      return 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=120&h=120&fit=crop';
    }
    if (name.includes('huile') || name.includes('essence')) {
      return 'https://images.unsplash.com/photo-1615735487485-e52b9af610c1?w=120&h=120&fit=crop';
    }
    if (name.includes('vanille')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop';
    }
    if (name.includes('café')) {
      return 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=120&h=120&fit=crop';
    }
    if (name.includes('bière')) {
      return 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=120&h=120&fit=crop';
    }
    if (name.includes('biscuit')) {
      return 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=120&h=120&fit=crop';
    }
    // Default image for unknown products
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=120&fit=crop';
  };

  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`product-${index}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(index.toString(), checked === true)}
        />
        <img 
          src={getProductImage(product.name)}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
          onError={(e) => {
            // Fallback to a default image if the specific image fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=120&fit=crop';
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <label 
                htmlFor={`product-${index}`}
                className="font-medium cursor-pointer block"
              >
                {product.name}
              </label>
              <div className="text-sm text-gray-500 mt-1">
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
            
            <div className="flex items-center gap-3 ml-4">
              <span className="text-gray-600 text-sm">{product.quantity}</span>
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
        </div>
      </div>
    </li>
  );
};

export default ProductItem;

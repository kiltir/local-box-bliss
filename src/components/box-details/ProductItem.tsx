
import React from 'react';
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
    if (name.includes('calicoco')) {
      return '/lovable-uploads/ti-calicoco-boite.jpg';
    }
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
    <li className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3">
        <img 
          src={getProductImage(product.name)}
          alt={product.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&h=120&fit=crop';
          }}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-medium block text-sm sm:text-base leading-tight">
                {product.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">
                {product.producer}
              </div>
              {product.weight && (
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {product.weight.toFixed(2)} kg
                </div>
              )}
              {product.dimensions && (
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth} cm
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end flex-shrink-0">
              <span className="text-gray-600 text-xs sm:text-sm">{product.quantity}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;


import React from 'react';
import { BoxProduct } from '@/types/boxes';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: BoxProduct[];
  selectedProductIds: string[];
  onProductToggle: (productIndex: string, checked: boolean) => void;
  totalWeight: number;
  totalVolume: number;
  weightLimit: number;
  volumeLimit?: number;
  weightExceeded: boolean;
  volumeExceeded?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedProductIds,
  onProductToggle,
  totalWeight,
  totalVolume,
  weightLimit,
  volumeLimit,
  weightExceeded,
  volumeExceeded
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Contenu de la box</h3>
      <div className={`text-sm ${weightExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'} mb-1`}>
        Poids total sélectionné: {totalWeight.toFixed(2)} kg / {weightLimit} kg {weightExceeded && '⚠️'}
      </div>
      <div className={`text-sm ${volumeExceeded ? 'text-red-600 font-semibold' : 'text-gray-600'} mb-2`}>
        Volume total sélectionné: {totalVolume.toFixed(2)} cm³ {volumeLimit ? `/ ${volumeLimit} cm³` : ''} {volumeExceeded && '⚠️'}
      </div>
      <ul className="divide-y">
        {products.map((product, index) => (
          <ProductItem
            key={index}
            product={product}
            index={index}
            isSelected={selectedProductIds.includes(index.toString())}
            onToggle={onProductToggle}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

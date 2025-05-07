
import { BoxProduct } from '@/types/boxes';
import { getRandomColor } from './colorUtils';
import { calculateProductVolume } from './calculationUtils';

// Convert BoxProduct to the format required by Box3DViewer
export const mapProductsFor3DViewer = (
  products: BoxProduct[],
  selectedProductIds: string[],
  productQuantities: Record<string, number>
) => {
  const result: Array<{
    id: number;
    name: string;
    width: number;
    height: number;
    depth: number;
    color: string;
  }> = [];

  products
    .filter((_, index) => selectedProductIds.includes(index.toString()))
    .forEach((product, i) => {
      const productIndex = selectedProductIds[i];
      const quantity = productQuantities[productIndex] || 1;

      // Add one instance of the product for each quantity
      for (let q = 0; q < quantity; q++) {
        if (!product.dimensions) {
          result.push({
            id: result.length + 1,
            name: `${product.name} (${q + 1}/${quantity})`,
            width: 5, // default values if dimensions not provided
            height: 5,
            depth: 5,
            color: getRandomColor(product.name)
          });
        } else {
          result.push({
            id: result.length + 1,
            name: `${product.name} (${q + 1}/${quantity})`,
            width: product.dimensions.width,
            height: product.dimensions.height,
            depth: product.dimensions.depth,
            color: getRandomColor(product.name)
          });
        }
      }
    });

  return result;
};

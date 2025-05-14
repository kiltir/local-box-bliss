
import { Product } from '@/types/3d';
import { GridSize } from './types';

// Mark grid cells as occupied
export function markGridCellsOccupied(
  grid: boolean[][][], 
  position: [number, number, number], 
  product: any, 
  gridSize: GridSize
) {
  const [x, y, z] = position;
  
  for (let dx = 0; dx < Math.ceil(product.spacedWidth); dx++) {
    for (let dy = 0; dy < Math.ceil(product.spacedHeight); dy++) {
      for (let dz = 0; dz < Math.ceil(product.spacedDepth); dz++) {
        const gridX = x + dx;
        const gridY = y + dy;
        const gridZ = z + dz;
        
        if (gridX < grid.length && gridY < grid[0].length && gridZ < grid[0][0].length) {
          grid[gridX][gridY][gridZ] = true;
        }
      }
    }
  }
}


import { Product } from '@/types/3d';
import { PlacementResult, ScaledBox, GridSize, FallbackResult } from './types';
import { markGridCellsOccupied } from './gridUtils';

// Function to place a product in the optimal position
export function placeProductOptimally(
  scaledProduct: any, 
  scaledBox: ScaledBox, 
  grid: boolean[][][], 
  gridSize: GridSize, 
  boxMinX: number, 
  boxMinY: number, 
  boxMinZ: number, 
  boxMaxX: number, 
  boxMaxY: number, 
  boxMaxZ: number
): PlacementResult {
  
  // Start from the bottom of the box for better stability
  for (let y = 0; y < gridSize.y - Math.ceil(scaledProduct.spacedHeight); y++) {
    for (let x = 0; x < gridSize.x - Math.ceil(scaledProduct.spacedWidth); x++) {
      for (let z = 0; z < gridSize.z - Math.ceil(scaledProduct.spacedDepth); z++) {
        // Convert grid coordinates to actual positions
        const realX = boxMinX + (x / (gridSize.x - 1)) * scaledBox.width;
        const realY = boxMinY + (y / (gridSize.y - 1)) * scaledBox.height;
        const realZ = boxMinZ + (z / (gridSize.z - 1)) * scaledBox.depth;
        
        // Check if product would fit within box bounds with spacing buffer
        const productMaxX = realX + scaledProduct.spacedWidth;
        const productMaxY = realY + scaledProduct.spacedHeight;
        const productMaxZ = realZ + scaledProduct.spacedDepth;
        
        if (productMaxX > boxMaxX || productMaxY > boxMaxY || productMaxZ > boxMaxZ) {
          continue;
        }
        
        // Check if position is free
        let fits = true;
        
        // Check if position is already occupied, considering spaced dimensions
        for (let dx = 0; dx < Math.ceil(scaledProduct.spacedWidth) && fits; dx++) {
          for (let dy = 0; dy < Math.ceil(scaledProduct.spacedHeight) && fits; dy++) {
            for (let dz = 0; dz < Math.ceil(scaledProduct.spacedDepth) && fits; dz++) {
              const gridX = x + dx;
              const gridY = y + dy;
              const gridZ = z + dz;
              
              if (
                gridX >= grid.length || 
                gridY >= grid[0].length || 
                gridZ >= grid[0][0].length ||
                grid[gridX][gridY][gridZ]
              ) {
                fits = false;
              }
            }
          }
        }
        
        if (fits) {
          // Mark the grid cells as occupied
          markGridCellsOccupied(grid, [x, y, z], scaledProduct, gridSize);
          
          // Calculate the center position of the product
          const productCenterX = realX + scaledProduct.width / 2;
          const productCenterY = realY + scaledProduct.height / 2;
          const productCenterZ = realZ + scaledProduct.depth / 2;
          
          return {
            placed: true,
            position: [productCenterX, productCenterY, productCenterZ] as [number, number, number],
            rotation: [scaledProduct.rx || 0, scaledProduct.ry || 0, scaledProduct.rz || 0] as [number, number, number],
            gridPosition: [x, y, z]
          };
        }
      }
    }
  }
  
  // If we couldn't place the product optimally
  return {
    placed: false,
    position: [0, 0, 0] as [number, number, number],
    rotation: [scaledProduct.rx || 0, scaledProduct.ry || 0, scaledProduct.rz || 0] as [number, number, number],
    gridPosition: [0, 0, 0]
  };
}

// Find a fallback position with minimal overlaps
export function findFallbackPosition(
  scaledProduct: any, 
  scaledBox: ScaledBox, 
  grid: boolean[][][], 
  gridSize: GridSize,
  boxMinX: number, 
  boxMinY: number, 
  boxMinZ: number
): FallbackResult {
  
  let leastOverlap = Number.MAX_VALUE;
  let bestPosition: [number, number, number] = [0, 0, 0];
  
  // Try various positions with a larger step size to speed up search
  const stepSize = 2;
  for (let y = 0; y < gridSize.y - Math.ceil(scaledProduct.height); y += stepSize) {
    for (let x = 0; x < gridSize.x - Math.ceil(scaledProduct.width); x += stepSize) {
      for (let z = 0; z < gridSize.z - Math.ceil(scaledProduct.depth); z += stepSize) {
        // Count occupied cells in this region
        let overlapCount = 0;
        
        for (let dx = 0; dx < Math.ceil(scaledProduct.spacedWidth); dx++) {
          for (let dy = 0; dy < Math.ceil(scaledProduct.spacedHeight); dy++) {
            for (let dz = 0; dz < Math.ceil(scaledProduct.spacedDepth); dz++) {
              const gridX = x + dx;
              const gridY = y + dy;
              const gridZ = z + dz;
              
              if (
                gridX < grid.length && 
                gridY < grid[0].length && 
                gridZ < grid[0][0].length &&
                grid[gridX][gridY][gridZ]
              ) {
                overlapCount++;
              }
            }
          }
        }
        
        if (overlapCount < leastOverlap) {
          leastOverlap = overlapCount;
          bestPosition = [x, y, z];
          
          if (leastOverlap === 0) break;
        }
      }
      
      if (leastOverlap === 0) break;
    }
    
    if (leastOverlap === 0) break;
  }
  
  // Convert grid position to box coordinates
  const realX = boxMinX + (bestPosition[0] / (gridSize.x - 1)) * scaledBox.width;
  const realY = boxMinY + (bestPosition[1] / (gridSize.y - 1)) * scaledBox.height;
  const realZ = boxMinZ + (bestPosition[2] / (gridSize.z - 1)) * scaledBox.depth;
  
  // Calculate the center position of the product
  const productCenterX = realX + scaledProduct.width / 2;
  const productCenterY = realY + scaledProduct.height / 2;
  const productCenterZ = realZ + scaledProduct.depth / 2;
  
  return {
    position: [productCenterX, productCenterY, productCenterZ] as [number, number, number],
    rotation: [scaledProduct.rx || 0, scaledProduct.ry || 0, scaledProduct.rz || 0] as [number, number, number],
    gridPosition: bestPosition
  };
}

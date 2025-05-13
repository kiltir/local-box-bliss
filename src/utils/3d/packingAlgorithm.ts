
import * as THREE from 'three';
import { Product } from '@/types/3d';

// Improved packing algorithm for better volume visualization
export const packProducts = (products: Product[], boxDimensions: { width: number; height: number; depth: number; }) => {
  // Use direct conversion with a smaller scale factor to make products visually recognizable
  // but still proportional to the box
  const scaleFactor = 10;
  const scale = (val: number) => val / scaleFactor;
  
  const scaledBox = {
    width: scale(boxDimensions.width),
    height: scale(boxDimensions.height),
    depth: scale(boxDimensions.depth)
  };
  
  const positions: [number, number, number][] = [];
  const scaledProducts: Product[] = [];
  
  const grid: boolean[][][] = Array(Math.ceil(scaledBox.width * 2))
    .fill(false)
    .map(() => 
      Array(Math.ceil(scaledBox.height * 2))
        .fill(false)
        .map(() => Array(Math.ceil(scaledBox.depth * 2)).fill(false))
    );
  
  // Center the box at the origin
  const boxCenterX = 0;
  const boxCenterY = 0;
  const boxCenterZ = 0;
  
  // Calculate box corners
  const boxMinX = boxCenterX - scaledBox.width / 2;
  const boxMinY = boxCenterY - scaledBox.height / 2;
  const boxMinZ = boxCenterZ - scaledBox.depth / 2;

  // Pre-process products to ensure they all fit in the box
  products.forEach((product, index) => {
    // Create a copy of the product with scaled dimensions
    const scaledProduct = {
      ...product,
      width: scale(product.width),
      height: scale(product.height),
      depth: scale(product.depth)
    };
    
    // Check if product is too big for the box and scale it down if needed
    if (scaledProduct.width > scaledBox.width || 
        scaledProduct.height > scaledBox.height || 
        scaledProduct.depth > scaledBox.depth) {
      
      // Calculate how much we need to scale down the product to fit
      const maxRatio = Math.max(
        scaledProduct.width / (scaledBox.width * 0.95),
        scaledProduct.height / (scaledBox.height * 0.95),
        scaledProduct.depth / (scaledBox.depth * 0.95)
      );
      
      if (maxRatio > 1) {
        // Scale down the product proportionally to fit inside the box
        scaledProduct.width /= maxRatio;
        scaledProduct.height /= maxRatio;
        scaledProduct.depth /= maxRatio;
        
        // No need to log warning, it's an expected behavior
      }
    }
    
    scaledProducts.push(scaledProduct);
  });

  // Now place each scaled product inside the box
  for (const scaledProduct of scaledProducts) {
    // Find a place for this product
    let placed = false;
    
    // Try to place from bottom up for better visual stability
    for (let y = 0; y < Math.ceil(scaledBox.height - scaledProduct.height) + 1 && !placed; y++) {
      for (let x = 0; x < Math.ceil(scaledBox.width - scaledProduct.width) + 1 && !placed; x++) {
        for (let z = 0; z < Math.ceil(scaledBox.depth - scaledProduct.depth) + 1 && !placed; z++) {
          // Check if this position is free
          let fits = true;
          
          for (let dx = 0; dx < Math.ceil(scaledProduct.width) && fits; dx++) {
            for (let dy = 0; dy < Math.ceil(scaledProduct.height) && fits; dy++) {
              for (let dz = 0; dz < Math.ceil(scaledProduct.depth) && fits; dz++) {
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
            // Place the product and mark the grid cells as occupied
            for (let dx = 0; dx < Math.ceil(scaledProduct.width); dx++) {
              for (let dy = 0; dy < Math.ceil(scaledProduct.height); dy++) {
                for (let dz = 0; dz < Math.ceil(scaledProduct.depth); dz++) {
                  const gridX = x + dx;
                  const gridY = y + dy;
                  const gridZ = z + dz;
                  
                  if (gridX < grid.length && gridY < grid[0].length && gridZ < grid[0][0].length) {
                    grid[gridX][gridY][gridZ] = true;
                  }
                }
              }
            }
            
            // Calculate the center position of the product relative to the box center
            const productCenterX = boxMinX + x + scaledProduct.width / 2;
            const productCenterY = boxMinY + y + scaledProduct.height / 2;
            const productCenterZ = boxMinZ + z + scaledProduct.depth / 2;
            
            positions.push([productCenterX, productCenterY, productCenterZ]);
            placed = true;
          }
        }
      }
    }
    
    // If can't place the product normally, find another solution instead of putting it above the box
    if (!placed) {
      // Try to place it anywhere inside the box, even if it overlaps other products
      // Find the emptiest spot in the box
      let bestPosition = [0, 0, 0];
      let leastOverlap = Number.MAX_VALUE;
      
      // Sample different positions inside the box
      for (let y = 0; y < Math.ceil(scaledBox.height - scaledProduct.height) + 1; y += 1) {
        for (let x = 0; x < Math.ceil(scaledBox.width - scaledProduct.width) + 1; x += 1) {
          for (let z = 0; z < Math.ceil(scaledBox.depth - scaledProduct.depth) + 1; z += 1) {
            // Count occupied cells in this region
            let overlapCount = 0;
            
            for (let dx = 0; dx < Math.ceil(scaledProduct.width); dx++) {
              for (let dy = 0; dy < Math.ceil(scaledProduct.height); dy++) {
                for (let dz = 0; dz < Math.ceil(scaledProduct.depth); dz++) {
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
              
              // If we found a position with no overlap, use it immediately
              if (leastOverlap === 0) {
                break;
              }
            }
          }
          
          if (leastOverlap === 0) break;
        }
        
        if (leastOverlap === 0) break;
      }
      
      // Calculate the center position of the product relative to the box center
      const productCenterX = boxMinX + bestPosition[0] + scaledProduct.width / 2;
      const productCenterY = boxMinY + bestPosition[1] + scaledProduct.height / 2;
      const productCenterZ = boxMinZ + bestPosition[2] + scaledProduct.depth / 2;
      
      positions.push([productCenterX, productCenterY, productCenterZ]);
      
      // Mark the grid cells as occupied
      for (let dx = 0; dx < Math.ceil(scaledProduct.width); dx++) {
        for (let dy = 0; dy < Math.ceil(scaledProduct.height); dy++) {
          for (let dz = 0; dz < Math.ceil(scaledProduct.depth); dz++) {
            const gridX = bestPosition[0] + dx;
            const gridY = bestPosition[1] + dy;
            const gridZ = bestPosition[2] + dz;
            
            if (gridX < grid.length && gridY < grid[0].length && gridZ < grid[0][0].length) {
              grid[gridX][gridY][gridZ] = true;
            }
          }
        }
      }
    }
  }
  
  return {
    productPositions: positions,
    scaledProducts,
    scaledBox
  };
};

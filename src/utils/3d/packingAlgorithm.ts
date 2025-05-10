
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

  for (const product of products) {
    const scaledProduct = {
      width: scale(product.width),
      height: scale(product.height),
      depth: scale(product.depth)
    };
    
    // Check if product is too big for the box
    if (scaledProduct.width > scaledBox.width || 
        scaledProduct.height > scaledBox.height || 
        scaledProduct.depth > scaledBox.depth) {
      console.warn(`Product ${product.name} is too big for the box and will be scaled down`);
      // Scale down oversized products to fit
      const maxRatio = Math.max(
        scaledProduct.width / scaledBox.width,
        scaledProduct.height / scaledBox.height,
        scaledProduct.depth / scaledBox.depth
      );
      if (maxRatio > 1) {
        scaledProduct.width /= maxRatio * 1.05;
        scaledProduct.height /= maxRatio * 1.05;
        scaledProduct.depth /= maxRatio * 1.05;
      }
    }
    
    // Find a place for this product
    let placed = false;
    
    // Try to place from bottom to top for better visual stability
    for (let y = 0; y < scaledBox.height - scaledProduct.height + 1 && !placed; y++) {
      for (let x = 0; x < scaledBox.width - scaledProduct.width + 1 && !placed; x++) {
        for (let z = 0; z < scaledBox.depth - scaledProduct.depth + 1 && !placed; z++) {
          // Check if this position is free
          let fits = true;
          
          for (let dx = 0; dx < scaledProduct.width && fits; dx++) {
            for (let dy = 0; dy < scaledProduct.height && fits; dy++) {
              for (let dz = 0; dz < scaledProduct.depth && fits; dz++) {
                const gridX = Math.floor(x + dx);
                const gridY = Math.floor(y + dy);
                const gridZ = Math.floor(z + dz);
                
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
            for (let dx = 0; dx < scaledProduct.width; dx++) {
              for (let dy = 0; dy < scaledProduct.height; dy++) {
                for (let dz = 0; dz < scaledProduct.depth; dz++) {
                  const gridX = Math.floor(x + dx);
                  const gridY = Math.floor(y + dy);
                  const gridZ = Math.floor(z + dz);
                  
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
    
    // If can't place the product, put it above the box (better than random placement)
    if (!placed) {
      positions.push([
        boxCenterX,
        boxCenterY + scaledBox.height/2 + scaledProduct.height/2 + 0.1,
        boxCenterZ
      ]);
    }
  }
  
  return {
    productPositions: positions,
    scaledProducts: products.map(p => ({
      ...p,
      width: scale(p.width),
      height: scale(p.height),
      depth: scale(p.depth)
    })),
    scaledBox
  };
};

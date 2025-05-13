
import * as THREE from 'three';
import { Product } from '@/types/3d';

// Improved packing algorithm for better volume visualization
export const packProducts = (products: Product[], boxDimensions: { width: number; height: number; depth: number; }) => {
  // Use direct conversion with a smaller scale factor to make products visually recognizable
  // but still proportional to the box
  const scaleFactor = 10;
  const scale = (val: number) => val / scaleFactor;
  
  // Add a safety margin to ensure products don't touch the box walls
  const SAFETY_MARGIN = 0.1; // 10% safety margin (increased from 5%)
  
  // Define minimum spacing between products (4cm in scaled units)
  const PRODUCT_SPACING = scale(4); // 4cm spacing between products
  
  const scaledBox = {
    width: scale(boxDimensions.width) * (1 - 2 * SAFETY_MARGIN),
    height: scale(boxDimensions.height) * (1 - 2 * SAFETY_MARGIN),
    depth: scale(boxDimensions.depth) * (1 - 2 * SAFETY_MARGIN)
  };
  
  const positions: [number, number, number][] = [];
  const scaledProducts: Product[] = [];
  
  const gridSize = {
    x: Math.ceil(scaledBox.width * 2),
    y: Math.ceil(scaledBox.height * 2),
    z: Math.ceil(scaledBox.depth * 2)
  };
  
  const grid: boolean[][][] = Array(gridSize.x)
    .fill(false)
    .map(() => 
      Array(gridSize.y)
        .fill(false)
        .map(() => Array(gridSize.z).fill(false))
    );
  
  // Center the box at the origin
  const boxCenterX = 0;
  const boxCenterY = 0;
  const boxCenterZ = 0;
  
  // Calculate box corners with safety margin
  const boxMinX = boxCenterX - scaledBox.width / 2;
  const boxMinY = boxCenterY - scaledBox.height / 2;
  const boxMinZ = boxCenterZ - scaledBox.depth / 2;
  
  const boxMaxX = boxCenterX + scaledBox.width / 2;
  const boxMaxY = boxCenterY + scaledBox.height / 2;
  const boxMaxZ = boxCenterZ + scaledBox.depth / 2;

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
        scaledProduct.width / (scaledBox.width * 0.85), // More aggressive scaling (85% of box)
        scaledProduct.height / (scaledBox.height * 0.85),
        scaledProduct.depth / (scaledBox.depth * 0.85)
      );
      
      if (maxRatio > 1) {
        // Apply a slightly more aggressive scale down factor to ensure some margin
        const scaleFactor = maxRatio * 1.2; // Add 20% more scaling for safety (increased from 10%)
        
        // Scale down the product proportionally to fit inside the box
        scaledProduct.width /= scaleFactor;
        scaledProduct.height /= scaleFactor;
        scaledProduct.depth /= scaleFactor;
        
        console.log(`Product scaled: ${product.name} - original: ${product.width}x${product.height}x${product.depth}, scaled: ${scaledProduct.width}x${scaledProduct.height}x${scaledProduct.depth}`);
      }
    }
    
    // Apply additional scaling for large products as safety
    if (scaledProduct.width > scaledBox.width * 0.4 ||
        scaledProduct.height > scaledBox.height * 0.4 ||
        scaledProduct.depth > scaledBox.depth * 0.4) {
      // Scale down products that take up more than 40% of any box dimension (reduced from 50%)
      const safetyScale = 0.90;
      scaledProduct.width *= safetyScale;
      scaledProduct.height *= safetyScale;
      scaledProduct.depth *= safetyScale;
    }

    // Add spacing to product dimensions to enforce minimum distance between products
    scaledProduct.spacedWidth = scaledProduct.width + PRODUCT_SPACING;
    scaledProduct.spacedHeight = scaledProduct.height + PRODUCT_SPACING;
    scaledProduct.spacedDepth = scaledProduct.depth + PRODUCT_SPACING;
    
    scaledProducts.push(scaledProduct);
  });

  // Sort products by volume (largest first) for better packing
  scaledProducts.sort((a, b) => {
    const volumeA = a.width * a.height * a.depth;
    const volumeB = b.width * b.height * b.depth;
    return volumeB - volumeA;
  });

  // Now place each scaled product inside the box
  for (const scaledProduct of scaledProducts) {
    // Find a place for this product
    let placed = false;
    let bestPosition = [0, 0, 0];
    
    // Start from the bottom of the box for better stability
    for (let y = 0; y < gridSize.y - Math.ceil(scaledProduct.spacedHeight) && !placed; y++) {
      for (let x = 0; x < gridSize.x - Math.ceil(scaledProduct.spacedWidth) && !placed; x++) {
        for (let z = 0; z < gridSize.z - Math.ceil(scaledProduct.spacedDepth) && !placed; z++) {
          // Check if this position is free
          let fits = true;
          
          // Convert grid coordinates to actual positions
          const realX = boxMinX + (x / (gridSize.x - 1)) * scaledBox.width;
          const realY = boxMinY + (y / (gridSize.y - 1)) * scaledBox.height;
          const realZ = boxMinZ + (z / (gridSize.z - 1)) * scaledBox.depth;
          
          // Check if product would fit within box bounds with spacing buffer
          const productMaxX = realX + scaledProduct.spacedWidth;
          const productMaxY = realY + scaledProduct.spacedHeight;
          const productMaxZ = realZ + scaledProduct.spacedDepth;
          
          if (productMaxX > boxMaxX || productMaxY > boxMaxY || productMaxZ > boxMaxZ) {
            fits = false;
            continue;
          }
          
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
            // Place the product and mark the grid cells as occupied (including spacing)
            for (let dx = 0; dx < Math.ceil(scaledProduct.spacedWidth); dx++) {
              for (let dy = 0; dy < Math.ceil(scaledProduct.spacedHeight); dy++) {
                for (let dz = 0; dz < Math.ceil(scaledProduct.spacedDepth); dz++) {
                  const gridX = x + dx;
                  const gridY = y + dy;
                  const gridZ = z + dz;
                  
                  if (gridX < grid.length && gridY < grid[0].length && gridZ < grid[0][0].length) {
                    grid[gridX][gridY][gridZ] = true;
                  }
                }
              }
            }
            
            // Calculate the center position of the product (using actual product dimensions, not spaced)
            const productCenterX = realX + scaledProduct.width / 2;
            const productCenterY = realY + scaledProduct.height / 2;
            const productCenterZ = realZ + scaledProduct.depth / 2;
            
            positions.push([productCenterX, productCenterY, productCenterZ]);
            placed = true;
          }
        }
      }
    }
    
    // If can't place the product normally, find a fallback position with minimal overlaps
    if (!placed) {
      console.warn(`Could not place product: ${scaledProduct.name} - will use fallback position`);
      
      // Find the emptiest spot in the box using a simple heuristic
      let leastOverlap = Number.MAX_VALUE;
      
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
      
      // Convert grid position to box coordinates
      const realX = boxMinX + (bestPosition[0] / (gridSize.x - 1)) * scaledBox.width;
      const realY = boxMinY + (bestPosition[1] / (gridSize.y - 1)) * scaledBox.height;
      const realZ = boxMinZ + (bestPosition[2] / (gridSize.z - 1)) * scaledBox.depth;
      
      // Calculate the center position of the product
      const productCenterX = realX + scaledProduct.width / 2;
      const productCenterY = realY + scaledProduct.height / 2;
      const productCenterZ = realZ + scaledProduct.depth / 2;
      
      positions.push([productCenterX, productCenterY, productCenterZ]);
      
      // Mark the grid cells as occupied (even if there's overlap)
      for (let dx = 0; dx < Math.ceil(scaledProduct.spacedWidth); dx++) {
        for (let dy = 0; dy < Math.ceil(scaledProduct.spacedHeight); dy++) {
          for (let dz = 0; dz < Math.ceil(scaledProduct.spacedDepth); dz++) {
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
  
  // Return with original safety margin added back to scaledBox
  return {
    productPositions: positions,
    scaledProducts,
    scaledBox: {
      width: scale(boxDimensions.width),
      height: scale(boxDimensions.height),
      depth: scale(boxDimensions.depth)
    }
  };
};

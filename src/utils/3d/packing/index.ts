
import * as THREE from 'three';
import { Product } from '@/types/3d';
import { PackingResult, GridSize, ScaledBox } from './types';
import { findOptimalRotation } from './rotationUtils';
import { markGridCellsOccupied } from './gridUtils';
import { placeProductOptimally, findFallbackPosition } from './placementUtils';

// Improved packing algorithm for better volume visualization
export const packProducts = (products: Product[], boxDimensions: { width: number; height: number; depth: number; }): PackingResult => {
  // Use direct conversion with a smaller scale factor to make products visually recognizable
  // but still proportional to the box
  const scaleFactor = 10;
  const scale = (val: number) => val / scaleFactor;
  
  // Add a safety margin to ensure products don't touch the box walls
  const SAFETY_MARGIN = 0.1; // 10% safety margin
  
  // Define minimum spacing between products (4cm in scaled units)
  const PRODUCT_SPACING = scale(4); // 4cm spacing between products
  
  const scaledBox: ScaledBox = {
    width: scale(boxDimensions.width) * (1 - 2 * SAFETY_MARGIN),
    height: scale(boxDimensions.height) * (1 - 2 * SAFETY_MARGIN),
    depth: scale(boxDimensions.depth) * (1 - 2 * SAFETY_MARGIN)
  };
  
  const positions: [number, number, number][] = [];
  const rotations: [number, number, number][] = []; // Store rotation angles for each product
  const scaledProducts: Product[] = [];
  
  const gridSize: GridSize = {
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
    // Create a copy of the product with original dimensions
    const originalProduct = {
      ...product,
      originalWidth: product.width,
      originalHeight: product.height,
      originalDepth: product.depth,
      width: scale(product.width),
      height: scale(product.height),
      depth: scale(product.depth)
    };
    
    // Find the optimal rotation for this product based on box dimensions
    const rotatedProduct = findOptimalRotation(originalProduct, scaledBox);
    
    // Apply additional scaling for large products as safety
    if (rotatedProduct.width > scaledBox.width * 0.4 ||
        rotatedProduct.height > scaledBox.height * 0.4 ||
        rotatedProduct.depth > scaledBox.depth * 0.4) {
      // Scale down products that take up more than 40% of any box dimension
      const safetyScale = 0.90;
      rotatedProduct.width *= safetyScale;
      rotatedProduct.height *= safetyScale;
      rotatedProduct.depth *= safetyScale;
    }

    // Add spacing to product dimensions to enforce minimum distance between products
    rotatedProduct.spacedWidth = rotatedProduct.width + PRODUCT_SPACING;
    rotatedProduct.spacedHeight = rotatedProduct.height + PRODUCT_SPACING;
    rotatedProduct.spacedDepth = rotatedProduct.depth + PRODUCT_SPACING;
    
    scaledProducts.push(rotatedProduct);
  });

  // Sort products by volume (largest first) for better packing
  scaledProducts.sort((a, b) => {
    const volumeA = a.width * a.height * a.depth;
    const volumeB = b.width * b.height * b.depth;
    return volumeB - volumeA;
  });

  // Now place each scaled product inside the box
  for (const scaledProduct of scaledProducts) {
    // Find the best position and orientation for this product
    const result = placeProductOptimally(scaledProduct, scaledBox, grid, gridSize, boxMinX, boxMinY, boxMinZ, boxMaxX, boxMaxY, boxMaxZ);
    
    if (result.placed) {
      positions.push(result.position);
      rotations.push(result.rotation);
    } else {
      console.warn(`Could not place product: ${scaledProduct.name} - will use fallback position`);
      
      // Find a fallback position
      const fallbackResult = findFallbackPosition(scaledProduct, scaledBox, grid, gridSize, boxMinX, boxMinY, boxMinZ);
      positions.push(fallbackResult.position);
      rotations.push(fallbackResult.rotation);
      
      // Mark grid cells as occupied (even with overlap)
      markGridCellsOccupied(grid, fallbackResult.gridPosition, scaledProduct, gridSize);
    }
  }
  
  return {
    productPositions: positions,
    productRotations: rotations,
    scaledProducts,
    scaledBox: {
      width: scale(boxDimensions.width),
      height: scale(boxDimensions.height),
      depth: scale(boxDimensions.depth)
    }
  };
};

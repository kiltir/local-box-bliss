
import * as THREE from 'three';
import { Product } from '@/types/3d';

// Improved packing algorithm for better volume visualization
export const packProducts = (products: Product[], boxDimensions: { width: number; height: number; depth: number; }) => {
  // Use direct conversion with a smaller scale factor to make products visually recognizable
  // but still proportional to the box
  const scaleFactor = 10;
  const scale = (val: number) => val / scaleFactor;
  
  // Add a safety margin to ensure products don't touch the box walls
  const SAFETY_MARGIN = 0.1; // 10% safety margin
  
  // Define minimum spacing between products (4cm in scaled units)
  const PRODUCT_SPACING = scale(4); // 4cm spacing between products
  
  const scaledBox = {
    width: scale(boxDimensions.width) * (1 - 2 * SAFETY_MARGIN),
    height: scale(boxDimensions.height) * (1 - 2 * SAFETY_MARGIN),
    depth: scale(boxDimensions.depth) * (1 - 2 * SAFETY_MARGIN)
  };
  
  const positions: [number, number, number][] = [];
  const rotations: [number, number, number][] = []; // Store rotation angles for each product
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

// Function to find the optimal rotation of a product to best fit the box
function findOptimalRotation(product: any, boxDimensions: any): any {
  // Consider all possible orientations (6 different ways to orient a cuboid)
  const possibleOrientations = [
    { width: product.width, height: product.height, depth: product.depth, rx: 0, ry: 0, rz: 0 },
    { width: product.width, height: product.depth, depth: product.height, rx: Math.PI/2, ry: 0, rz: 0 },
    { width: product.height, height: product.width, depth: product.depth, rx: 0, ry: 0, rz: Math.PI/2 },
    { width: product.height, height: product.depth, depth: product.width, rx: Math.PI/2, ry: Math.PI/2, rz: 0 },
    { width: product.depth, height: product.width, depth: product.height, rx: 0, ry: Math.PI/2, rz: 0 },
    { width: product.depth, height: product.height, depth: product.width, rx: 0, ry: Math.PI/2, rz: Math.PI/2 }
  ];
  
  // For each orientation, check if it fits within the box
  const validOrientations = possibleOrientations.filter(orientation => 
    orientation.width <= boxDimensions.width &&
    orientation.height <= boxDimensions.height &&
    orientation.depth <= boxDimensions.depth
  );
  
  // If no orientation fits, we'll scale down the product
  if (validOrientations.length === 0) {
    // Calculate how much we need to scale down the product to fit
    const maxRatio = Math.max(
      product.width / (boxDimensions.width * 0.85),
      product.height / (boxDimensions.height * 0.85),
      product.depth / (boxDimensions.depth * 0.85)
    );
    
    const scaleFactor = maxRatio * 1.2; // Add 20% more scaling for safety
    
    // Scale down the original product and use the default orientation
    return {
      ...product,
      width: product.width / scaleFactor,
      height: product.height / scaleFactor,
      depth: product.depth / scaleFactor,
      rx: 0, ry: 0, rz: 0
    };
  }
  
  // Select the best orientation based on minimizing wasted space
  let bestOrientation = validOrientations[0];
  let minWastedSpace = Number.MAX_VALUE;
  
  validOrientations.forEach(orientation => {
    // Calculate "wasted" space as the difference between the orientation's volume and the box's volume
    const productVolume = orientation.width * orientation.height * orientation.depth;
    const boxVolume = boxDimensions.width * boxDimensions.height * boxDimensions.depth;
    const wastedSpace = boxVolume - productVolume;
    
    if (wastedSpace < minWastedSpace) {
      minWastedSpace = wastedSpace;
      bestOrientation = orientation;
    }
  });
  
  // Return the product with the optimal orientation
  return {
    ...product,
    width: bestOrientation.width,
    height: bestOrientation.height,
    depth: bestOrientation.depth,
    rx: bestOrientation.rx,
    ry: bestOrientation.ry,
    rz: bestOrientation.rz
  };
}

// Function to place a product in the optimal position
function placeProductOptimally(scaledProduct: any, scaledBox: any, grid: boolean[][][], gridSize: any, 
  boxMinX: number, boxMinY: number, boxMinZ: number, boxMaxX: number, boxMaxY: number, boxMaxZ: number) {
  
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

// Mark grid cells as occupied
function markGridCellsOccupied(grid: boolean[][][], position: [number, number, number], product: any, gridSize: any) {
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

// Find a fallback position with minimal overlaps
function findFallbackPosition(scaledProduct: any, scaledBox: any, grid: boolean[][][], gridSize: any,
  boxMinX: number, boxMinY: number, boxMinZ: number) {
  
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

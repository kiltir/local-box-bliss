
import { Product } from '@/types/3d';
import { ProductOrientation, ScaledBox } from './types';

// Function to find the optimal rotation of a product to best fit the box
export function findOptimalRotation(product: any, boxDimensions: ScaledBox): any {
  // Consider all possible orientations (6 different ways to orient a cuboid)
  const possibleOrientations: ProductOrientation[] = [
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
  
  // Special case for tea bag with dimensions close to 20x15x5
  // This forces it to be placed flat rather than standing
  if (product.name && 
      (product.name.toLowerCase().includes("thé") || product.name.toLowerCase().includes("the")) && 
      Math.abs(product.width - 20) < 2 && 
      Math.abs(product.height - 15) < 2 && 
      Math.abs(product.depth - 5) < 2) {
    // Return the orientation that places the tea bag flat with smallest height
    const flatOrientations = validOrientations.filter(o => o.height < 10);
    if (flatOrientations.length > 0) {
      const bestOrientation = flatOrientations.reduce((prev, curr) => 
        prev.height < curr.height ? prev : curr
      );
      
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

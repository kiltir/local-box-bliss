import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface Product {
  id: number;
  name: string;
  width: number;
  height: number;
  depth: number;
  color?: string;
}

interface Box3DViewerProps {
  products: Product[];
  boxSize: 'small' | 'medium' | 'large';
  boxDimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

const Box3D = ({ dimensions, wireframe = false, color = '#f5eada' }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial color={color} wireframe={wireframe} transparent opacity={wireframe ? 1 : 0.2} />
    </mesh>
  );
};

const SideGrid = ({ size, rotation, position }) => {
  return (
    <Grid 
      args={[size, size]} 
      rotation={rotation} 
      position={position} 
      cellSize={0.5} 
      cellThickness={0.5} 
      cellColor="#6b7280" 
      sectionSize={2} 
      sectionThickness={1} 
      sectionColor="#4b5563" 
      fadeDistance={30} 
      infiniteGrid={false}
    />
  );
};

const ProductMesh = ({ product, position }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[product.width, product.height, product.depth]} />
      <meshStandardMaterial color={product.color || '#8B4513'} />
    </mesh>
  );
};

// Simple packing algorithm for visualization purposes
const packProducts = (products: Product[], boxDimensions: { width: number; height: number; depth: number; }) => {
  // Scale down for visualization (dividing real dimensions by 2)
  const scaleFactor = 2;
  const scale = (val: number) => val / scaleFactor;
  
  const scaledBox = {
    width: scale(boxDimensions.width),
    height: scale(boxDimensions.height),
    depth: scale(boxDimensions.depth)
  };
  
  const positions: [number, number, number][] = [];
  const grid: boolean[][][] = Array(Math.ceil(scaledBox.width))
    .fill(false)
    .map(() => 
      Array(Math.ceil(scaledBox.height))
        .fill(false)
        .map(() => Array(Math.ceil(scaledBox.depth)).fill(false))
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
    
    // Find a place for this product
    let placed = false;
    
    for (let x = 0; x < scaledBox.width - scaledProduct.width + 1 && !placed; x++) {
      for (let y = 0; y < scaledBox.height - scaledProduct.height + 1 && !placed; y++) {
        for (let z = 0; z < scaledBox.depth - scaledProduct.depth + 1 && !placed; z++) {
          // Check if this position is free
          let fits = true;
          
          for (let dx = 0; dx < scaledProduct.width && fits; dx++) {
            for (let dy = 0; dy < scaledProduct.height && fits; dy++) {
              for (let dz = 0; dz < scaledProduct.depth && fits; dz++) {
                if (
                  x + dx >= scaledBox.width || 
                  y + dy >= scaledBox.height || 
                  z + dz >= scaledBox.depth ||
                  grid[x + dx][y + dy][z + dz]
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
                  if (x + dx < scaledBox.width && y + dy < scaledBox.height && z + dz < scaledBox.depth) {
                    grid[x + dx][y + dy][z + dz] = true;
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
    
    // If can't place the product, put it at a random position
    if (!placed) {
      positions.push([
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
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

const Scene = ({ products, boxDimensions }) => {
  const { productPositions, scaledProducts, scaledBox } = packProducts(products, boxDimensions);
  
  // Calculate grid positions based on box dimensions
  const gridSize = Math.max(scaledBox.width, scaledBox.height, scaledBox.depth) * 2;
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {/* Box container */}
      <Box3D dimensions={scaledBox} wireframe={true} color="#388e3c" />
      
      {/* Products */}
      {scaledProducts.map((product, index) => (
        <ProductMesh 
          key={`${product.id}-${index}`} 
          product={product} 
          position={productPositions[index]} 
        />
      ))}
      
      {/* Bottom grid (already exists) */}
      <Grid 
        args={[gridSize, gridSize]} 
        position={[0, -scaledBox.height/2 - 0.05, 0]} 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#6b7280" 
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#4b5563"
        fadeDistance={30}
      />
      
      {/* Left side grid (X-Z plane) */}
      <SideGrid 
        size={gridSize} 
        rotation={[Math.PI/2, 0, Math.PI/2]} 
        position={[-scaledBox.width/2 - 0.05, 0, 0]} 
      />
      
      {/* Right side grid (X-Z plane) */}
      <SideGrid 
        size={gridSize} 
        rotation={[Math.PI/2, 0, Math.PI/2]} 
        position={[scaledBox.width/2 + 0.05, 0, 0]} 
      />
      
      {/* Back side grid (Y-X plane) */}
      <SideGrid 
        size={gridSize} 
        rotation={[0, 0, 0]} 
        position={[0, 0, -scaledBox.depth/2 - 0.05]} 
      />
      
      {/* Box outline */}
      <Box3D dimensions={{ 
        width: scaledBox.width + 0.05, 
        height: scaledBox.height + 0.05, 
        depth: scaledBox.depth + 0.05 
      }} wireframe={true} color="#333" />
    </>
  );
};

const Box3DViewer: React.FC<Box3DViewerProps> = ({ products, boxSize, boxDimensions }) => {
  return (
    <div className="h-full min-h-[500px]">
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <Scene products={products} boxDimensions={boxDimensions} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default Box3DViewer;

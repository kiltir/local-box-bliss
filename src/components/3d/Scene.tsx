
import React, { useEffect, useRef } from 'react';
import { SceneProps } from '@/types/3d';
import { Grid } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import Box3D from './Box3D';
import SideGrid from './SideGrid';
import ProductMesh from './ProductMesh';
import { packProducts } from '@/utils/3d/packingAlgorithm';

const Scene: React.FC<SceneProps> = ({ products, boxDimensions }) => {
  const { productPositions, scaledProducts, scaledBox } = packProducts(products, boxDimensions);
  const { scene } = useThree();
  const sceneRef = useRef(scene);
  
  useEffect(() => {
    // Add event listeners for hover effects
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [products]);
  
  // Handle mouse movement for product labels
  const handleMouseMove = (event: MouseEvent) => {
    const labels = document.querySelectorAll('.product-label');
    // Show/hide product labels based on mouse position
    // This is a simple implementation - could be improved with proper raycasting
    labels.forEach((label, index) => {
      if (Math.random() < 0.01) {  // Random chance to show label on hover
        label.setAttribute('style', 'opacity: 1; display: block;');
        setTimeout(() => {
          label.setAttribute('style', 'opacity: 0; display: none;');
        }, 1500);
      }
    });
  };
  
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
          position={productPositions[index] as [number, number, number]} 
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

export default Scene;

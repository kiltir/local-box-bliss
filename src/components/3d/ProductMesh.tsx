import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductMeshProps } from '@/types/3d';
import { Html } from '@react-three/drei';

const ProductMesh: React.FC<ProductMeshProps> = ({ product, position, rotation = [0, 0, 0] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Apply visual scaling factor to create space between products
  // This will shrink the visual representation while keeping the calculated positions
  const VISUAL_SCALE_FACTOR = 0.85; // Products will visually be 85% of their calculated size
  
  // Calculate scaled dimensions for visual representation only
  const visualWidth = product.width * VISUAL_SCALE_FACTOR;
  const visualHeight = product.height * VISUAL_SCALE_FACTOR;
  const visualDepth = product.depth * VISUAL_SCALE_FACTOR;
  
  return (
    <mesh 
      ref={mesh} 
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[visualWidth, visualHeight, visualDepth]} />
      <meshStandardMaterial 
        color={product.color || '#8B4513'} 
        opacity={0.9}
        transparent={true}
      />
      
      {/* Add hover tooltip to identify products */}
      <Html
        position={[0, visualHeight / 2 + 0.1, 0]}
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '2px 5px',
          borderRadius: '3px',
          color: 'white',
          fontSize: '8px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)'
        }}
        className="product-label"
      >
        {product.name}
      </Html>
    </mesh>
  );
};

export default ProductMesh;

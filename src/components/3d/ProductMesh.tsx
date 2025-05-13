
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductMeshProps } from '@/types/3d';
import { Html } from '@react-three/drei';

const ProductMesh: React.FC<ProductMeshProps> = ({ product, position }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh 
      ref={mesh} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[product.width, product.height, product.depth]} />
      <meshStandardMaterial 
        color={product.color || '#8B4513'} 
        opacity={0.9}
        transparent={true}
      />
      
      {/* Add hover tooltip to identify products */}
      <Html
        position={[0, product.height / 2 + 0.1, 0]}
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

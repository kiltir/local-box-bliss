
import React, { useRef } from 'react';
import * as THREE from 'three';
import { ProductMeshProps } from '@/types/3d';
import { Html } from '@react-three/drei';

const ProductMesh: React.FC<ProductMeshProps> = ({ product, position }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[product.width, product.height, product.depth]} />
      <meshStandardMaterial color={product.color || '#8B4513'} />
      {/* Add hover tooltip to identify products */}
      <Html
        position={[0, product.height / 2 + 0.1, 0]}
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '2px 5px',
          borderRadius: '3px',
          color: 'white',
          fontSize: '8px',
          opacity: 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          display: 'none'
        }}
        className="product-label"
      >
        {product.name}
      </Html>
    </mesh>
  );
};

export default ProductMesh;

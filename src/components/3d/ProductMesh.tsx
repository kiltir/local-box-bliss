
import React, { useRef } from 'react';
import * as THREE from 'three';
import { ProductMeshProps } from '@/types/3d';

const ProductMesh: React.FC<ProductMeshProps> = ({ product, position }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[product.width, product.height, product.depth]} />
      <meshStandardMaterial color={product.color || '#8B4513'} />
    </mesh>
  );
};

export default ProductMesh;


import React, { useRef } from 'react';
import * as THREE from 'three';
import { Box3DProps } from '@/types/3d';

const Box3D: React.FC<Box3DProps> = ({ dimensions, wireframe = false, color = '#f5eada' }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial color={color} wireframe={wireframe} transparent opacity={wireframe ? 1 : 0.2} />
    </mesh>
  );
};

export default Box3D;

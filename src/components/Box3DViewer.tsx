
import React from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Box3DViewerProps } from '@/types/3d';
import Scene from './3d/Scene';

// Extend the JSX namespace with Three.js components
extend({ 
  Mesh: THREE.Mesh, 
  BoxGeometry: THREE.BoxGeometry, 
  MeshStandardMaterial: THREE.MeshStandardMaterial 
});

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


import React from 'react';
import { Grid } from '@react-three/drei';
import { SideGridProps } from '@/types/3d';

const SideGrid: React.FC<SideGridProps> = ({ size, rotation, position }) => {
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

export default SideGrid;

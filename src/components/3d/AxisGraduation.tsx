
import React from 'react';
import { Text } from '@react-three/drei';

interface AxisGraduationProps {
  boxDimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

const AxisGraduation: React.FC<AxisGraduationProps> = ({ boxDimensions }) => {
  const { width, height, depth } = boxDimensions;
  
  // Fonction pour créer les graduations d'un axe
  const createGraduations = (length: number, axis: 'x' | 'y' | 'z') => {
    const graduations = [];
    const step = Math.max(1, Math.ceil(length / 10)); // Graduations tous les cm ou plus selon la taille
    
    for (let i = 0; i <= length; i += step) {
      let position: [number, number, number];
      let rotation: [number, number, number] = [0, 0, 0];
      
      switch (axis) {
        case 'x': // Largeur (L)
          position = [i - length/2, -height/2 - 1, depth/2 + 1];
          break;
        case 'y': // Hauteur (H)
          position = [-width/2 - 1, i - height/2, depth/2 + 1];
          rotation = [0, 0, Math.PI/2];
          break;
        case 'z': // Profondeur (P)
          position = [width/2 + 1, -height/2 - 1, i - depth/2];
          rotation = [0, Math.PI/2, 0];
          break;
        default:
          position = [0, 0, 0];
      }
      
      graduations.push(
        <group key={`${axis}-${i}`}>
          {/* Marque de graduation */}
          <mesh position={position}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          
          {/* Texte de la graduation */}
          <Text
            position={[
              position[0] + (axis === 'y' ? -0.5 : 0),
              position[1] + (axis === 'x' ? -0.3 : axis === 'z' ? -0.3 : 0),
              position[2] + (axis === 'z' ? -0.5 : 0)
            ]}
            rotation={rotation}
            fontSize={0.3}
            color="#333"
            anchorX="center"
            anchorY="middle"
          >
            {i}
          </Text>
        </group>
      );
    }
    
    return graduations;
  };
  
  // Créer les lignes d'axes avec des cylindres
  const createAxisLine = (start: [number, number, number], end: [number, number, number], axis: 'x' | 'y' | 'z') => {
    const length = Math.sqrt(
      Math.pow(end[0] - start[0], 2) + 
      Math.pow(end[1] - start[1], 2) + 
      Math.pow(end[2] - start[2], 2)
    );
    
    const midpoint: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    ];
    
    let rotation: [number, number, number] = [0, 0, 0];
    switch (axis) {
      case 'x':
        rotation = [0, 0, Math.PI/2];
        break;
      case 'y':
        rotation = [0, 0, 0];
        break;
      case 'z':
        rotation = [Math.PI/2, 0, 0];
        break;
    }
    
    return (
      <mesh position={midpoint} rotation={rotation}>
        <cylinderGeometry args={[0.02, 0.02, length, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    );
  };
  
  return (
    <group>
      {/* Axe X (Largeur - L) */}
      {createAxisLine(
        [-width/2, -height/2 - 1, depth/2 + 1],
        [width/2, -height/2 - 1, depth/2 + 1],
        'x'
      )}
      {createGraduations(width, 'x')}
      
      {/* Label axe X */}
      <Text
        position={[0, -height/2 - 2, depth/2 + 1]}
        fontSize={0.4}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        L (cm)
      </Text>
      
      {/* Axe Y (Hauteur - H) */}
      {createAxisLine(
        [-width/2 - 1, -height/2, depth/2 + 1],
        [-width/2 - 1, height/2, depth/2 + 1],
        'y'
      )}
      {createGraduations(height, 'y')}
      
      {/* Label axe Y */}
      <Text
        position={[-width/2 - 2, 0, depth/2 + 1]}
        rotation={[0, 0, Math.PI/2]}
        fontSize={0.4}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        H (cm)
      </Text>
      
      {/* Axe Z (Profondeur - P) */}
      {createAxisLine(
        [width/2 + 1, -height/2 - 1, -depth/2],
        [width/2 + 1, -height/2 - 1, depth/2],
        'z'
      )}
      {createGraduations(depth, 'z')}
      
      {/* Label axe Z */}
      <Text
        position={[width/2 + 1, -height/2 - 2, 0]}
        rotation={[0, Math.PI/2, 0]}
        fontSize={0.4}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        P (cm)
      </Text>
    </group>
  );
};

export default AxisGraduation;

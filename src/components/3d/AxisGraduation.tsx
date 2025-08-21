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
  
  // Fonction pour créer les graduations d'un axe avec des intervalles uniformes de 1 cm
  const createGraduations = (length: number, axis: 'x' | 'y' | 'z') => {
    const graduations = [];
    
    // Graduations tous les 1 cm pour tous les axes
    const step = 1;
    
    for (let i = 0; i <= length; i += step) {
      let position: [number, number, number];
      let rotation: [number, number, number] = [0, 0, 0];
      
      switch (axis) {
        case 'x': // Largeur (L) - à partir du point A, AB = 30 cm
          position = [-width/2 + i, -height/2 - 1, depth/2 + 1];
          break;
        case 'y': // Hauteur (H) - à partir du point A, AE = 18 cm
          position = [-width/2 - 1, -height/2 + i, depth/2 + 1];
          rotation = [0, 0, Math.PI/2];
          break;
        case 'z': // Profondeur (P) - à partir du point A, AD = 8 cm
          position = [-width/2 - 1, -height/2 - 1, depth/2 - i];
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
          
          {/* Texte de la graduation - afficher seulement les valeurs importantes */}
          {(i % 5 === 0 || i === length) && (
            <Text
              position={[
                position[0] + (axis === 'y' ? -0.5 : 0),
                position[1] + (axis === 'x' ? -0.3 : axis === 'z' ? -0.3 : 0),
                position[2] + (axis === 'z' ? -0.5 : 0)
              ]}
              rotation={rotation}
              fontSize={0.25}
              color="#333"
              anchorX="center"
              anchorY="middle"
            >
              {i}
            </Text>
          )}
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

  // Fonction pour créer les labels des sommets de la box
  const createBoxVertexLabels = () => {
    const vertices = [
      // Face avant (bottom) - A est maintenant le point de référence (0,0,0)
      { label: 'A', position: [-width/2, -height/2, depth/2] as [number, number, number] },
      { label: 'B', position: [width/2, -height/2, depth/2] as [number, number, number] },
      { label: 'C', position: [width/2, -height/2, -depth/2] as [number, number, number] },
      { label: 'D', position: [-width/2, -height/2, -depth/2] as [number, number, number] },
      // Face avant (top)
      { label: 'E', position: [-width/2, height/2, depth/2] as [number, number, number] },
      { label: 'F', position: [width/2, height/2, depth/2] as [number, number, number] },
      { label: 'G', position: [width/2, height/2, -depth/2] as [number, number, number] },
      { label: 'H', position: [-width/2, height/2, -depth/2] as [number, number, number] },
    ];

    return vertices.map(vertex => (
      <group key={vertex.label}>
        {/* Point visible pour marquer le sommet */}
        <mesh position={vertex.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        
        {/* Label du sommet */}
        <Text
          position={[
            vertex.position[0] + (vertex.position[0] > 0 ? 0.3 : -0.3),
            vertex.position[1] + (vertex.position[1] > 0 ? 0.3 : -0.3),
            vertex.position[2] + (vertex.position[2] > 0 ? 0.3 : -0.3)
          ]}
          fontSize={0.4}
          color="#ff0000"
          anchorX="center"
          anchorY="middle"
        >
          {vertex.label}
        </Text>
      </group>
    ));
  };
  
  return (
    <group>
      {/* Labels des sommets de la box */}
      {createBoxVertexLabels()}
      
      {/* Axe X (Largeur - L) - commence au point A, AB = 30 cm */}
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
        AB = {width} cm
      </Text>
      
      {/* Axe Y (Hauteur - H) - commence au point A, AE = 18 cm */}
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
        AE = {height} cm
      </Text>
      
      {/* Axe Z (Profondeur - P) - commence au point A, AD = 8 cm */}
      {createAxisLine(
        [-width/2 - 1, -height/2 - 1, depth/2],
        [-width/2 - 1, -height/2 - 1, -depth/2],
        'z'
      )}
      {createGraduations(depth, 'z')}
      
      {/* Label axe Z */}
      <Text
        position={[-width/2 - 2, -height/2 - 2, 0]}
        rotation={[0, Math.PI/2, 0]}
        fontSize={0.4}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        AD = {depth} cm
      </Text>
    </group>
  );
};

export default AxisGraduation;

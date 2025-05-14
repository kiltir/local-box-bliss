
export interface Product {
  id: number;
  name: string;
  width: number;
  height: number;
  depth: number;
  color?: string;
  // Spaced dimensions for packing algorithm
  spacedWidth?: number;
  spacedHeight?: number;
  spacedDepth?: number;
  // Rotation information
  rx?: number;
  ry?: number;
  rz?: number;
}

export interface Box3DViewerProps {
  products: Product[];
  boxSize: 'small' | 'medium' | 'large';
  boxDimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface SceneProps {
  products: Product[];
  boxDimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface Box3DProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  wireframe?: boolean;
  color?: string;
}

export interface SideGridProps {
  size: number;
  rotation: [number, number, number];
  position: [number, number, number];
}

export interface ProductMeshProps {
  product: Product;
  position: [number, number, number];
  rotation?: [number, number, number];
}


import { Product } from '@/types/3d';

export interface PackingResult {
  productPositions: [number, number, number][];
  productRotations: [number, number, number][];
  scaledProducts: Product[];
  scaledBox: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface GridPosition {
  x: number;
  y: number;
  z: number;
}

export interface GridSize {
  x: number;
  y: number;
  z: number;
}

export interface ScaledBox {
  width: number;
  height: number;
  depth: number;
}

export interface ProductOrientation {
  width: number;
  height: number;
  depth: number;
  rx: number;
  ry: number;
  rz: number;
}

export interface PlacementResult {
  placed: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  gridPosition: [number, number, number];
}

export interface FallbackResult {
  position: [number, number, number];
  rotation: [number, number, number];
  gridPosition: [number, number, number];
}

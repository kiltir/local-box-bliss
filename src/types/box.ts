
export type BoxSize = 'small' | 'medium' | 'large';
export type BoxTheme = 'Découverte' | 'Bourbon' | 'Tradition' | 'Saison';

export interface Product {
  id: number;
  name: string;
  width: number;   // Largeur en cm
  height: number;  // Hauteur en cm
  depth: number;   // Profondeur en cm
  color?: string;  // Couleur pour la visualisation 3D
}

export interface BoxData {
  size: BoxSize;
  theme: BoxTheme;
  title: string;
  price: number;
  description: string;
  items: number;
  image: string;
}

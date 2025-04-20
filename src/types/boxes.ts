import { BoxSize, BoxTheme } from './box';

export interface BoxProductDimensions {
  width: number;   // Largeur en cm
  height: number;  // Hauteur en cm
  depth: number;   // Profondeur en cm
}

export interface BoxProduct {
  name: string;
  quantity: string;
  producer: string;
  dimensions?: BoxProductDimensions;
}

export interface BoxThemeData {
  description?: string;
  image?: string;
  products?: BoxProduct[];
}

export interface BoxData {
  id: number;
  baseTitle: string;
  price: number;
  description: string;
  image: string;
  items: number;
  size: BoxSize;
  products: BoxProduct[];
  themes: {
    [key in BoxTheme]: BoxThemeData;
  };
}

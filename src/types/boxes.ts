
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
  weight?: number; // Poids en kg
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
  weightLimit: number; // Limite de poids en kg
  theme: BoxTheme; // Thème principal de la box
  products: BoxProduct[];
}

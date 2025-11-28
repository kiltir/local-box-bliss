
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
  description?: string; // Description du produit (affichée à la place du producteur si présente)
  dimensions?: BoxProductDimensions;
  weight?: number; // Poids en kg
  image?: string; // Chemin vers l'image du produit
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
  images?: string[]; // Tableau d'images pour le carrousel
  items: number;
  size: BoxSize;
  weightLimit: number; // Limite de poids en kg
  theme: BoxTheme; // Thème principal de la box
  products: BoxProduct[];
  rating: number; // Note sur 5 étoiles
  reviewCount?: number; // Nombre d'avis (optionnel)
}

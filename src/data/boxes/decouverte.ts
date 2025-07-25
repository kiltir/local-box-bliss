
import { BoxData } from '@/types/boxes';

export const decouverteBox: BoxData = {
  id: 1,
  baseTitle: "Box Découverte",
  price: 24.99,
  description: "Une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs authentiques de La Réunion.",
  image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
  items: 5,
  size: 'unique',
  weightLimit: 4,
  theme: 'Découverte',
  products: [
    { 
      name: "Tablette de chocolat péi", 
      quantity: "100g", 
      producer: "Chocolaterie Artisanale",
      dimensions: { width: 16, height: 2, depth: 8 },
      weight: 0.1
    },
    { 
      name: "Sachet de thé lontan", 
      quantity: "50g", 
      producer: "Maison du Thé",
      dimensions: { width: 12, height: 8, depth: 3 },
      weight: 0.05
    },
    { 
      name: "Pot de miel de letchis", 
      quantity: "200g", 
      producer: "Le Rucher Créole",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25
    },
    { 
      name: "Confiture de goyave", 
      quantity: "200g", 
      producer: "Les Délices du Jardin",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25
    },
    { 
      name: "Bonbons coco", 
      quantity: "150g", 
      producer: "Confiserie Péi",
      dimensions: { width: 10, height: 3, depth: 6 },
      weight: 0.15
    }
  ]
};

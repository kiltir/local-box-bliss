
import { BoxData } from '@/types/boxes';

export const decouverteBox: BoxData = {
  id: 1,
  baseTitle: "Box Découverte",
  price: 79.99,
  description: "Une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs authentiques de La Réunion.",
  image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
  images: [
    "https://source.unsplash.com/1618160702438-9b02ab6515c9",
    "/lovable-uploads/22c73fc8-f3d1-4290-8d99-f0bd76e3ea8f.png",
    "/lovable-uploads/1e5534c0-a5e1-4153-829c-02324011758e.png"
  ],
  items: 4,
  size: 'unique',
  weightLimit: 4,
  theme: 'Découverte',
  rating: 4.5,
  reviewCount: 23,
  products: [
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
    },
    { 
      name: "3 huiles essentielles", 
      quantity: "30ml", 
      producer: "Essence péi",
      dimensions: { width: 3, height: 10, depth: 6 },
      weight: 0.4
    }
  ]
};

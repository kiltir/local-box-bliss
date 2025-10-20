
import { BoxData } from '@/types/boxes';

export const bourbonBox: BoxData = {
  id: 2,
  baseTitle: "Box Bourbon",
  price: 129.99,
  description: "Une sélection raffinée pour vous offrir l'expérience de parfums et saveurs \"lontan\" avec des produits d'exception.",
  image: "/lovable-uploads/dfae2a49-8682-4e2d-b364-efe22d218a5e.png",
  images: [
    "/lovable-uploads/dfae2a49-8682-4e2d-b364-efe22d218a5e.png",
    "/lovable-uploads/22c73fc8-f3d1-4290-8d99-f0bd76e3ea8f.png",
    "/lovable-uploads/1e5534c0-a5e1-4153-829c-02324011758e.png"
  ],
  items: 5,
  size: 'unique',
  weightLimit: 4,
  theme: 'Bourbon',
  rating: 4.8,
  reviewCount: 15,
  products: [
    { 
      name: "Bocal baies roses", 
      quantity: "25g", 
      producer: "Epicerie péi",
      dimensions: { width: 11, height: 5, depth: 5 },
      weight: 0.025
    },
    { 
      name: "3 gousses de vanille Bourbon", 
      quantity: "3 gousses", 
      producer: "Vanille de Bourbon",
      dimensions: { width: 15, height: 1, depth: 1 },
      weight: 0.02
    },
    { 
      name: "Tablette de chocolat Bourbon", 
      quantity: "100g", 
      producer: "Chocolaterie Artisanale",
      dimensions: { width: 15, height: 1, depth: 8 },
      weight: 0.1
    },
    { 
      name: "Café de Bourbon", 
      quantity: "250g", 
      producer: "Plantation de Bourbon",
      dimensions: { width: 8, height: 12, depth: 6 },
      weight: 0.25
    },
    { 
      name: "Bière artisanale", 
      quantity: "33cl", 
      producer: "Brasserie Locale",
      dimensions: { width: 6, height: 18, depth: 6 },
      weight: 0.4
    }
  ]
};

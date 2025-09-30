
import { BoxData } from '@/types/boxes';

export const traditionBox: BoxData = {
  id: 3,
  baseTitle: "Box Racine",
  price: 69.90,
  description: "Des produits authentiques issus de recettes traditionnelles créoles transmises de génération en génération.",
  image: "https://source.unsplash.com/472396961693-142e6e269027",
  images: [
    "https://source.unsplash.com/472396961693-142e6e269027",
    "/lovable-uploads/22c73fc8-f3d1-4290-8d99-f0bd76e3ea8f.png",
    "/lovable-uploads/1e5534c0-a5e1-4153-829c-02324011758e.png"
  ],
  items: 4,
  size: 'unique',
  weightLimit: 4,
  theme: 'Racine',
  rating: 4.2,
  reviewCount: 31,
  products: [
    { 
      name: "Miel de baies roses", 
      quantity: "200g", 
      producer: "Le Rucher Créole",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25
    },
    { 
      name: "Rhum arrangé miniature", 
      quantity: "50ml", 
      producer: "Distillerie Créole",
      dimensions: { width: 4, height: 12, depth: 4 },
      weight: 0.08
    },
    { 
      name: "Tisane de plantes péi", 
      quantity: "60g", 
      producer: "Herboristerie Créole",
      dimensions: { width: 12, height: 8, depth: 3 },
      weight: 0.06
    },
    { 
      name: "Piment péi", 
      quantity: "200g", 
      producer: "Verger Payet",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.2
    }
  ]
};

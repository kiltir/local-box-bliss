
import { BoxData } from '@/types/boxes';

export const traditionBox: BoxData = {
  id: 3,
  baseTitle: "Box Tradition",
  price: 27.99,
  description: "Des produits authentiques issus de recettes traditionnelles créoles transmises de génération en génération.",
  image: "https://source.unsplash.com/472396961693-142e6e269027",
  items: 6,
  size: 'unique',
  weightLimit: 4,
  theme: 'Tradition',
  products: [
    { 
      name: "Nougat lontan", 
      quantity: "150g", 
      producer: "Confiserie Péi",
      dimensions: { width: 15, height: 2, depth: 8 },
      weight: 0.15
    },
    { 
      name: "Bonbons piment", 
      quantity: "100g", 
      producer: "Confiserie Péi",
      dimensions: { width: 10, height: 3, depth: 6 },
      weight: 0.1
    },
    { 
      name: "Miel de baies roses", 
      quantity: "200g", 
      producer: "Le Rucher Créole",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25
    },
    { 
      name: "Croquants coco", 
      quantity: "120g", 
      producer: "Boulangerie Traditionnelle",
      dimensions: { width: 12, height: 3, depth: 8 },
      weight: 0.12
    },
    { 
      name: "Confiture de combava", 
      quantity: "180g", 
      producer: "Les Délices du Jardin",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.22
    },
    { 
      name: "Rhum arrangé miniature", 
      quantity: "50ml", 
      producer: "Distillerie Créole",
      dimensions: { width: 4, height: 12, depth: 4 },
      weight: 0.08
    }
  ]
};

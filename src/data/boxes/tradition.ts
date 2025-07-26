
import { BoxData } from '@/types/boxes';

export const traditionBox: BoxData = {
  id: 3,
  baseTitle: "Box Tradition",
  price: 27.99,
  description: "Des produits authentiques issus de recettes traditionnelles créoles transmises de génération en génération.",
  image: "https://source.unsplash.com/472396961693-142e6e269027",
  items: 3,
  size: 'unique',
  weightLimit: 4,
  theme: 'Tradition',
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
    }
  ]
};

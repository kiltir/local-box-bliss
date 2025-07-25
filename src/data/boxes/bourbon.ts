
import { BoxData } from '@/types/boxes';

export const bourbonBox: BoxData = {
  id: 2,
  baseTitle: "Box Bourbon",
  price: 29.99,
  description: "Une sélection raffinée pour accompagner vos spiritueux préférés avec des produits locaux authentiques.",
  image: "https://source.unsplash.com/493962853295-0fd70327578a",
  items: 6,
  size: 'unique',
  weightLimit: 4,
  theme: 'Bourbon',
  products: [
    { 
      name: "Chocolats assortis péi", 
      quantity: "120g", 
      producer: "Chocolaterie Artisanale",
      dimensions: { width: 12, height: 3, depth: 8 },
      weight: 0.12
    },
    { 
      name: "Amandes grillées", 
      quantity: "100g", 
      producer: "Les Délices du Jardin",
      dimensions: { width: 8, height: 4, depth: 5 },
      weight: 0.1
    },
    { 
      name: "Crackers aux épices", 
      quantity: "80g", 
      producer: "Boulangerie Traditionnelle",
      dimensions: { width: 12, height: 2, depth: 8 },
      weight: 0.08
    },
    { 
      name: "Olives marinées", 
      quantity: "150g", 
      producer: "L'Olivier Créole",
      dimensions: { width: 8, height: 6, depth: 6 },
      weight: 0.18
    },
    { 
      name: "Piment confit", 
      quantity: "100g", 
      producer: "Épices Bourbon",
      dimensions: { width: 6, height: 8, depth: 6 },
      weight: 0.12
    },
    { 
      name: "Cacahuètes au curry", 
      quantity: "120g", 
      producer: "Apéritif Péi",
      dimensions: { width: 10, height: 4, depth: 6 },
      weight: 0.12
    }
  ]
};

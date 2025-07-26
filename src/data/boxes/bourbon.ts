
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
      name: "Piment confit", 
      quantity: "100g", 
      producer: "Épices Bourbon",
      dimensions: { width: 6, height: 8, depth: 6 },
      weight: 0.12
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

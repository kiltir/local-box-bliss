
import { BoxData } from '@/types/boxes';

export const smallBox: BoxData = {
  id: 1,
  baseTitle: "Petite Box",
  price: 19.99,
  description: "La box idéale pour une personne, contenant une sélection de produits artisanaux de qualité.",
  image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
  items: 4,
  size: 'small',
  weightLimit: 3, // 3kg max
  products: [
    { 
      name: "Tablette de chocolat", 
      quantity: "100g", 
      producer: "Chocolaterie Artisanale",
      dimensions: { width: 16, height: 2, depth: 8 },
      weight: 0.1
    },
    { 
      name: "Sachet de thé Earl Grey", 
      quantity: "50g", 
      producer: "Maison du Thé",
      dimensions: { width: 20, height: 15, depth: 5 },
      weight: 0.05
    },
    { 
      name: "Pot de miel", 
      quantity: "250g", 
      producer: "Le Rucher de Jean",
      dimensions: { width: 8, height: 9, depth: 8 },
      weight: 0.35 // Including container
    },
    { 
      name: "Confiture d'abricot", 
      quantity: "250g", 
      producer: "Les Délices du Verger",
      dimensions: { width: 8, height: 9, depth: 8 },
      weight: 0.35 // Including jar
    }
  ],
  themes: {
    'Découverte': {
      description: "Une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs.",
      image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
      products: [
        { name: "Tablette de chocolat", quantity: "100g", producer: "Chocolaterie Artisanale", weight: 0.1, dimensions: { width: 16, height: 2, depth: 8 } },
        { name: "Sachet de thé Earl Grey", quantity: "50g", producer: "Maison du Thé", weight: 0.05, dimensions: { width: 20, height: 15, depth: 5 } },
        { name: "Pot de miel", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35, dimensions: { width: 8, height: 9, depth: 8 } },
        { name: "Confiture d'abricot", quantity: "250g", producer: "Les Délices du Verger", weight: 0.35, dimensions: { width: 8, height: 9, depth: 8 } }
      ]
    },
    'Bourbon': {
      description: "Une sélection raffinée pour accompagner vos spiritueux préférés.",
      image: "https://source.unsplash.com/493962853295-0fd70327578a",
      products: [
        { name: "Chocolats assortis", quantity: "150g", producer: "Chocolaterie Artisanale", weight: 0.15, dimensions: { width: 12, height: 3, depth: 12 } },
        { name: "Amandes grillées", quantity: "100g", producer: "Les Délices du Verger", weight: 0.1, dimensions: { width: 10, height: 5, depth: 5 } },
        { name: "Crackers aux noix", quantity: "100g", producer: "Boulangerie Traditionnelle", weight: 0.1, dimensions: { width: 15, height: 3, depth: 15 } },
        { name: "Olives marinées", quantity: "150g", producer: "L'Olivier Gourmet", weight: 0.2, dimensions: { width: 8, height: 8, depth: 8 } }
      ]
    },
    'Tradition': {
      description: "Des produits authentiques issus de recettes traditionnelles.",
      image: "https://source.unsplash.com/472396961693-142e6e269027",
      products: [
        { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2, dimensions: { width: 20, height: 2, depth: 10 } },
        { name: "Calissons", quantity: "150g", producer: "Confiserie du Sud", weight: 0.15, dimensions: { width: 15, height: 3, depth: 10 } },
        { name: "Miel de lavande", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35, dimensions: { width: 8, height: 9, depth: 8 } },
        { name: "Croquants aux amandes", quantity: "150g", producer: "Boulangerie Traditionnelle", weight: 0.15, dimensions: { width: 18, height: 3, depth: 8 } }
      ]
    },
    'Saison': {
      description: "Une sélection de produits adaptée à chaque saison.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      products: [
        { name: "Thé de saison", quantity: "100g", producer: "Maison du Thé", weight: 0.1, dimensions: { width: 10, height: 15, depth: 5 } },
        { name: "Biscuits spéciaux", quantity: "200g", producer: "Boulangerie Traditionnelle", weight: 0.2, dimensions: { width: 15, height: 3, depth: 15 } },
        { name: "Miel de saison", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35, dimensions: { width: 8, height: 9, depth: 8 } },
        { name: "Confiture de saison", quantity: "250g", producer: "Les Délices du Verger", weight: 0.35, dimensions: { width: 8, height: 9, depth: 8 } }
      ]
    }
  }
};


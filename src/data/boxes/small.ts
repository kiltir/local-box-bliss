
import { BoxData } from '@/types/boxes';

export const smallBox: BoxData = {
  id: 1,
  baseTitle: "Petite Box",
  price: 19.99,
  description: "La box idéale pour une personne, contenant une sélection de produits artisanaux de qualité.",
  image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
  items: 7,
  size: 'small',
  weightLimit: 3, // 3kg max
  products: [
    { 
      name: "Tablette de chocolat noir", 
      quantity: "100g", 
      producer: "Chocolaterie Artisanale",
      dimensions: { width: 8, height: 2, depth: 16 },
      weight: 0.1
    },
    { 
      name: "Sachet de thé Earl Grey", 
      quantity: "50g", 
      producer: "Maison du Thé",
      dimensions: { width: 8, height: 12, depth: 4 },
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
      name: "Sachet de biscuits", 
      quantity: "200g", 
      producer: "Boulangerie Traditionnelle",
      dimensions: { width: 20, height: 5, depth: 15 },
      weight: 0.2
    },
    { 
      name: "Confiture d'abricot", 
      quantity: "250g", 
      producer: "Les Délices du Verger",
      dimensions: { width: 7, height: 10, depth: 7 },
      weight: 0.35 // Including jar
    },
    { 
      name: "Nougat traditionnel", 
      quantity: "100g", 
      producer: "Confiserie du Sud",
      dimensions: { width: 15, height: 2, depth: 5 },
      weight: 0.1
    },
    { 
      name: "Pâtes de fruits", 
      quantity: "150g", 
      producer: "Les Délices du Verger",
      dimensions: { width: 10, height: 3, depth: 15 },
      weight: 0.15
    }
  ],
  themes: {
    'Découverte': {
      description: "Une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs.",
      image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
      products: [
        { name: "Tablette de chocolat noir", quantity: "100g", producer: "Chocolaterie Artisanale", weight: 0.1 },
        { name: "Sachet de thé Earl Grey", quantity: "50g", producer: "Maison du Thé", weight: 0.05 },
        { name: "Pot de miel", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35 },
        { name: "Sachet de biscuits", quantity: "200g", producer: "Boulangerie Traditionnelle", weight: 0.2 },
        { name: "Confiture d'abricot", quantity: "250g", producer: "Les Délices du Verger", weight: 0.35 },
        { name: "Nougat traditionnel", quantity: "100g", producer: "Confiserie du Sud", weight: 0.1 },
        { name: "Pâtes de fruits", quantity: "150g", producer: "Les Délices du Verger", weight: 0.15 }
      ]
    },
    'Bourbon': {
      description: "Une sélection raffinée pour accompagner vos spiritueux préférés.",
      image: "https://source.unsplash.com/493962853295-0fd70327578a",
      products: [
        { name: "Chocolats assortis", quantity: "150g", producer: "Chocolaterie Artisanale", weight: 0.15 },
        { name: "Amandes grillées", quantity: "100g", producer: "Les Délices du Verger", weight: 0.1 },
        { name: "Crackers aux noix", quantity: "100g", producer: "Boulangerie Traditionnelle", weight: 0.1 },
        { name: "Olives marinées", quantity: "150g", producer: "L'Olivier Gourmet", weight: 0.2 },
        { name: "Miel de châtaignier", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35 },
        { name: "Tapenade", quantity: "100g", producer: "L'Olivier Gourmet", weight: 0.15 },
        { name: "Biscuits salés", quantity: "120g", producer: "Boulangerie Traditionnelle", weight: 0.12 }
      ]
    },
    'Tradition': {
      description: "Des produits authentiques issus de recettes traditionnelles.",
      image: "https://source.unsplash.com/472396961693-142e6e269027",
      products: [
        { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
        { name: "Calissons", quantity: "150g", producer: "Confiserie du Sud", weight: 0.15 },
        { name: "Miel de lavande", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35 },
        { name: "Croquants aux amandes", quantity: "150g", producer: "Boulangerie Traditionnelle", weight: 0.15 },
        { name: "Sirop de violette", quantity: "25cl", producer: "Les Délices du Verger", weight: 0.4 },
        { name: "Navettes provençales", quantity: "200g", producer: "Boulangerie Traditionnelle", weight: 0.2 },
        { name: "Pâte d'amande", quantity: "150g", producer: "Confiserie du Sud", weight: 0.15 }
      ]
    },
    'Saison': {
      description: "Une sélection de produits adaptée à chaque saison.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      products: [
        { name: "Thé de saison", quantity: "100g", producer: "Maison du Thé", weight: 0.1 },
        { name: "Biscuits spéciaux", quantity: "200g", producer: "Boulangerie Traditionnelle", weight: 0.2 },
        { name: "Miel de saison", quantity: "250g", producer: "Le Rucher de Jean", weight: 0.35 },
        { name: "Confiture de saison", quantity: "250g", producer: "Les Délices du Verger", weight: 0.35 },
        { name: "Chocolat spécial", quantity: "150g", producer: "Chocolaterie Artisanale", weight: 0.15 },
        { name: "Bonbons artisanaux", quantity: "150g", producer: "Confiserie du Sud", weight: 0.15 },
        { name: "Sirop de saison", quantity: "25cl", producer: "Les Délices du Verger", weight: 0.4 }
      ]
    }
  }
};


import { BoxData } from '@/types/boxes';

export const saisonBox: BoxData = {
  id: 4,
  baseTitle: "Box Saison",
  price: 26.99,
  description: "Une sélection de produits frais adaptés à la saison, mettant en valeur les fruits et légumes du moment.",
  image: "/lovable-uploads/ac03653a-7722-48c5-a6c8-0a25a453791b.png",
  items: 4,
  size: 'unique',
  weightLimit: 4,
  theme: 'Saison',
  rating: 4.6,
  reviewCount: 18,
  products: [
    { 
      name: "Thé de saison", 
      quantity: "80g", 
      producer: "Maison du Thé",
      dimensions: { width: 10, height: 10, depth: 4 },
      weight: 0.08
    },
    { 
      name: "Biscuits aux fruits du moment", 
      quantity: "150g", 
      producer: "Boulangerie Traditionnelle",
      dimensions: { width: 15, height: 3, depth: 8 },
      weight: 0.15
    },
    { 
      name: "Miel de fleurs de saison", 
      quantity: "200g", 
      producer: "Le Rucher Créole",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25
    },
    { 
      name: "Confiture de fruits de saison", 
      quantity: "200g", 
      producer: "Les Délices du Jardin",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25
    }
  ]
};


import { BoxData } from '@/types/boxes';
import theSaisonImg from '@/assets/products/saison/the-saison.png';
import biscuitsFruitsImg from '@/assets/products/saison/biscuits-fruits.png';
import mielFleursImg from '@/assets/products/saison/miel-fleurs.png';
import confitureSaisonImg from '@/assets/products/saison/confiture-saison.png';
import livretGuideImg from '@/assets/products/common/livret-guide.png';

export const saisonBox: BoxData = {
  id: 4,
  baseTitle: "Box Saison",
  price: 69.99,
  description: "Une sélection de produits de saison mettant en valeur les fruits et légumes du moment.",
  image: "/lovable-uploads/ac03653a-7722-48c5-a6c8-0a25a453791b.png",
  images: [
    "/lovable-uploads/kiltirbox-standard.jpg",
    "/lovable-uploads/22c73fc8-f3d1-4290-8d99-f0bd76e3ea8f.png",
    "/lovable-uploads/1e5534c0-a5e1-4153-829c-02324011758e.png"
  ],
  items: 5,
  size: 'unique',
  weightLimit: 2,
  theme: 'Saison',
  rating: 4.6,
  reviewCount: 18,
  products: [
    { 
      name: "Thé de saison", 
      quantity: "80g", 
      producer: "Maison du Thé",
      description: "Préparation pour une infusion savoureusement parfumée",
      dimensions: { width: 10, height: 10, depth: 4 },
      weight: 0.08,
      image: theSaisonImg
    },
    { 
      name: "Biscuits aux fruits", 
      quantity: "150g", 
      producer: "Boulangerie Traditionnelle",
      description: "Pour un moment gourmand à savourer et à partager",
      dimensions: { width: 15, height: 8, depth: 3 },
      weight: 0.15,
      image: biscuitsFruitsImg
    },
    { 
      name: "Miel de fleurs de saison", 
      quantity: "200g", 
      producer: "Le Rucher Créole",
      description: "Un miel de saison travaillé et récolté au cœur de ruches locales",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25,
      image: mielFleursImg
    },
    { 
      name: "Confiture de fruits de saison", 
      quantity: "200g", 
      producer: "Les Délices du Jardin",
      description: "Une confiture de saison artisanales et locales",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25,
      image: confitureSaisonImg
    },
    { 
      name: "Bonus Livret guide produits", 
      quantity: "1 livret", 
      producer: "Kiltir Box",
      description: "Un guide complet pour découvrir l'histoire et les conseils d'utilisation de chaque produit",
      dimensions: { width: 15, height: 21, depth: 1 },
      weight: 0.05,
      image: livretGuideImg
    }
  ]
};

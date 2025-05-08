
import { BoxData } from '@/types/boxes';

export const largeBox: BoxData = {
  id: 3,
  baseTitle: "Grande Box",
  price: 49.99,
  description: "Notre box la plus complète, idéale pour une famille ou pour un cadeau généreux. Une gamme étendue de produits d'épicerie fine.",
  image: "https://source.unsplash.com/1582562124811-c09040d0a901",
  items: 8,
  size: 'large',
  weightLimit: 6, // 6kg max
  products: [
    { name: "Collection de chocolats", quantity: "500g", producer: "Chocolaterie Artisanale", weight: 0.5 },
    { name: "Coffret dégustation de thés", quantity: "6x50g", producer: "Maison du Thé", weight: 0.4 },
    { name: "Grand pot de miel", quantity: "1kg", producer: "Le Rucher de Jean", weight: 1.2 },
    { name: "Assortiment de biscuits", quantity: "600g", producer: "Boulangerie Traditionnelle", weight: 0.6 },
    { name: "Trio de confitures", quantity: "3x250g", producer: "Les Délices du Verger", weight: 1.05 },
    { name: "Nougat assorti", quantity: "400g", producer: "Confiserie du Sud", weight: 0.4 },
    { name: "Calissons d'Aix", quantity: "400g", producer: "Confiserie du Sud", weight: 0.4 },
    { name: "Pâtes de fruits", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 }
  ],
  themes: {
    'Découverte': {
      description: "Notre sélection la plus complète de produits artisanaux pour découvrir un maximum de saveurs.",
      image: "https://source.unsplash.com/1582562124811-c09040d0a901",
      products: [
        { name: "Collection de chocolats", quantity: "500g", producer: "Chocolaterie Artisanale", weight: 0.5 },
        { name: "Coffret dégustation de thés", quantity: "6x50g", producer: "Maison du Thé", weight: 0.4 },
        { name: "Grand pot de miel", quantity: "1kg", producer: "Le Rucher de Jean", weight: 1.2 },
        { name: "Assortiment de biscuits", quantity: "600g", producer: "Boulangerie Traditionnelle", weight: 0.6 },
        { name: "Trio de confitures", quantity: "3x250g", producer: "Les Délices du Verger", weight: 1.05 },
        { name: "Nougat assorti", quantity: "400g", producer: "Confiserie du Sud", weight: 0.4 },
        { name: "Calissons d'Aix", quantity: "400g", producer: "Confiserie du Sud", weight: 0.4 },
        { name: "Pâtes de fruits", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 }
      ]
    },
    'Bourbon': {
      description: "Notre sélection premium pour les amateurs de spiritueux et de produits raffinés.",
      image: "https://source.unsplash.com/493962853295-0fd70327578a",
      products: [
        { name: "Chocolats fins assortis", quantity: "500g", producer: "Chocolaterie Artisanale", weight: 0.5 },
        { name: "Mélange de fruits secs", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 },
        { name: "Crackers premium", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
        { name: "Sélection d'olives", quantity: "500g", producer: "L'Olivier Gourmet", weight: 0.6 },
        { name: "Tapenades assorties", quantity: "3x150g", producer: "L'Olivier Gourmet", weight: 0.6 },
        { name: "Mélange apéritif deluxe", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 },
        { name: "Amandes caramélisées", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
        { name: "Chips de légumes", quantity: "3x100g", producer: "L'Olivier Gourmet", weight: 0.3 }
      ]
    },
    'Tradition': {
      description: "Notre collection complète de produits authentiques issus de recettes traditionnelles.",
      image: "https://source.unsplash.com/472396961693-142e6e269027",
      products: [
        { name: "Grand nougat traditionnel", quantity: "500g", producer: "Confiserie du Sud", weight: 0.5 },
        { name: "Calissons d'Aix", quantity: "400g", producer: "Confiserie du Sud", weight: 0.4 },
        { name: "Miel de Provence", quantity: "1kg", producer: "Le Rucher de Jean", weight: 1.2 },
        { name: "Biscuits traditionnels", quantity: "500g", producer: "Boulangerie Traditionnelle", weight: 0.5 },
        { name: "Pâte d'amande", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
        { name: "Fruits confits assortis", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 },
        { name: "Berlingots", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
        { name: "Sirops traditionnels", quantity: "3x25cl", producer: "Les Délices du Verger", weight: 1.2 }
      ]
    },
    'Saison': {
      description: "Notre meilleure sélection de produits de saison pour une expérience gastronomique complète.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      products: [
        { name: "Thés de saison", quantity: "5x50g", producer: "Maison du Thé", weight: 0.3 },
        { name: "Biscuits spéciaux", quantity: "500g", producer: "Boulangerie Traditionnelle", weight: 0.5 },
        { name: "Miel de saison", quantity: "1kg", producer: "Le Rucher de Jean", weight: 1.2 },
        { name: "Confitures de saison", quantity: "4x250g", producer: "Les Délices du Verger", weight: 1.4 },
        { name: "Chocolats spéciaux", quantity: "400g", producer: "Chocolaterie Artisanale", weight: 0.4 },
        { name: "Calissons parfumés", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
        { name: "Sirops de saison", quantity: "3x25cl", producer: "Les Délices du Verger", weight: 1.2 },
        { name: "Pâtes de fruits", quantity: "300g", producer: "Les Délices du Verger", weight: 0.3 }
      ]
    }
  }
};

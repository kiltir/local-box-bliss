
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
    { 
      name: "Collection de chocolats", 
      quantity: "500g", 
      producer: "Chocolaterie Artisanale", 
      weight: 0.5,
      dimensions: { width: 20, height: 4, depth: 25 }
    },
    { 
      name: "Coffret dégustation de thés", 
      quantity: "6x50g", 
      producer: "Maison du Thé", 
      weight: 0.4,
      dimensions: { width: 15, height: 8, depth: 25 }
    },
    { 
      name: "Grand pot de miel", 
      quantity: "1kg", 
      producer: "Le Rucher de Jean", 
      weight: 1.2,
      dimensions: { width: 10, height: 15, depth: 10 }
    },
    { 
      name: "Assortiment de biscuits", 
      quantity: "600g", 
      producer: "Boulangerie Traditionnelle", 
      weight: 0.6,
      dimensions: { width: 25, height: 5, depth: 30 }
    },
    { 
      name: "Trio de confitures", 
      quantity: "3x250g", 
      producer: "Les Délices du Verger", 
      weight: 1.05,
      dimensions: { width: 24, height: 10, depth: 8 }
    },
    { 
      name: "Nougat assorti", 
      quantity: "400g", 
      producer: "Confiserie du Sud", 
      weight: 0.4,
      dimensions: { width: 20, height: 3, depth: 15 }
    },
    { 
      name: "Calissons d'Aix", 
      quantity: "400g", 
      producer: "Confiserie du Sud", 
      weight: 0.4,
      dimensions: { width: 20, height: 3, depth: 15 }
    },
    { 
      name: "Pâtes de fruits", 
      quantity: "400g", 
      producer: "Les Délices du Verger", 
      weight: 0.4,
      dimensions: { width: 15, height: 3, depth: 15 }
    }
  ],
  themes: {
    'Découverte': {
      description: "Notre sélection la plus complète de produits artisanaux pour découvrir un maximum de saveurs.",
      image: "https://source.unsplash.com/1582562124811-c09040d0a901",
      products: [
        { 
          name: "Collection de chocolats", 
          quantity: "500g", 
          producer: "Chocolaterie Artisanale", 
          weight: 0.5,
          dimensions: { width: 20, height: 4, depth: 25 }
        },
        { 
          name: "Coffret dégustation de thés", 
          quantity: "6x50g", 
          producer: "Maison du Thé", 
          weight: 0.4,
          dimensions: { width: 15, height: 8, depth: 25 }
        },
        { 
          name: "Grand pot de miel", 
          quantity: "1kg", 
          producer: "Le Rucher de Jean", 
          weight: 1.2,
          dimensions: { width: 10, height: 15, depth: 10 }
        },
        { 
          name: "Assortiment de biscuits", 
          quantity: "600g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.6,
          dimensions: { width: 25, height: 5, depth: 30 }
        },
        { 
          name: "Trio de confitures", 
          quantity: "3x250g", 
          producer: "Les Délices du Verger", 
          weight: 1.05,
          dimensions: { width: 24, height: 10, depth: 8 }
        },
        { 
          name: "Nougat assorti", 
          quantity: "400g", 
          producer: "Confiserie du Sud", 
          weight: 0.4,
          dimensions: { width: 20, height: 3, depth: 15 }
        },
        { 
          name: "Calissons d'Aix", 
          quantity: "400g", 
          producer: "Confiserie du Sud", 
          weight: 0.4,
          dimensions: { width: 20, height: 3, depth: 15 }
        },
        { 
          name: "Pâtes de fruits", 
          quantity: "400g", 
          producer: "Les Délices du Verger", 
          weight: 0.4,
          dimensions: { width: 15, height: 3, depth: 15 }
        }
      ]
    },
    'Bourbon': {
      description: "Notre sélection premium pour les amateurs de spiritueux et de produits raffinés.",
      image: "https://source.unsplash.com/493962853295-0fd70327578a",
      products: [
        { 
          name: "Chocolats fins assortis", 
          quantity: "500g", 
          producer: "Chocolaterie Artisanale", 
          weight: 0.5,
          dimensions: { width: 20, height: 4, depth: 25 }
        },
        { 
          name: "Mélange de fruits secs", 
          quantity: "400g", 
          producer: "Les Délices du Verger", 
          weight: 0.4,
          dimensions: { width: 15, height: 5, depth: 15 }
        },
        { 
          name: "Crackers premium", 
          quantity: "300g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.3,
          dimensions: { width: 20, height: 3, depth: 25 }
        },
        { 
          name: "Sélection d'olives", 
          quantity: "500g", 
          producer: "L'Olivier Gourmet", 
          weight: 0.6,
          dimensions: { width: 12, height: 10, depth: 12 }
        },
        { 
          name: "Tapenades assorties", 
          quantity: "3x150g", 
          producer: "L'Olivier Gourmet", 
          weight: 0.6,
          dimensions: { width: 24, height: 5, depth: 8 }
        },
        { 
          name: "Mélange apéritif deluxe", 
          quantity: "400g", 
          producer: "Les Délices du Verger", 
          weight: 0.4,
          dimensions: { width: 15, height: 6, depth: 15 }
        },
        { 
          name: "Amandes caramélisées", 
          quantity: "300g", 
          producer: "Confiserie du Sud", 
          weight: 0.3,
          dimensions: { width: 15, height: 5, depth: 10 }
        },
        { 
          name: "Chips de légumes", 
          quantity: "3x100g", 
          producer: "L'Olivier Gourmet", 
          weight: 0.3,
          dimensions: { width: 15, height: 8, depth: 20 }
        }
      ]
    },
    'Tradition': {
      description: "Notre collection complète de produits authentiques issus de recettes traditionnelles.",
      image: "https://source.unsplash.com/472396961693-142e6e269027",
      products: [
        { 
          name: "Grand nougat traditionnel", 
          quantity: "500g", 
          producer: "Confiserie du Sud", 
          weight: 0.5,
          dimensions: { width: 25, height: 3, depth: 15 }
        },
        { 
          name: "Calissons d'Aix", 
          quantity: "400g", 
          producer: "Confiserie du Sud", 
          weight: 0.4,
          dimensions: { width: 20, height: 3, depth: 15 }
        },
        { 
          name: "Miel de Provence", 
          quantity: "1kg", 
          producer: "Le Rucher de Jean", 
          weight: 1.2,
          dimensions: { width: 10, height: 15, depth: 10 }
        },
        { 
          name: "Biscuits traditionnels", 
          quantity: "500g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.5,
          dimensions: { width: 20, height: 5, depth: 25 }
        },
        { 
          name: "Pâte d'amande", 
          quantity: "300g", 
          producer: "Confiserie du Sud", 
          weight: 0.3,
          dimensions: { width: 15, height: 3, depth: 10 }
        },
        { 
          name: "Fruits confits assortis", 
          quantity: "400g", 
          producer: "Les Délices du Verger", 
          weight: 0.4,
          dimensions: { width: 15, height: 5, depth: 15 }
        },
        { 
          name: "Berlingots", 
          quantity: "300g", 
          producer: "Confiserie du Sud", 
          weight: 0.3,
          dimensions: { width: 15, height: 5, depth: 10 }
        },
        { 
          name: "Sirops traditionnels", 
          quantity: "3x25cl", 
          producer: "Les Délices du Verger", 
          weight: 1.2,
          dimensions: { width: 20, height: 25, depth: 6 }
        }
      ]
    },
    'Saison': {
      description: "Notre meilleure sélection de produits de saison pour une expérience gastronomique complète.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      products: [
        { 
          name: "Thés de saison", 
          quantity: "5x50g", 
          producer: "Maison du Thé", 
          weight: 0.3,
          dimensions: { width: 25, height: 8, depth: 15 }
        },
        { 
          name: "Biscuits spéciaux", 
          quantity: "500g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.5,
          dimensions: { width: 20, height: 5, depth: 25 }
        },
        { 
          name: "Miel de saison", 
          quantity: "1kg", 
          producer: "Le Rucher de Jean", 
          weight: 1.2,
          dimensions: { width: 10, height: 15, depth: 10 }
        },
        { 
          name: "Confitures de saison", 
          quantity: "4x250g", 
          producer: "Les Délices du Verger", 
          weight: 1.4,
          dimensions: { width: 32, height: 10, depth: 8 }
        },
        { 
          name: "Chocolats spéciaux", 
          quantity: "400g", 
          producer: "Chocolaterie Artisanale", 
          weight: 0.4,
          dimensions: { width: 20, height: 4, depth: 15 }
        },
        { 
          name: "Calissons parfumés", 
          quantity: "300g", 
          producer: "Confiserie du Sud", 
          weight: 0.3,
          dimensions: { width: 15, height: 3, depth: 15 }
        },
        { 
          name: "Sirops de saison", 
          quantity: "3x25cl", 
          producer: "Les Délices du Verger", 
          weight: 1.2,
          dimensions: { width: 20, height: 25, depth: 6 }
        },
        { 
          name: "Pâtes de fruits", 
          quantity: "300g", 
          producer: "Les Délices du Verger", 
          weight: 0.3,
          dimensions: { width: 15, height: 3, depth: 15 }
        }
      ]
    }
  }
};

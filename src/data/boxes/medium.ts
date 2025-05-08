
import { BoxData } from '@/types/boxes';

export const mediumBox: BoxData = {
  id: 2,
  baseTitle: "Moyenne Box",
  price: 34.99,
  description: "Parfaite pour un couple ou pour offrir, cette box contient une variété plus large de produits artisanaux.",
  image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
  items: 6,
  size: 'medium',
  weightLimit: 4.5, // 4.5kg max
  products: [
    { 
      name: "Assortiment de chocolats", 
      quantity: "300g", 
      producer: "Chocolaterie Artisanale", 
      weight: 0.3,
      dimensions: { width: 15, height: 3, depth: 20 }
    },
    { 
      name: "Coffret de thés", 
      quantity: "4x50g", 
      producer: "Maison du Thé", 
      weight: 0.25,
      dimensions: { width: 10, height: 6, depth: 20 }
    },
    { 
      name: "Pot de miel", 
      quantity: "500g", 
      producer: "Le Rucher de Jean", 
      weight: 0.65,
      dimensions: { width: 8, height: 12, depth: 8 }
    },
    { 
      name: "Biscuits assortis", 
      quantity: "400g", 
      producer: "Boulangerie Traditionnelle", 
      weight: 0.4,
      dimensions: { width: 18, height: 4, depth: 25 }
    },
    { 
      name: "Duo de confitures", 
      quantity: "2x250g", 
      producer: "Les Délices du Verger", 
      weight: 0.7,
      dimensions: { width: 16, height: 10, depth: 8 }
    },
    { 
      name: "Nougat traditionnel", 
      quantity: "200g", 
      producer: "Confiserie du Sud", 
      weight: 0.2,
      dimensions: { width: 15, height: 2, depth: 8 }
    }
  ],
  themes: {
    'Découverte': {
      description: "Une sélection plus large de produits artisanaux pour découvrir de nouvelles saveurs.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      products: [
        { 
          name: "Assortiment de chocolats", 
          quantity: "300g", 
          producer: "Chocolaterie Artisanale", 
          weight: 0.3,
          dimensions: { width: 15, height: 3, depth: 20 }
        },
        { 
          name: "Coffret de thés", 
          quantity: "4x50g", 
          producer: "Maison du Thé", 
          weight: 0.25,
          dimensions: { width: 10, height: 6, depth: 20 }
        },
        { 
          name: "Pot de miel", 
          quantity: "500g", 
          producer: "Le Rucher de Jean", 
          weight: 0.65,
          dimensions: { width: 8, height: 12, depth: 8 }
        },
        { 
          name: "Biscuits assortis", 
          quantity: "400g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.4,
          dimensions: { width: 18, height: 4, depth: 25 }
        },
        { 
          name: "Duo de confitures", 
          quantity: "2x250g", 
          producer: "Les Délices du Verger", 
          weight: 0.7,
          dimensions: { width: 16, height: 10, depth: 8 }
        },
        { 
          name: "Nougat traditionnel", 
          quantity: "200g", 
          producer: "Confiserie du Sud", 
          weight: 0.2,
          dimensions: { width: 15, height: 2, depth: 8 }
        }
      ]
    },
    'Bourbon': {
      description: "Une sélection plus complète pour accompagner vos spiritueux préférés.",
      image: "https://source.unsplash.com/493962853295-0fd70327578a",
      products: [
        { 
          name: "Chocolats fins assortis", 
          quantity: "300g", 
          producer: "Chocolaterie Artisanale", 
          weight: 0.3,
          dimensions: { width: 15, height: 3, depth: 20 }
        },
        { 
          name: "Noix de cajou grillées", 
          quantity: "200g", 
          producer: "Les Délices du Verger", 
          weight: 0.2,
          dimensions: { width: 10, height: 5, depth: 15 }
        },
        { 
          name: "Amandes fumées", 
          quantity: "200g", 
          producer: "Les Délices du Verger", 
          weight: 0.2,
          dimensions: { width: 10, height: 5, depth: 15 }
        },
        { 
          name: "Crackers artisanaux", 
          quantity: "250g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.25,
          dimensions: { width: 15, height: 3, depth: 20 }
        },
        { 
          name: "Olives assorties", 
          quantity: "300g", 
          producer: "L'Olivier Gourmet", 
          weight: 0.4,
          dimensions: { width: 10, height: 8, depth: 10 }
        },
        { 
          name: "Tapenade verte", 
          quantity: "150g", 
          producer: "L'Olivier Gourmet", 
          weight: 0.2,
          dimensions: { width: 8, height: 6, depth: 8 }
        }
      ]
    },
    'Tradition': {
      description: "Une collection plus large de produits authentiques issus de recettes traditionnelles.",
      image: "https://source.unsplash.com/472396961693-142e6e269027",
      products: [
        { 
          name: "Nougat blanc et noir", 
          quantity: "300g", 
          producer: "Confiserie du Sud", 
          weight: 0.3,
          dimensions: { width: 15, height: 3, depth: 20 }
        },
        { 
          name: "Calissons d'Aix", 
          quantity: "250g", 
          producer: "Confiserie du Sud", 
          weight: 0.25,
          dimensions: { width: 12, height: 3, depth: 18 }
        },
        { 
          name: "Miel de Provence", 
          quantity: "500g", 
          producer: "Le Rucher de Jean", 
          weight: 0.65,
          dimensions: { width: 8, height: 12, depth: 8 }
        },
        { 
          name: "Navettes provençales", 
          quantity: "300g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.3,
          dimensions: { width: 18, height: 4, depth: 12 }
        },
        { 
          name: "Croquants aux amandes", 
          quantity: "250g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.25,
          dimensions: { width: 15, height: 3, depth: 20 }
        },
        { 
          name: "Pâte d'amande", 
          quantity: "200g", 
          producer: "Confiserie du Sud", 
          weight: 0.2,
          dimensions: { width: 10, height: 4, depth: 12 }
        }
      ]
    },
    'Saison': {
      description: "Une sélection plus riche de produits adaptés à la saison.",
      image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
      products: [
        { 
          name: "Thés de saison", 
          quantity: "3x50g", 
          producer: "Maison du Thé", 
          weight: 0.2,
          dimensions: { width: 12, height: 7, depth: 20 }
        },
        { 
          name: "Biscuits spéciaux", 
          quantity: "300g", 
          producer: "Boulangerie Traditionnelle", 
          weight: 0.3,
          dimensions: { width: 18, height: 4, depth: 25 }
        },
        { 
          name: "Miel de saison", 
          quantity: "500g", 
          producer: "Le Rucher de Jean", 
          weight: 0.65,
          dimensions: { width: 8, height: 12, depth: 8 }
        },
        { 
          name: "Confitures de saison", 
          quantity: "3x250g", 
          producer: "Les Délices du Verger", 
          weight: 1.05,
          dimensions: { width: 24, height: 8, depth: 8 }
        },
        { 
          name: "Chocolats spéciaux", 
          quantity: "250g", 
          producer: "Chocolaterie Artisanale", 
          weight: 0.25,
          dimensions: { width: 15, height: 3, depth: 20 }
        },
        { 
          name: "Calissons parfumés", 
          quantity: "200g", 
          producer: "Confiserie du Sud", 
          weight: 0.2,
          dimensions: { width: 12, height: 3, depth: 18 }
        }
      ]
    }
  }
};

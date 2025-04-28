import { BoxData } from '@/types/boxes';

export const boxes: BoxData[] = [
  {
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
        dimensions: { width: 16, height: 1, depth: 8 },
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
        dimensions: { width: 7, height: 10, depth: 7 },
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
  },
  {
    id: 2,
    baseTitle: "Moyenne Box",
    price: 34.99,
    description: "Parfaite pour un couple ou pour offrir, cette box contient une variété plus large de produits artisanaux.",
    image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
    items: 10,
    size: 'medium',
    weightLimit: 4.5, // 4.5kg max
    products: [
      { name: "Assortiment de chocolats", quantity: "300g", producer: "Chocolaterie Artisanale", weight: 0.3 },
      { name: "Coffret de thés", quantity: "4x50g", producer: "Maison du Thé", weight: 0.25 },
      { name: "Pot de miel", quantity: "500g", producer: "Le Rucher de Jean", weight: 0.65 },
      { name: "Biscuits assortis", quantity: "400g", producer: "Boulangerie Traditionnelle", weight: 0.4 },
      { name: "Duo de confitures", quantity: "2x250g", producer: "Les Délices du Verger", weight: 0.7 },
      { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
      { name: "Calissons", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
      { name: "Pâtes de fruits", quantity: "250g", producer: "Les Délices du Verger", weight: 0.25 },
      { name: "Sirop artisanal", quantity: "50cl", producer: "Les Délices du Verger", weight: 0.75 },
      { name: "Fruits confits", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 }
    ],
    themes: {
      'Découverte': {
        description: "Une sélection plus large de produits artisanaux pour découvrir de nouvelles saveurs.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Assortiment de chocolats", quantity: "300g", producer: "Chocolaterie Artisanale", weight: 0.3 },
          { name: "Coffret de thés", quantity: "4x50g", producer: "Maison du Thé", weight: 0.25 },
          { name: "Pot de miel", quantity: "500g", producer: "Le Rucher de Jean", weight: 0.65 },
          { name: "Biscuits assortis", quantity: "400g", producer: "Boulangerie Traditionnelle", weight: 0.4 },
          { name: "Duo de confitures", quantity: "2x250g", producer: "Les Délices du Verger", weight: 0.7 },
          { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
          { name: "Calissons", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
          { name: "Pâtes de fruits", quantity: "250g", producer: "Les Délices du Verger", weight: 0.25 },
          { name: "Sirop artisanal", quantity: "50cl", producer: "Les Délices du Verger", weight: 0.75 },
          { name: "Fruits confits", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 }
        ]
      },
      'Bourbon': {
        description: "Une sélection plus complète pour accompagner vos spiritueux préférés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Chocolats fins assortis", quantity: "300g", producer: "Chocolaterie Artisanale", weight: 0.3 },
          { name: "Noix de cajou grillées", quantity: "200g", producer: "Les Délices du Verger", weight: 0.2 },
          { name: "Amandes fumées", quantity: "200g", producer: "Les Délices du Verger", weight: 0.2 },
          { name: "Crackers artisanaux", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 },
          { name: "Olives assorties", quantity: "300g", producer: "L'Olivier Gourmet", weight: 0.4 },
          { name: "Tapenade verte", quantity: "150g", producer: "L'Olivier Gourmet", weight: 0.2 },
          { name: "Tapenade noire", quantity: "150g", producer: "L'Olivier Gourmet", weight: 0.2 },
          { name: "Biscuits salés aux herbes", quantity: "200g", producer: "Boulangerie Traditionnelle", weight: 0.2 },
          { name: "Mélange apéritif", quantity: "300g", producer: "Les Délices du Verger", weight: 0.3 },
          { name: "Chips de légumes", quantity: "150g", producer: "L'Olivier Gourmet", weight: 0.15 }
        ]
      },
      'Tradition': {
        description: "Une collection plus large de produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Nougat blanc et noir", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
          { name: "Calissons d'Aix", quantity: "250g", producer: "Confiserie du Sud", weight: 0.25 },
          { name: "Miel de Provence", quantity: "500g", producer: "Le Rucher de Jean", weight: 0.65 },
          { name: "Navettes provençales", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Croquants aux amandes", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 },
          { name: "Pâte d'amande", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
          { name: "Fruits confits assortis", quantity: "300g", producer: "Les Délices du Verger", weight: 0.3 },
          { name: "Berlingots", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
          { name: "Sirop de lavande", quantity: "50cl", producer: "Les Délices du Verger", weight: 0.75 },
          { name: "Biscuits à la fleur d'oranger", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 }
        ]
      },
      'Saison': {
        description: "Une sélection plus riche de produits adaptés à la saison.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Thés de saison", quantity: "3x50g", producer: "Maison du Thé", weight: 0.2 },
          { name: "Biscuits spéciaux", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Miel de saison", quantity: "500g", producer: "Le Rucher de Jean", weight: 0.65 },
          { name: "Confitures de saison", quantity: "3x250g", producer: "Les Délices du Verger", weight: 1.05 },
          { name: "Chocolats spéciaux", quantity: "250g", producer: "Chocolaterie Artisanale", weight: 0.25 },
          { name: "Calissons parfumés", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
          { name: "Sirops de saison", quantity: "2x25cl", producer: "Les Délices du Verger", weight: 0.8 },
          { name: "Pâtes de fruits", quantity: "200g", producer: "Les Délices du Verger", weight: 0.2 },
          { name: "Bonbons artisanaux", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 },
          { name: "Biscuits sablés", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 }
        ]
      }
    }
  },
  {
    id: 3,
    baseTitle: "Grande Box",
    price: 49.99,
    description: "Notre box la plus complète, idéale pour une famille ou pour un cadeau généreux. Une gamme étendue de produits d'épicerie fine.",
    image: "https://source.unsplash.com/1582562124811-c09040d0a901",
    items: 15,
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
      { name: "Pâtes de fruits", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 },
      { name: "Duo de sirops", quantity: "2x50cl", producer: "Les Délices du Verger", weight: 1.2 },
      { name: "Fruits confits", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
      { name: "Biscuits aux épices", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
      { name: "Berlingots", quantity: "250g", producer: "Confiserie du Sud", weight: 0.25 },
      { name: "Pâte d'amande", quantity: "250g", producer: "Confiserie du Sud", weight: 0.25 },
      { name: "Croquants aux noisettes", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 },
      { name: "Caramels au beurre salé", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 }
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
          { name: "Pâtes de fruits", quantity: "400g", producer: "Les Délices du Verger", weight: 0.4 },
          { name: "Duo de sirops", quantity: "2x50cl", producer: "Les Délices du Verger", weight: 1.2 },
          { name: "Fruits confits", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
          { name: "Biscuits aux épices", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Berlingots", quantity: "250g", producer: "Confiserie du Sud", weight: 0.25 },
          { name: "Pâte d'amande", quantity: "250g", producer: "Confiserie du Sud", weight: 0.25 },
          { name: "Croquants aux noisettes", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 },
          { name: "Caramels au beurre salé", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 }
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
          { name: "Chips de légumes", quantity: "3x100g", producer: "L'Olivier Gourmet", weight: 0.3 },
          { name: "Biscuits salés aux herbes", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Noix de cajou épicées", quantity: "300g", producer: "Les Délices du Verger", weight: 0.3 },
          { name: "Chocolats au whisky", quantity: "200g", producer: "Chocolaterie Artisanale", weight: 0.2 },
          { name: "Fruits secs au chocolat", quantity: "300g", producer: "Chocolaterie Artisanale", weight: 0.3 },
          { name: "Olives farcies", quantity: "300g", producer: "L'Olivier Gourmet", weight: 0.4 },
          { name: "Crackers aux graines", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 },
          { name: "Pistaches grillées", quantity: "250g", producer: "Les Délices du Verger", weight: 0.25 }
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
          { name: "Sirops traditionnels", quantity: "3x25cl", producer: "Les Délices du Verger", weight: 1.2 },
          { name: "Croquants aux amandes", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Navettes provençales", quantity: "400g", producer: "Boulangerie Traditionnelle", weight: 0.4 },
          { name: "Pralines", quantity: "300g", producer: "Chocolaterie Artisanale", weight: 0.3 },
          { name: "Caramels", quantity: "250g", producer: "Confiserie du Sud", weight: 0.25 },
          { name: "Biscuits à la fleur d'oranger", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Confitures traditionnelles", quantity: "3x250g", producer: "Les Délices du Verger", weight: 1.05 },
          { name: "Orangettes", quantity: "250g", producer: "Chocolaterie Artisanale", weight: 0.25 }
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
          { name: "Pâtes de fruits", quantity: "300g", producer: "Les Délices du Verger", weight: 0.3 },
          { name: "Bonbons artisanaux", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
          { name: "Biscuits sablés", quantity: "300g", producer: "Boulangerie Traditionnelle", weight: 0.3 },
          { name: "Nougat spécial", quantity: "300g", producer: "Confiserie du Sud", weight: 0.3 },
          { name: "Pralines assorties", quantity: "250g", producer: "Chocolaterie Artisanale", weight: 0.25 },
          { name: "Fruits confits", quantity: "300g", producer: "Les Délices du Verger", weight: 0.3 },
          { name: "Croquants spéciaux", quantity: "250g", producer: "Boulangerie Traditionnelle", weight: 0.25 },
          { name: "Caramels parfumés", quantity: "200g", producer: "Confiserie du Sud", weight: 0.2 }
        ]
      }
    }
  }
];

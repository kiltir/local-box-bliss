import { useState } from 'react';
import { BoxTheme } from '@/types/box';
import { BoxData } from '@/types/boxes';

const boxes: BoxData[] = [
  {
    id: 1,
    baseTitle: "Petite Box",
    price: 19.99,
    description: "La box idéale pour une personne, contenant une sélection de produits artisanaux de qualité.",
    image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
    items: 7,
    size: 'small',
    products: [
      { name: "Tablette de chocolat noir", quantity: "100g", producer: "Chocolaterie Artisanale" },
      { name: "Sachet de thé Earl Grey", quantity: "50g", producer: "Maison du Thé" },
      { name: "Pot de miel", quantity: "250g", producer: "Le Rucher de Jean" },
      { name: "Sachet de biscuits", quantity: "200g", producer: "Boulangerie Traditionnelle" },
      { name: "Confiture d'abricot", quantity: "250g", producer: "Les Délices du Verger" },
      { name: "Nougat traditionnel", quantity: "100g", producer: "Confiserie du Sud" },
      { name: "Pâtes de fruits", quantity: "150g", producer: "Les Délices du Verger" }
    ],
    themes: {
      'Découverte': {
        description: "Une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs.",
        image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
        products: [
          { name: "Tablette de chocolat noir", quantity: "100g", producer: "Chocolaterie Artisanale" },
          { name: "Sachet de thé Earl Grey", quantity: "50g", producer: "Maison du Thé" },
          { name: "Pot de miel", quantity: "250g", producer: "Le Rucher de Jean" },
          { name: "Sachet de biscuits", quantity: "200g", producer: "Boulangerie Traditionnelle" },
          { name: "Confiture d'abricot", quantity: "250g", producer: "Les Délices du Verger" },
          { name: "Nougat traditionnel", quantity: "100g", producer: "Confiserie du Sud" },
          { name: "Pâtes de fruits", quantity: "150g", producer: "Les Délices du Verger" }
        ]
      },
      'Bourbon': {
        description: "Une sélection raffinée pour accompagner vos spiritueux préférés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Chocolats assortis", quantity: "150g", producer: "Chocolaterie Artisanale" },
          { name: "Amandes grillées", quantity: "100g", producer: "Les Délices du Verger" },
          { name: "Crackers aux noix", quantity: "100g", producer: "Boulangerie Traditionnelle" },
          { name: "Olives marinées", quantity: "150g", producer: "L'Olivier Gourmet" },
          { name: "Miel de châtaignier", quantity: "250g", producer: "Le Rucher de Jean" },
          { name: "Tapenade", quantity: "100g", producer: "L'Olivier Gourmet" },
          { name: "Biscuits salés", quantity: "120g", producer: "Boulangerie Traditionnelle" }
        ]
      },
      'Tradition': {
        description: "Des produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Calissons", quantity: "150g", producer: "Confiserie du Sud" },
          { name: "Miel de lavande", quantity: "250g", producer: "Le Rucher de Jean" },
          { name: "Croquants aux amandes", quantity: "150g", producer: "Boulangerie Traditionnelle" },
          { name: "Sirop de violette", quantity: "25cl", producer: "Les Délices du Verger" },
          { name: "Navettes provençales", quantity: "200g", producer: "Boulangerie Traditionnelle" },
          { name: "Pâte d'amande", quantity: "150g", producer: "Confiserie du Sud" }
        ]
      },
      'Saison': {
        description: "Une sélection de produits adaptée à chaque saison.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Thé de saison", quantity: "100g", producer: "Maison du Thé" },
          { name: "Biscuits spéciaux", quantity: "200g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel de saison", quantity: "250g", producer: "Le Rucher de Jean" },
          { name: "Confiture de saison", quantity: "250g", producer: "Les Délices du Verger" },
          { name: "Chocolat spécial", quantity: "150g", producer: "Chocolaterie Artisanale" },
          { name: "Bonbons artisanaux", quantity: "150g", producer: "Confiserie du Sud" },
          { name: "Sirop de saison", quantity: "25cl", producer: "Les Délices du Verger" }
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
    products: [
      { name: "Assortiment de chocolats", quantity: "300g", producer: "Chocolaterie Artisanale" },
      { name: "Coffret de thés", quantity: "4x50g", producer: "Maison du Thé" },
      { name: "Pot de miel", quantity: "500g", producer: "Le Rucher de Jean" },
      { name: "Biscuits assortis", quantity: "400g", producer: "Boulangerie Traditionnelle" },
      { name: "Duo de confitures", quantity: "2x250g", producer: "Les Délices du Verger" },
      { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud" },
      { name: "Calissons", quantity: "200g", producer: "Confiserie du Sud" },
      { name: "Pâtes de fruits", quantity: "250g", producer: "Les Délices du Verger" },
      { name: "Sirop artisanal", quantity: "50cl", producer: "Les Délices du Verger" },
      { name: "Fruits confits", quantity: "200g", producer: "Confiserie du Sud" }
    ],
    themes: {
      'Découverte': {
        description: "Une sélection plus large de produits artisanaux pour découvrir de nouvelles saveurs.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Assortiment de chocolats", quantity: "300g", producer: "Chocolaterie Artisanale" },
          { name: "Coffret de thés", quantity: "4x50g", producer: "Maison du Thé" },
          { name: "Pot de miel", quantity: "500g", producer: "Le Rucher de Jean" },
          { name: "Biscuits assortis", quantity: "400g", producer: "Boulangerie Traditionnelle" },
          { name: "Duo de confitures", quantity: "2x250g", producer: "Les Délices du Verger" },
          { name: "Nougat traditionnel", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Calissons", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Pâtes de fruits", quantity: "250g", producer: "Les Délices du Verger" },
          { name: "Sirop artisanal", quantity: "50cl", producer: "Les Délices du Verger" },
          { name: "Fruits confits", quantity: "200g", producer: "Confiserie du Sud" }
        ]
      },
      'Bourbon': {
        description: "Une sélection plus complète pour accompagner vos spiritueux préférés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Chocolats fins assortis", quantity: "300g", producer: "Chocolaterie Artisanale" },
          { name: "Noix de cajou grillées", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Amandes fumées", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Crackers artisanaux", quantity: "250g", producer: "Boulangerie Traditionnelle" },
          { name: "Olives assorties", quantity: "300g", producer: "L'Olivier Gourmet" },
          { name: "Tapenade verte", quantity: "150g", producer: "L'Olivier Gourmet" },
          { name: "Tapenade noire", quantity: "150g", producer: "L'Olivier Gourmet" },
          { name: "Biscuits salés aux herbes", quantity: "200g", producer: "Boulangerie Traditionnelle" },
          { name: "Mélange apéritif", quantity: "300g", producer: "Les Délices du Verger" },
          { name: "Chips de légumes", quantity: "150g", producer: "L'Olivier Gourmet" }
        ]
      },
      'Tradition': {
        description: "Une collection plus large de produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Nougat blanc et noir", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Calissons d'Aix", quantity: "250g", producer: "Confiserie du Sud" },
          { name: "Miel de Provence", quantity: "500g", producer: "Le Rucher de Jean" },
          { name: "Navettes provençales", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Croquants aux amandes", quantity: "250g", producer: "Boulangerie Traditionnelle" },
          { name: "Pâte d'amande", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Fruits confits assortis", quantity: "300g", producer: "Les Délices du Verger" },
          { name: "Berlingots", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Sirop de lavande", quantity: "50cl", producer: "Les Délices du Verger" },
          { name: "Biscuits à la fleur d'oranger", quantity: "250g", producer: "Boulangerie Traditionnelle" }
        ]
      },
      'Saison': {
        description: "Une sélection plus riche de produits adaptés à la saison.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Thés de saison", quantity: "3x50g", producer: "Maison du Thé" },
          { name: "Biscuits spéciaux", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel de saison", quantity: "500g", producer: "Le Rucher de Jean" },
          { name: "Confitures de saison", quantity: "3x250g", producer: "Les Délices du Verger" },
          { name: "Chocolats spéciaux", quantity: "250g", producer: "Chocolaterie Artisanale" },
          { name: "Calissons parfumés", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Sirops de saison", quantity: "2x25cl", producer: "Les Délices du Verger" },
          { name: "Pâtes de fruits", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Bonbons artisanaux", quantity: "200g", producer: "Confiserie du Sud" },
          { name: "Biscuits sablés", quantity: "250g", producer: "Boulangerie Traditionnelle" }
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
    products: [
      { name: "Collection de chocolats", quantity: "500g", producer: "Chocolaterie Artisanale" },
      { name: "Coffret dégustation de thés", quantity: "6x50g", producer: "Maison du Thé" },
      { name: "Grand pot de miel", quantity: "1kg", producer: "Le Rucher de Jean" },
      { name: "Assortiment de biscuits", quantity: "600g", producer: "Boulangerie Traditionnelle" },
      { name: "Trio de confitures", quantity: "3x250g", producer: "Les Délices du Verger" },
      { name: "Nougat assorti", quantity: "400g", producer: "Confiserie du Sud" },
      { name: "Calissons d'Aix", quantity: "400g", producer: "Confiserie du Sud" },
      { name: "Pâtes de fruits", quantity: "400g", producer: "Les Délices du Verger" },
      { name: "Duo de sirops", quantity: "2x50cl", producer: "Les Délices du Verger" },
      { name: "Fruits confits", quantity: "300g", producer: "Confiserie du Sud" },
      { name: "Biscuits aux épices", quantity: "300g", producer: "Boulangerie Traditionnelle" },
      { name: "Berlingots", quantity: "250g", producer: "Confiserie du Sud" },
      { name: "Pâte d'amande", quantity: "250g", producer: "Confiserie du Sud" },
      { name: "Croquants aux noisettes", quantity: "250g", producer: "Boulangerie Traditionnelle" },
      { name: "Caramels au beurre salé", quantity: "200g", producer: "Confiserie du Sud" }
    ],
    themes: {
      'Découverte': {
        description: "Notre sélection la plus complète de produits artisanaux pour découvrir un maximum de saveurs.",
        image: "https://source.unsplash.com/1582562124811-c09040d0a901",
        products: [
          { name: "Collection de chocolats", quantity: "500g", producer: "Chocolaterie Artisanale" },
          { name: "Coffret dégustation de thés", quantity: "6x50g", producer: "Maison du Thé" },
          { name: "Grand pot de miel", quantity: "1kg", producer: "Le Rucher de Jean" },
          { name: "Assortiment de biscuits", quantity: "600g", producer: "Boulangerie Traditionnelle" },
          { name: "Trio de confitures", quantity: "3x250g", producer: "Les Délices du Verger" },
          { name: "Nougat assorti", quantity: "400g", producer: "Confiserie du Sud" },
          { name: "Calissons d'Aix", quantity: "400g", producer: "Confiserie du Sud" },
          { name: "Pâtes de fruits", quantity: "400g", producer: "Les Délices du Verger" },
          { name: "Duo de sirops", quantity: "2x50cl", producer: "Les Délices du Verger" },
          { name: "Fruits confits", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Biscuits aux épices", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Berlingots", quantity: "250g", producer: "Confiserie du Sud" },
          { name: "Pâte d'amande", quantity: "250g", producer: "Confiserie du Sud" },
          { name: "Croquants aux noisettes", quantity: "250g", producer: "Boulangerie Traditionnelle" },
          { name: "Caramels au beurre salé", quantity: "200g", producer: "Confiserie du Sud" }
        ]
      },
      'Bourbon': {
        description: "Notre sélection premium pour les amateurs de spiritueux et de produits raffinés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Chocolats fins assortis", quantity: "500g", producer: "Chocolaterie Artisanale" },
          { name: "Mélange de fruits secs", quantity: "400g", producer: "Les Délices du Verger" },
          { name: "Crackers premium", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Sélection d'olives", quantity: "500g", producer: "L'Olivier Gourmet" },
          { name: "Tapenades assorties", quantity: "3x150g", producer: "L'Olivier Gourmet" },
          { name: "Mélange apéritif deluxe", quantity: "400g", producer: "Les Délices du Verger" },
          { name: "Amandes caramélisées", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Chips de légumes", quantity: "3x100g", producer: "L'Olivier Gourmet" },
          { name: "Biscuits salés aux herbes", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Noix de cajou épicées", quantity: "300g", producer: "Les Délices du Verger" },
          { name: "Chocolats au whisky", quantity: "200g", producer: "Chocolaterie Artisanale" },
          { name: "Fruits secs au chocolat", quantity: "300g", producer: "Chocolaterie Artisanale" },
          { name: "Olives farcies", quantity: "300g", producer: "L'Olivier Gourmet" },
          { name: "Crackers aux graines", quantity: "250g", producer: "Boulangerie Traditionnelle" },
          { name: "Pistaches grillées", quantity: "250g", producer: "Les Délices du Verger" }
        ]
      },
      'Tradition': {
        description: "Notre collection complète de produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Grand nougat traditionnel", quantity: "500g", producer: "Confiserie du Sud" },
          { name: "Calissons d'Aix", quantity: "400g", producer: "Confiserie du Sud" },
          { name: "Miel de Provence", quantity: "1kg", producer: "Le Rucher de Jean" },
          { name: "Biscuits traditionnels", quantity: "500g", producer: "Boulangerie Traditionnelle" },
          { name: "Pâte d'amande", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Fruits confits assortis", quantity: "400g", producer: "Les Délices du Verger" },
          { name: "Berlingots", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Sirops traditionnels", quantity: "3x25cl", producer: "Les Délices du Verger" },
          { name: "Croquants aux amandes", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Navettes provençales", quantity: "400g", producer: "Boulangerie Traditionnelle" },
          { name: "Pralines", quantity: "300g", producer: "Chocolaterie Artisanale" },
          { name: "Caramels", quantity: "250g", producer: "Confiserie du Sud" },
          { name: "Biscuits à la fleur d'oranger", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Confitures traditionnelles", quantity: "3x250g", producer: "Les Délices du Verger" },
          { name: "Orangettes", quantity: "250g", producer: "Chocolaterie Artisanale" }
        ]
      },
      'Saison': {
        description: "Notre meilleure sélection de produits de saison pour une expérience gastronomique complète.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Thés de saison", quantity: "5x50g", producer: "Maison du Thé" },
          { name: "Biscuits spéciaux", quantity: "500g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel de saison", quantity: "1kg", producer: "Le Rucher de Jean" },
          { name: "Confitures de saison", quantity: "4x250g", producer: "Les Délices du Verger" },
          { name: "Chocolats spéciaux", quantity: "400g", producer: "Chocolaterie Artisanale" },
          { name: "Calissons parfumés", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Sirops de saison", quantity: "3x25cl", producer: "Les Délices du Verger" },
          { name: "Pâtes de fruits", quantity: "300g", producer: "Les Délices du Verger" },
          { name: "Bonbons artisanaux", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Biscuits sablés", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Nougat spécial", quantity: "300g", producer: "Confiserie du Sud" },
          { name: "Pralines assorties", quantity: "250g", producer: "Chocolaterie Artisanale" },
          { name: "Fruits confits", quantity: "300g", producer: "Les Délices du Verger" },
          { name: "Croquants spéciaux", quantity: "250g", producer: "Boulangerie Traditionnelle" },
          { name: "Caramels parfumés", quantity: "200g", producer: "Confiserie du Sud" }
        ]
      }
    }
  }
];

export const useBoxes = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<BoxTheme>('Découverte');

  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
  };

  const handleCloseDetails = () => {
    setSelectedBox(null);
  };

  const handleThemeChange = (theme: BoxTheme) => {
    setSelectedTheme(theme);
  };

  const getSelectedBoxDetails = () => {
    if (selectedBox === null) return null;
    const box = boxes.find(box => box.id === selectedBox);
    if (!box) return null;
    
    const themeData = box.themes[selectedTheme];
    return {
      id: box.id,
      title: `${box.baseTitle} ${selectedTheme}`,
      price: box.price,
      description: themeData.description || box.description,
      image: themeData.image || box.image,
      items: themeData.products?.length || box.items,
      size: box.size,
      products: themeData.products || box.products
    };
  };

  const getBoxTitle = (box: BoxData) => {
    return `${box.baseTitle} ${selectedTheme}`;
  };

  return {
    boxes,
    selectedBox,
    selectedTheme,
    handleBoxClick,
    handleCloseDetails,
    handleThemeChange,
    getSelectedBoxDetails,
    getBoxTitle,
  };
};

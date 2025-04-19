import { useState } from 'react';
import { BoxTheme } from '@/types/box';
import { BoxData } from '@/types/boxes';

const boxes: BoxData[] = [
  {
    id: 1,
    baseTitle: "Petite Box",
    price: 19.99,
    description: "La box idéale pour une personne ou un petit foyer, contenant une sélection de produits frais et locaux de saison.",
    image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
    items: 7,
    size: 'small',
    products: [
      { name: "Carottes", quantity: "500g", producer: "Ferme des Trois Chênes" },
      { name: "Pommes de terre", quantity: "1kg", producer: "Ferme des Trois Chênes" },
      { name: "Salade", quantity: "1 pièce", producer: "Ferme des Trois Chênes" },
      { name: "Pommes", quantity: "4 pièces", producer: "Les Vergers d'Émilie" },
      { name: "Fromage de chèvre", quantity: "150g", producer: "Fromagerie du Vallon" },
      { name: "Yaourt nature", quantity: "2 pots", producer: "Fromagerie du Vallon" },
      { name: "Pain de campagne", quantity: "400g", producer: "Boulangerie Traditionnelle" }
    ],
    themes: {
      'Découverte': {
        description: "Une sélection variée de produits locaux pour découvrir de nouvelles saveurs.",
        image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
        products: [
          { name: "Carottes", quantity: "500g", producer: "Ferme des Trois Chênes" },
          { name: "Pommes de terre", quantity: "1kg", producer: "Ferme des Trois Chênes" },
          { name: "Salade", quantity: "1 pièce", producer: "Ferme des Trois Chênes" },
          { name: "Pommes", quantity: "4 pièces", producer: "Les Vergers d'Émilie" },
          { name: "Fromage de chèvre", quantity: "150g", producer: "Fromagerie du Vallon" },
          { name: "Yaourt nature", quantity: "2 pots", producer: "Fromagerie du Vallon" },
          { name: "Pain de campagne", quantity: "400g", producer: "Boulangerie Traditionnelle" }
        ]
      },
      'Bourbon': {
        description: "Des produits choisis pour accompagner parfaitement vos spiritueux préférés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Fromage affiné", quantity: "200g", producer: "Fromagerie du Vallon" },
          { name: "Charcuterie assortie", quantity: "150g", producer: "Ferme du Chêne" },
          { name: "Noix de cajou", quantity: "100g", producer: "Les Délices du Verger" },
          { name: "Chocolat noir", quantity: "100g", producer: "Chocolaterie Artisanale" },
          { name: "Olives vertes", quantity: "150g", producer: "L'Olivier Gourmet" },
          { name: "Crackers aux graines", quantity: "100g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel d'acacia", quantity: "150g", producer: "Le Rucher de Jean" }
        ]
      },
      'Tradition': {
        description: "Des produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Terrine de campagne", quantity: "150g", producer: "Ferme du Chêne" },
          { name: "Rillettes", quantity: "125g", producer: "Ferme du Chêne" },
          { name: "Fromage fermier", quantity: "200g", producer: "Fromagerie du Vallon" },
          { name: "Pain de seigle", quantity: "400g", producer: "Boulangerie Traditionnelle" },
          { name: "Cornichons", quantity: "200g", producer: "Ferme des Trois Chênes" },
          { name: "Confit d'oignons", quantity: "100g", producer: "Les Délices du Verger" },
          { name: "Pâté de foie", quantity: "100g", producer: "Ferme du Chêne" }
        ]
      },
      'Saison': {
        description: "Des produits frais sélectionnés selon la saison pour une fraîcheur maximale.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Fruits de saison", quantity: "500g", producer: "Les Vergers d'Émilie" },
          { name: "Légumes de saison", quantity: "1kg", producer: "Ferme des Trois Chênes" },
          { name: "Herbes fraîches", quantity: "1 bouquet", producer: "Ferme des Trois Chênes" },
          { name: "Miel de fleurs", quantity: "250g", producer: "Le Rucher de Jean" },
          { name: "Fromage frais", quantity: "150g", producer: "Fromagerie du Vallon" },
          { name: "Œufs fermiers", quantity: "6 pièces", producer: "Ferme des Trois Chênes" },
          { name: "Confitures de saison", quantity: "250g", producer: "Les Délices du Verger" }
        ]
      }
    }
  },
  {
    id: 2,
    baseTitle: "Moyenne Box",
    price: 34.99,
    description: "Parfaite pour un couple ou un foyer de 3-4 personnes, cette box contient une variété plus large de produits locaux.",
    image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
    items: 10,
    size: 'medium',
    products: [
      { name: "Carottes", quantity: "1kg", producer: "Ferme des Trois Chênes" },
      { name: "Pommes de terre", quantity: "2kg", producer: "Ferme des Trois Chênes" },
      { name: "Salade", quantity: "1 pièce", producer: "Ferme des Trois Chênes" },
      { name: "Courgettes", quantity: "500g", producer: "Ferme des Trois Chênes" },
      { name: "Pommes", quantity: "6 pièces", producer: "Les Vergers d'Émilie" },
      { name: "Poires", quantity: "4 pièces", producer: "Les Vergers d'Émilie" },
      { name: "Fromage de chèvre", quantity: "200g", producer: "Fromagerie du Vallon" },
      { name: "Yaourt nature", quantity: "4 pots", producer: "Fromagerie du Vallon" },
      { name: "Pain de campagne", quantity: "800g", producer: "Boulangerie Traditionnelle" },
      { name: "Miel de fleurs", quantity: "250g", producer: "Le Rucher de Jean" }
    ],
    themes: {
      'Découverte': {
        description: "Une sélection plus large de produits locaux pour découvrir de nouvelles saveurs.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Carottes", quantity: "1kg", producer: "Ferme des Trois Chênes" },
          { name: "Pommes de terre", quantity: "2kg", producer: "Ferme des Trois Chênes" },
          { name: "Salade", quantity: "1 pièce", producer: "Ferme des Trois Chênes" },
          { name: "Courgettes", quantity: "500g", producer: "Ferme des Trois Chênes" },
          { name: "Pommes", quantity: "6 pièces", producer: "Les Vergers d'Émilie" },
          { name: "Poires", quantity: "4 pièces", producer: "Les Vergers d'Émilie" },
          { name: "Fromage de chèvre", quantity: "200g", producer: "Fromagerie du Vallon" },
          { name: "Yaourt nature", quantity: "4 pots", producer: "Fromagerie du Vallon" },
          { name: "Pain de campagne", quantity: "800g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel de fleurs", quantity: "250g", producer: "Le Rucher de Jean" }
        ]
      },
      'Bourbon': {
        description: "Une sélection plus complète pour accompagner vos spiritueux préférés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Assortiment de fromages", quantity: "350g", producer: "Fromagerie du Vallon" },
          { name: "Charcuterie assortie", quantity: "300g", producer: "Ferme du Chêne" },
          { name: "Fruits secs", quantity: "250g", producer: "Les Délices du Verger" },
          { name: "Chocolats fins", quantity: "200g", producer: "Chocolaterie Artisanale" },
          { name: "Olives assorties", quantity: "300g", producer: "L'Olivier Gourmet" },
          { name: "Crackers artisanaux", quantity: "200g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel d'acacia", quantity: "250g", producer: "Le Rucher de Jean" },
          { name: "Tapenade", quantity: "150g", producer: "L'Olivier Gourmet" },
          { name: "Fruits confits", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Noix caramélisées", quantity: "150g", producer: "Les Délices du Verger" }
        ]
      },
      'Tradition': {
        description: "Une collection plus large de produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Terrine de campagne", quantity: "250g", producer: "Ferme du Chêne" },
          { name: "Rillettes", quantity: "200g", producer: "Ferme du Chêne" },
          { name: "Assortiment de fromages", quantity: "350g", producer: "Fromagerie du Vallon" },
          { name: "Pain de seigle", quantity: "800g", producer: "Boulangerie Traditionnelle" },
          { name: "Cornichons", quantity: "300g", producer: "Ferme des Trois Chênes" },
          { name: "Confit d'oignons", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Pâté de foie", quantity: "150g", producer: "Ferme du Chêne" },
          { name: "Saucisson sec", quantity: "200g", producer: "Ferme du Chêne" },
          { name: "Confiture traditionnelle", quantity: "350g", producer: "Les Délices du Verger" },
          { name: "Moutarde à l'ancienne", quantity: "200g", producer: "Les Délices du Verger" }
        ]
      },
      'Saison': {
        description: "Une sélection plus riche de produits frais selon la saison pour une fraîcheur maximale.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Assortiment de fruits", quantity: "1kg", producer: "Les Vergers d'Émilie" },
          { name: "Légumes de saison", quantity: "2kg", producer: "Ferme des Trois Chênes" },
          { name: "Herbes fraîches assorties", quantity: "2 bouquets", producer: "Ferme des Trois Chênes" },
          { name: "Miel de saison", quantity: "350g", producer: "Le Rucher de Jean" },
          { name: "Fromages fermiers", quantity: "350g", producer: "Fromagerie du Vallon" },
          { name: "Œufs fermiers", quantity: "10 pièces", producer: "Ferme des Trois Chênes" },
          { name: "Confitures de saison", quantity: "2x250g", producer: "Les Délices du Verger" },
          { name: "Jus de fruits frais", quantity: "750ml", producer: "Les Vergers d'Émilie" },
          { name: "Pain aux céréales", quantity: "800g", producer: "Boulangerie Traditionnelle" },
          { name: "Yaourt aux fruits", quantity: "4 pots", producer: "Fromagerie du Vallon" }
        ]
      }
    }
  },
  {
    id: 3,
    baseTitle: "Grande Box",
    price: 49.99,
    description: "Notre box la plus complète, idéale pour une famille ou pour partager. Une gamme étendue de produits frais et d'épicerie.",
    image: "https://source.unsplash.com/1582562124811-c09040d0a901",
    items: 15,
    size: 'large',
    products: [
      { name: "Carottes", quantity: "1.5kg", producer: "Ferme des Trois Chênes" },
      { name: "Pommes de terre", quantity: "3kg", producer: "Ferme des Trois Chênes" },
      { name: "Salade", quantity: "2 pièces", producer: "Ferme des Trois Chênes" },
      { name: "Courgettes", quantity: "1kg", producer: "Ferme des Trois Chênes" },
      { name: "Tomates", quantity: "1kg", producer: "Ferme des Trois Chênes" },
      { name: "Pommes", quantity: "8 pièces", producer: "Les Vergers d'Émilie" },
      { name: "Poires", quantity: "6 pièces", producer: "Les Vergers d'Émilie" },
      { name: "Fraises", quantity: "500g", producer: "Les Vergers d'Émilie" },
      { name: "Fromage de chèvre", quantity: "300g", producer: "Fromagerie du Vallon" },
      { name: "Camembert", quantity: "250g", producer: "Fromagerie du Vallon" },
      { name: "Yaourt nature", quantity: "6 pots", producer: "Fromagerie du Vallon" },
      { name: "Pain de campagne", quantity: "1kg", producer: "Boulangerie Traditionnelle" },
      { name: "Miel de fleurs", quantity: "500g", producer: "Le Rucher de Jean" },
      { name: "Confiture de fraises", quantity: "350g", producer: "Les Délices du Verger" },
      { name: "Jus de pomme", quantity: "1L", producer: "Les Vergers d'Émilie" }
    ],
    themes: {
      'Découverte': {
        description: "Notre sélection la plus complète de produits locaux pour découvrir un maximum de saveurs.",
        image: "https://source.unsplash.com/1582562124811-c09040d0a901",
        products: [
          { name: "Carottes", quantity: "1.5kg", producer: "Ferme des Trois Chênes" },
          { name: "Pommes de terre", quantity: "3kg", producer: "Ferme des Trois Chênes" },
          { name: "Salade", quantity: "2 pièces", producer: "Ferme des Trois Chênes" },
          { name: "Courgettes", quantity: "1kg", producer: "Ferme des Trois Chênes" },
          { name: "Tomates", quantity: "1kg", producer: "Ferme des Trois Chênes" },
          { name: "Pommes", quantity: "8 pièces", producer: "Les Vergers d'Émilie" },
          { name: "Poires", quantity: "6 pièces", producer: "Les Vergers d'Émilie" },
          { name: "Fraises", quantity: "500g", producer: "Les Vergers d'Émilie" },
          { name: "Fromage de chèvre", quantity: "300g", producer: "Fromagerie du Vallon" },
          { name: "Camembert", quantity: "250g", producer: "Fromagerie du Vallon" },
          { name: "Yaourt nature", quantity: "6 pots", producer: "Fromagerie du Vallon" },
          { name: "Pain de campagne", quantity: "1kg", producer: "Boulangerie Traditionnelle" },
          { name: "Miel de fleurs", quantity: "500g", producer: "Le Rucher de Jean" },
          { name: "Confiture de fraises", quantity: "350g", producer: "Les Délices du Verger" },
          { name: "Jus de pomme", quantity: "1L", producer: "Les Vergers d'Émilie" }
        ]
      },
      'Bourbon': {
        description: "Notre sélection premium pour les amateurs de spiritueux et de produits raffinés.",
        image: "https://source.unsplash.com/493962853295-0fd70327578a",
        products: [
          { name: "Plateau de fromages affinés", quantity: "500g", producer: "Fromagerie du Vallon" },
          { name: "Sélection de charcuteries", quantity: "400g", producer: "Ferme du Chêne" },
          { name: "Assortiment de fruits secs", quantity: "400g", producer: "Les Délices du Verger" },
          { name: "Chocolats fins assortis", quantity: "300g", producer: "Chocolaterie Artisanale" },
          { name: "Olives variées", quantity: "400g", producer: "L'Olivier Gourmet" },
          { name: "Sélection de crackers", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel d'acacia", quantity: "350g", producer: "Le Rucher de Jean" },
          { name: "Tapenades assorties", quantity: "3x100g", producer: "L'Olivier Gourmet" },
          { name: "Fruits confits", quantity: "300g", producer: "Les Délices du Verger" },
          { name: "Noix caramélisées", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Confitures artisanales", quantity: "3x250g", producer: "Les Délices du Verger" },
          { name: "Terrines assorties", quantity: "3x150g", producer: "Ferme du Chêne" },
          { name: "Biscuits salés", quantity: "250g", producer: "Boulangerie Traditionnelle" },
          { name: "Tartinade de poivrons", quantity: "200g", producer: "Les Délices du Verger" },
          { name: "Cake aux fruits secs", quantity: "400g", producer: "Boulangerie Traditionnelle" }
        ]
      },
      'Tradition': {
        description: "Notre collection complète de produits authentiques issus de recettes traditionnelles.",
        image: "https://source.unsplash.com/472396961693-142e6e269027",
        products: [
          { name: "Terrine de campagne", quantity: "350g", producer: "Ferme du Chêne" },
          { name: "Rillettes assorties", quantity: "3x150g", producer: "Ferme du Chêne" },
          { name: "Plateau de fromages fermiers", quantity: "500g", producer: "Fromagerie du Vallon" },
          { name: "Pain de seigle traditionnel", quantity: "1kg", producer: "Boulangerie Traditionnelle" },
          { name: "Cornichons au vinaigre", quantity: "400g", producer: "Ferme des Trois Chênes" },
          { name: "Confit d'oignons", quantity: "250g", producer: "Les Délices du Verger" },
          { name: "Pâtés assortis", quantity: "3x150g", producer: "Ferme du Chêne" },
          { name: "Saucisson sec", quantity: "2x200g", producer: "Ferme du Chêne" },
          { name: "Confitures traditionnelles", quantity: "3x350g", producer: "Les Délices du Verger" },
          { name: "Moutarde à l'ancienne", quantity: "250g", producer: "Les Délices du Verger" },
          { name: "Vin rouge de pays", quantity: "75cl", producer: "Domaine des Coteaux" },
          { name: "Biscuits traditionnels", quantity: "300g", producer: "Boulangerie Traditionnelle" },
          { name: "Miel de montagne", quantity: "500g", producer: "Le Rucher de Jean" },
          { name: "Sirop artisanal", quantity: "50cl", producer: "Les Délices du Verger" },
          { name: "Lentilles paysannes", quantity: "500g", producer: "Ferme des Trois Chênes" }
        ]
      },
      'Saison': {
        description: "Notre meilleure sélection de produits frais de saison pour une expérience gastronomique complète.",
        image: "https://source.unsplash.com/1509316975850-ff9c5deb0cd9",
        products: [
          { name: "Grand assortiment de fruits", quantity: "2kg", producer: "Les Vergers d'Émilie" },
          { name: "Légumes de saison variés", quantity: "3kg", producer: "Ferme des Trois Chênes" },
          { name: "Herbes fraîches assorties", quantity: "3 bouquets", producer: "Ferme des Trois Chênes" },
          { name: "Miel de saison", quantity: "500g", producer: "Le Rucher de Jean" },
          { name: "Plateau de fromages fermiers", quantity: "500g", producer: "Fromagerie du Vallon" },
          { name: "Œufs fermiers extra-frais", quantity: "12 pièces", producer: "Ferme des Trois Chênes" },
          { name: "Confitures de saison variées", quantity: "3x250g", producer: "Les Délices du Verger" },
          { name: "Jus de fruits frais", quantity: "2x750ml", producer: "Les Vergers d'Émilie" },
          { name: "Pain aux céréales", quantity: "1kg", producer: "Boulangerie Traditionnelle" },
          { name: "Yaourts aux fruits", quantity: "6 pots", producer: "Fromagerie du Vallon" },
          { name: "Tarte aux fruits de saison", quantity: "1 pièce", producer: "Boulangerie Traditionnelle" },
          { name: "Soupe fraîche", quantity: "1L", producer: "Ferme des Trois Chênes" },
          { name: "Fromage blanc", quantity: "500g", producer: "Fromagerie du Vallon" },
          { name: "Coulis de fruits", quantity: "250ml", producer: "Les Vergers d'Émilie" },
          { name: "Biscuits aux fruits secs", quantity: "300g", producer: "Boulangerie Traditionnelle" }
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


import { BoxData } from '@/types/boxes';

export const mediumBox: BoxData = {
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
};

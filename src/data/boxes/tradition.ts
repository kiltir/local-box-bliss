
import { BoxData } from '@/types/boxes';
import achardImg from '@/assets/products/racine/achard.png';
import rhumArrangeImg from '@/assets/products/racine/rhum-arrange.png';
import tisanePeiImg from '@/assets/products/racine/tisane-pei.png';
import pimentPeiImg from '@/assets/products/racine/piment-pei.png';

export const traditionBox: BoxData = {
  id: 3,
  baseTitle: "Box Racine",
  price: 89.99,
  description: "Des produits authentiques issus de recettes traditionnelles créoles transmises de génération en génération.",
  image: "https://source.unsplash.com/472396961693-142e6e269027",
  images: [
    "/lovable-uploads/kiltirbox-standard.jpg",
    "/lovable-uploads/22c73fc8-f3d1-4290-8d99-f0bd76e3ea8f.png",
    "/lovable-uploads/1e5534c0-a5e1-4153-829c-02324011758e.png"
  ],
  items: 4,
  size: 'unique',
  weightLimit: 4,
  theme: 'Racine',
  rating: 4.2,
  reviewCount: 31,
  products: [
    { 
      name: "Achard", 
      quantity: "200g", 
      producer: "Les Trésors de Mamie Céliane",
      description: "Préparation traditionnelle de légumes cuits et marinés dans un mélange d'épices et de vinaigre",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25,
      image: achardImg
    },
    { 
      name: "Rhum arrangé miniature", 
      quantity: "50ml", 
      producer: "Distillerie Créole",
      description: "Alcool traditionnel aromatisé élaboré selon un savoir-faire ancestral",
      dimensions: { width: 4, height: 12, depth: 4 },
      weight: 0.08,
      image: rhumArrangeImg
    },
    { 
      name: "Tisane de plantes péi", 
      quantity: "60g", 
      producer: "Herboristerie Créole",
      description: "Préparation traditionnelle de plantes à infuser pour une dégustation thérapeutique",
      dimensions: { width: 12, height: 8, depth: 3 },
      weight: 0.06,
      image: tisanePeiImg
    },
    { 
      name: "Piment péi", 
      quantity: "200g", 
      producer: "Verger Payet",
      description: "Pâte de piment traditionnelle pour relever le goût de tous vos plats",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.2,
      image: pimentPeiImg
    }
  ]
};

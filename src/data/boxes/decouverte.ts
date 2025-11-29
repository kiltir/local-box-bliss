
import { BoxData } from '@/types/boxes';
import kimchiImg from '@/assets/products/decouverte/kimchi.png';
import confitureGoyaveImg from '@/assets/products/decouverte/confiture-goyave.png';
import tiCalicocoImg from '@/assets/products/decouverte/ti-calicoco.png';
import trioPatateDouceImg from '@/assets/products/decouverte/trio-patate-douce.png';

export const decouverteBox: BoxData = {
  id: 1,
  baseTitle: "Box Découverte",
  price: 79.99,
  description: "Une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs authentiques de La Réunion.",
  image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
  images: [
    "/lovable-uploads/KB_box_2.png",
    "/lovable-uploads/22c73fc8-f3d1-4290-8d99-f0bd76e3ea8f.png",
    "/lovable-uploads/1e5534c0-a5e1-4153-829c-02324011758e.png"
  ],
  items: 4,
  size: 'unique',
  weightLimit: 4,
  theme: 'Découverte',
  rating: 4.5,
  reviewCount: 23,
  products: [
    { 
      name: "Kimchi courgette et bringelle", 
      quantity: "200g", 
      producer: "Pot en ciel kréol",
      description: "Préparation salée traditionnelle coréenne revisitée façon créole",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25,
      image: kimchiImg
    },
    { 
      name: "Confiture surprise", 
      quantity: "200g", 
      producer: "Les Délices du Jardin",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25,
      image: confitureGoyaveImg
    },
    { 
      name: "Boite de Ti Calicoco", 
      quantity: "150g", 
      producer: "Calicoco",
      description: "Friandise née du mélange entre le calisson d'Aix-en-Provence et le bonbon coco réunionnais",
      dimensions: { width: 8, height: 8, depth: 8 },
      weight: 0.15,
      image: tiCalicocoImg
    },
    { 
      name: "Trio de patate douce", 
      quantity: "250g", 
      producer: "Les Trésors de Mamie Céliane",
      description: "Crème de 3 patates douces pour une déclinaison de saveurs et couleurs",
      dimensions: { width: 7, height: 8, depth: 7 },
      weight: 0.25,
      image: trioPatateDouceImg
    }
  ]
};

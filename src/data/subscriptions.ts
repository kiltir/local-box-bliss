
import { SubscriptionData } from '@/types/subscription';

const createSubscriptionOptions = (basePrice: number) => [
  {
    duration: '6months' as const,
    label: '6 mois',
    months: 6,
    discount: 5,
    totalPrice: Math.round(basePrice * 6 * 0.95),
    monthlyPrice: Math.round(basePrice * 0.95)
  },
  {
    duration: '1year' as const,
    label: '1 an',
    months: 12,
    discount: 10,
    totalPrice: Math.round(basePrice * 12 * 0.9),
    monthlyPrice: Math.round(basePrice * 0.9)
  }
];

export const subscriptions: SubscriptionData[] = [
  {
    id: 1,
    baseTitle: "Box Découverte",
    theme: 'Découverte',
    basePrice: 79.99,
    description: "Recevez chaque mois une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs authentiques de La Réunion.",
    image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
    items: 4,
    rating: 4.5,
    reviewCount: 23,
    options: createSubscriptionOptions(79.99)
  },
  {
    id: 2,
    baseTitle: "Box Bourbon",
    theme: 'Bourbon',
    basePrice: 129.99,
    description: "Recevez chaque mois une sélection raffinée pour vous offrir l'expérience de parfums et saveurs \"lontan\" avec des produits d'exception.",
    image: "/lovable-uploads/dfae2a49-8682-4e2d-b364-efe22d218a5e.png",
    items: 5,
    rating: 4.8,
    reviewCount: 15,
    options: createSubscriptionOptions(129.99)
  },
  {
    id: 3,
    baseTitle: "Box Racine",
    theme: 'Racine',
    basePrice: 89.99,
    description: "Recevez chaque mois des produits authentiques issus de recettes traditionnelles créoles transmises de génération en génération.",
    image: "https://source.unsplash.com/472396961693-142e6e269027",
    items: 4,
    rating: 4.2,
    reviewCount: 31,
    options: createSubscriptionOptions(89.99)
  },
  {
    id: 4,
    baseTitle: "Box Saison",
    theme: 'Saison',
    basePrice: 69.99,
    description: "Recevez chaque mois une sélection de produits de saison mettant en valeur les fruits et légumes du moment.",
    image: "/lovable-uploads/ac03653a-7722-48c5-a6c8-0a25a453791b.png",
    items: 4,
    rating: 4.6,
    reviewCount: 18,
    options: createSubscriptionOptions(69.99)
  }
];

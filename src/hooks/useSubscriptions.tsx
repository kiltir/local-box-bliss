
import { useMemo } from 'react';
import { useBoxPrices } from './useBoxPrices';
import { SubscriptionData } from '@/types/subscription';

const createSubscriptionOptions = (
  basePrice: number,
  subscription6MonthsPrice: number,
  subscription12MonthsPrice: number
) => [
  {
    duration: '6months' as const,
    label: '6 mois',
    months: 6,
    discount: 5,
    totalPrice: Math.round(subscription6MonthsPrice * 6),
    monthlyPrice: Math.round(subscription6MonthsPrice)
  },
  {
    duration: '1year' as const,
    label: '1 an',
    months: 12,
    discount: 10,
    totalPrice: Math.round(subscription12MonthsPrice * 12),
    monthlyPrice: Math.round(subscription12MonthsPrice)
  }
];

const baseSubscriptions: Omit<SubscriptionData, 'basePrice' | 'options'>[] = [
  {
    id: 1,
    baseTitle: "Box Découverte",
    theme: 'Découverte' as const,
    description: "Recevez chaque mois une sélection variée de douceurs artisanales pour découvrir de nouvelles saveurs authentiques de La Réunion.",
    image: "https://source.unsplash.com/1618160702438-9b02ab6515c9",
    items: 4,
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: 2,
    baseTitle: "Box Bourbon",
    theme: 'Bourbon' as const,
    description: "Recevez chaque mois une sélection raffinée pour vous offrir l'expérience de parfums et saveurs \"lontan\" avec des produits d'exception.",
    image: "/lovable-uploads/dfae2a49-8682-4e2d-b364-efe22d218a5e.png",
    items: 5,
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: 3,
    baseTitle: "Box Racine",
    theme: 'Racine' as const,
    description: "Recevez chaque mois des produits authentiques issus de recettes traditionnelles créoles transmises de génération en génération.",
    image: "https://source.unsplash.com/472396961693-142e6e269027",
    items: 4,
    rating: 4.2,
    reviewCount: 31,
  },
  {
    id: 4,
    baseTitle: "Box Saison",
    theme: 'Saison' as const,
    description: "Recevez chaque mois une sélection de produits de saison mettant en valeur les fruits et légumes du moment.",
    image: "/lovable-uploads/ac03653a-7722-48c5-a6c8-0a25a453791b.png",
    items: 4,
    rating: 4.6,
    reviewCount: 18,
  }
];

export const useSubscriptions = () => {
  const { prices, loading } = useBoxPrices();

  const subscriptions: SubscriptionData[] = useMemo(() => {
    return baseSubscriptions.map(sub => {
      const priceData = prices.find(p => p.box_id === sub.id);
      const basePrice = priceData?.unit_price || 0;
      const sub6Price = priceData?.subscription_6_months_price || basePrice * 0.95;
      const sub12Price = priceData?.subscription_12_months_price || basePrice * 0.9;

      return {
        ...sub,
        basePrice,
        options: createSubscriptionOptions(basePrice, sub6Price, sub12Price)
      };
    });
  }, [prices]);

  return { subscriptions, loading };
};

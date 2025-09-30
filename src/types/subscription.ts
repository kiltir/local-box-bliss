
export type SubscriptionDuration = '6months' | '1year';

export interface SubscriptionOption {
  duration: SubscriptionDuration;
  label: string;
  months: number;
  discount: number; // Pourcentage de réduction
  totalPrice: number;
  monthlyPrice: number;
}

export interface SubscriptionData {
  id: number;
  baseTitle: string;
  theme: 'Découverte' | 'Bourbon' | 'Racine' | 'Saison';
  basePrice: number;
  description: string;
  image: string;
  items: number;
  rating: number;
  reviewCount?: number;
  options: SubscriptionOption[];
}


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import StarRating from './StarRating';
import { SubscriptionData, SubscriptionOption } from '@/types/subscription';
import { Crown, Gift } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onClick: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onClick }) => {
  const [selectedOption, setSelectedOption] = useState<SubscriptionOption>(subscription.options[0]);
  const { addToCart } = useCart();

  const getBadgeColor = () => {
    switch (subscription.theme) {
      case 'Découverte':
        return 'bg-blue-100 text-blue-800';
      case 'Bourbon':
        return 'bg-amber-100 text-amber-800';
      case 'Tradition':
        return 'bg-green-100 text-green-800';
      case 'Saison':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCart = () => {
    // Créer un objet pour l'abonnement dans le panier
    const subscriptionItem = {
      id: subscription.id + 1000 + (selectedOption.duration === '6months' ? 0 : 100), // ID unique pour chaque type
      baseTitle: `${subscription.baseTitle} - Abonnement ${selectedOption.label}`,
      price: selectedOption.totalPrice,
      description: subscription.description,
      image: subscription.image,
      items: subscription.items,
      theme: subscription.theme,
      rating: subscription.rating,
      reviewCount: subscription.reviewCount,
      size: 'unique' as const,
      weightLimit: 5,
      products: [],
    };
    
    addToCart(subscriptionItem, 1, selectedOption.duration);
    toast.success(`Abonnement ${subscription.baseTitle} ${selectedOption.label} ajouté au panier !`);
  };

  const boxImage = "/lovable-uploads/c3069f51-0eec-4ebc-b702-b987e85233e0.png";

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gradient-to-r from-amber-200 to-orange-200 relative">
      {/* Badge Premium */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1 flex items-center gap-1">
          <Crown className="h-3 w-3" />
          ABONNEMENT
        </Badge>
      </div>

      <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <img 
          src={boxImage} 
          alt={subscription.baseTitle} 
          className="w-auto h-auto max-h-48 object-contain"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}>
          {subscription.theme}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{subscription.baseTitle}</h3>
          <Gift className="h-5 w-5 text-amber-500" />
        </div>
        
        <StarRating 
          rating={subscription.rating} 
          reviewCount={subscription.reviewCount}
          size={18}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">{subscription.description}</p>
        
        {/* Sélecteur de durée */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Choisissez votre formule :</h4>
          <div className="grid grid-cols-2 gap-2">
            {subscription.options.map((option) => (
              <button
                key={option.duration}
                onClick={() => setSelectedOption(option)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedOption.duration === option.duration
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{option.label}</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    -{option.discount}%
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  {option.monthlyPrice.toFixed(2)}€/mois
                </div>
                <div className="font-bold text-amber-600">
                  {option.totalPrice.toFixed(2)}€
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{subscription.items} produits/mois</span>
          <span className="text-green-600 font-semibold">
            Économie : {((subscription.basePrice * selectedOption.months) - selectedOption.totalPrice).toFixed(2)}€
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2 pt-4">
        <Button 
          variant="outline" 
          className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50"
          onClick={onClick}
        >
          Détails
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
          onClick={handleAddToCart}
        >
          S'abonner
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
